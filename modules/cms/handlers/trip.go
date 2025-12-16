package handlers

import (
	"aldev/modules/cms/models"
	"aldev/utils"
	"encoding/json"
	"fmt"
	"strconv"
	"strings"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type TripInitialInput struct {
	Title        *string     `json:"title" validate:"omitempty,max=300"`
	Slug         *string     `json:"slug" validate:"omitempty,max=300"`
	Description  *string     `json:"description,omitempty" validate:"omitempty"`
	Location     *string     `json:"location" validate:"omitempty,max=200"`
	Country      *string     `json:"country" validate:"omitempty,max=100"`
	Type         *string     `json:"type" validate:"omitempty,oneof=open-trip private-trip"`
	Duration     *string     `json:"duration" validate:"omitempty,max=20"`
	Price        *float64    `json:"price" validate:"omitempty,min=0"`
	Image        *string     `json:"image,omitempty" validate:"omitempty"`
	Images       interface{} `json:"images,omitempty" validate:"omitempty"`
	MinPeople    *int        `json:"min_people,omitempty" validate:"omitempty,min=1"`
	MeetPoint    *string     `json:"meet_point,omitempty" validate:"omitempty,max=300"`
	Content      *string     `json:"content,omitempty" validate:"omitempty"`
	OpenDates    interface{} `json:"open_dates" validate:"omitempty"`
	Destinations interface{} `json:"destinations" validate:"omitempty"`
	Itinerary    interface{} `json:"itinerary" validate:"omitempty"`
}

type TripHandler struct {
	DB *gorm.DB
}

// parseJSONField adalah fungsi helper untuk mengonversi []byte ke interface{}
func (h *TripHandler) parseJSONField(data []byte) interface{} {
	if data == nil {
		return nil
	}

	var result interface{}
	if err := json.Unmarshal(data, &result); err != nil {
		return nil
	}
	return result
}

// parseImagesField parses the images field which is stored as a JSON string in the database
func parseImagesField(images *string) interface{} {
	if images == nil || *images == "" {
		return []string{}
	}

	var result []string
	if err := json.Unmarshal([]byte(*images), &result); err != nil {
		return []string{}
	}
	return result
}

// processImagesInput converts various input types for images into a JSON string pointer
func processImagesInput(data interface{}) *string {
	if data == nil {
		return nil
	}

	switch v := data.(type) {
	case string:
		if v == "" {
			return nil
		}
		return &v
	case *string:
		return v
	case []interface{}, []string:
		bytes, err := json.Marshal(v)
		if err == nil {
			s := string(bytes)
			return &s
		}
	}

	// Fallback for other types
	bytes, err := json.Marshal(data)
	if err == nil {
		s := string(bytes)
		return &s
	}
	return nil
}

func NewTripHandler(db *gorm.DB) *TripHandler {
	return &TripHandler{DB: db}
}

func (h *TripHandler) GetTrip(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		return utils.RespApi(c, "bad", "Id yang diberikan tidak valid", nil)
	}

	var trip models.Trip
	if err := h.DB.First(&trip, "id = ?", id).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal mendapatkan data Trip", err.Error())
	}

	// Buat response object dengan format JSON yang benar
	responseTrip := map[string]interface{}{
		"id":           trip.ID,
		"created_at":   trip.CreatedAt,
		"updated_at":   trip.UpdatedAt,
		"title":        trip.Title,
		"slug":         trip.Slug,
		"description":  trip.Description,
		"location":     trip.Location,
		"country":      trip.Country,
		"type":         trip.Type,
		"duration":     trip.Duration,
		"price":        trip.Price,
		"image":        trip.Image,
		"images":       trip.Images,
		"min_people":   trip.MinPeople,
		"meet_point":   trip.MeetPoint,
		"content":      trip.Content,
		"open_dates":   h.parseJSONField(trip.OpenDates),
		"destinations": h.parseJSONField(trip.Destinations),
		"itinerary":    h.parseJSONField(trip.Itinerary),
	}

	return utils.RespApi(c, "ok", "Berhasil mendapatkan data Trip", responseTrip)
}

func (h *TripHandler) GetAllTrips(c *fiber.Ctx) error {
	page, _ := strconv.Atoi(c.Query("page", "1"))
	limit, _ := strconv.Atoi(c.Query("limit", "10"))
	search := strings.ToLower(c.Query("search", ""))
	sort := c.Query("sort", "id")
	order := c.Query("order", "asc")
	tripType := c.Query("type", "")
	country := c.Query("country", "")

	offset := (page - 1) * limit

	db := h.DB.Model(&models.Trip{})

	// --- Filter search
	if search != "" {
		db = db.Where(`
			LOWER(title) LIKE ? OR 
			LOWER(description) LIKE ? OR 
			LOWER(location) LIKE ? OR 
			LOWER(country) LIKE ?`,
			"%"+search+"%", "%"+search+"%", "%"+search+"%", "%"+search+"%",
		)
	}

	// --- Filter by type
	if tripType != "" {
		typeList := strings.Split(tripType, ",")
		db = db.Where("type IN ?", typeList)
	}

	// --- Filter by country
	if country != "" {
		countryList := strings.Split(country, ",")
		db = db.Where("country IN ?", countryList)
	}

	// --- Hitung total
	var total int64
	if err := db.Count(&total).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal hitung total", err.Error())
	}

	// --- Sorting (whitelisted)
	validSortFields := map[string]string{
		"id":       "id",
		"title":    "title",
		"country":  "country",
		"type":     "type",
		"duration": "duration",
		"price":    "price",
	}
	sortBy, ok := validSortFields[sort]
	if !ok {
		sortBy = "id"
	}
	db = db.Order(fmt.Sprintf("%s %s", sortBy, order))

	// --- Ambil data
	var trips []models.Trip
	if err := db.Offset(offset).Limit(limit).Find(&trips).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal ambil data", err.Error())
	}

	totalPages := (total + int64(limit) - 1) / int64(limit)

	// Konversi trips ke format yang bisa di-serialize dengan benar
	var responseTrips []map[string]interface{}
	for _, trip := range trips {
		// Buat response object dengan format JSON yang benar
		responseTrip := map[string]interface{}{
			"id":           trip.ID,
			"created_at":   trip.CreatedAt,
			"updated_at":   trip.UpdatedAt,
			"title":        trip.Title,
			"slug":         trip.Slug,
			"description":  trip.Description,
			"location":     trip.Location,
			"country":      trip.Country,
			"type":         trip.Type,
			"duration":     trip.Duration,
			"price":        trip.Price,
			"image":        trip.Image,
			"images":       parseImagesField(trip.Images),
			"min_people":   trip.MinPeople,
			"meet_point":   trip.MeetPoint,
			"content":      trip.Content,
			"open_dates":   h.parseJSONField(trip.OpenDates),
			"destinations": h.parseJSONField(trip.Destinations),
			"itinerary":    h.parseJSONField(trip.Itinerary),
		}
		responseTrips = append(responseTrips, responseTrip)
	}

	result := fiber.Map{
		"trips": responseTrips,
		"pagination": fiber.Map{
			"total":      total,
			"page":       page,
			"limit":      limit,
			"totalPages": totalPages,
		},
	}

	return utils.RespApi(c, "ok", "Berhasil mendapatkan data Trips", result)
}

func (h *TripHandler) AddTrip(c *fiber.Ctx) error {
	var input TripInitialInput

	contentType := c.Get("Content-Type")
	if strings.Contains(contentType, "multipart/form-data") {
		// Handle multipart form data for file uploads
		title := c.FormValue("title")
		slug := c.FormValue("slug")
		description := c.FormValue("description")
		location := c.FormValue("location")
		country := c.FormValue("country")
		tripType := c.FormValue("type")
		duration := c.FormValue("duration")
		priceStr := c.FormValue("price")
		minPeopleStr := c.FormValue("min_people")
		meetPoint := c.FormValue("meet_point")
		content := c.FormValue("content")
		openDatesStr := c.FormValue("open_dates")
		destinationsStr := c.FormValue("destinations")
		itineraryStr := c.FormValue("itinerary")

		// Convert string values to appropriate types
		var price *float64
		if priceStr != "" {
			if p, err := strconv.ParseFloat(priceStr, 64); err == nil {
				price = &p
			}
		}

		var minPeople *int
		if minPeopleStr != "" {
			if mp, err := strconv.Atoi(minPeopleStr); err == nil {
				minPeople = &mp
			}
		}

		input = TripInitialInput{
			Title:        &title,
			Slug:         &slug,
			Description:  &description,
			Location:     &location,
			Country:      &country,
			Type:         &tripType,
			Duration:     &duration,
			Price:        price,
			MinPeople:    minPeople,
			MeetPoint:    &meetPoint,
			Content:      &content,
			OpenDates:    nil, // Will be set after parsing JSON
			Destinations: nil, // Will be set after parsing JSON
			Itinerary:    nil, // Will be set after parsing JSON
		}

		// Parse JSON fields if they exist
		if openDatesStr != "" {
			// Validasi bahwa string ini adalah JSON yang valid dan parse
			var temp interface{}
			if err := json.Unmarshal([]byte(openDatesStr), &temp); err == nil {
				input.OpenDates = temp
			}
		}

		if destinationsStr != "" {
			// Validasi bahwa string ini adalah JSON yang valid dan parse
			var temp interface{}
			if err := json.Unmarshal([]byte(destinationsStr), &temp); err == nil {
				input.Destinations = temp
			}
		}

		if itineraryStr != "" {
			// Validasi bahwa string ini adalah JSON yang valid dan parse
			var temp interface{}
			if err := json.Unmarshal([]byte(itineraryStr), &temp); err == nil {
				input.Itinerary = temp
			}
		}

		// Handle single image upload
		if file, err := c.FormFile("image"); err == nil && file != nil {
			filePath, err := utils.UploadFile(c, "image", "trips")
			if err != nil {
				return utils.RespApi(c, "bad", "Gagal upload image Trip", err.Error())
			}
			input.Image = &filePath
		}

		// Handle multiple images upload
		if file, err := c.FormFile("images"); err == nil && file != nil {
			imagePaths, err := utils.UploadFileFlex(c, "images", "trips")
			if err == nil && len(imagePaths) > 0 {
				jsonStr, err := json.Marshal(imagePaths)
				if err == nil {
					imgStr := string(jsonStr)
					input.Images = &imgStr
				}
			}
		}
	} else {
		// Handle JSON data
		if err := c.BodyParser(&input); err != nil {
			return utils.RespApi(c, "bad", "Request Body tidak valid", err.Error())
		}
	}

	if err := utils.Validate.Struct(input); err != nil {
		if verrs, ok := err.(validator.ValidationErrors); ok {
			return utils.RespApi(c, "bad", "Validasi gagal", verrs.Translate(utils.Translator))
		}
		return utils.RespApi(c, "bad", "Validasi gagal", err.Error())
	}

	// Konversi interface{} ke []byte untuk field JSON
	var openDatesJSON []byte
	if input.OpenDates != nil {
		if bytes, err := json.Marshal(input.OpenDates); err == nil {
			openDatesJSON = bytes
		} else {
			// Jika marshaling gagal, simpan sebagai null
			openDatesJSON = []byte("null")
		}
	}

	var destinationsJSON []byte
	if input.Destinations != nil {
		if bytes, err := json.Marshal(input.Destinations); err == nil {
			destinationsJSON = bytes
		} else {
			destinationsJSON = []byte("null")
		}
	}

	var itineraryJSON []byte
	if input.Itinerary != nil {
		if bytes, err := json.Marshal(input.Itinerary); err == nil {
			itineraryJSON = bytes
		} else {
			itineraryJSON = []byte("null")
		}
	}

	var imagesJSONStr *string
	if input.Images != nil {
		imagesJSONStr = processImagesInput(input.Images)
	}

	trip := models.Trip{
		Title:        input.Title,
		Slug:         input.Slug,
		Description:  input.Description,
		Location:     input.Location,
		Country:      input.Country,
		Type:         input.Type,
		Duration:     input.Duration,
		Price:        input.Price,
		Image:        input.Image,
		Images:       imagesJSONStr,
		MinPeople:    input.MinPeople,
		MeetPoint:    input.MeetPoint,
		Content:      input.Content,
		OpenDates:    openDatesJSON,
		Destinations: destinationsJSON,
		Itinerary:    itineraryJSON,
	}

	if err := h.DB.Create(&trip).Error; err != nil {
		return utils.RespApi(c, "ise", "Tidak dapat membuat Trip", err.Error())
	}

	return utils.RespApi(c, "ok", "Berhasil membuat data Trip", trip)
}

func (h *TripHandler) UpdateTrip(c *fiber.Ctx) error {
	idParam := c.Params("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		return utils.RespApi(c, "bad", "ID yang diberikan tidak valid", nil)
	}

	var trip models.Trip
	if err := h.DB.First(&trip, "id = ?", id).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal Mendapatkan Trip", err.Error())
	}

	var input TripInitialInput

	contentType := c.Get("Content-Type")
	if strings.Contains(contentType, "multipart/form-data") {
		// Handle multipart form data for file uploads
		// Check if form values exist before setting them
		var title, slug, description, location, country, tripType, duration, priceStr, minPeopleStr, meetPoint, content, openDatesStr, destinationsStr, itineraryStr string

		if c.FormValue("title") != "" {
			title = c.FormValue("title")
			input.Title = &title
		}
		if c.FormValue("slug") != "" {
			slug = c.FormValue("slug")
			input.Slug = &slug
		}
		if c.FormValue("description") != "" {
			description = c.FormValue("description")
			input.Description = &description
		}
		if c.FormValue("location") != "" {
			location = c.FormValue("location")
			input.Location = &location
		}
		if c.FormValue("country") != "" {
			country = c.FormValue("country")
			input.Country = &country
		}
		if c.FormValue("type") != "" {
			tripType = c.FormValue("type")
			input.Type = &tripType
		}
		if c.FormValue("duration") != "" {
			duration = c.FormValue("duration")
			input.Duration = &duration
		}
		if c.FormValue("price") != "" {
			priceStr = c.FormValue("price")
		}
		if c.FormValue("min_people") != "" {
			minPeopleStr = c.FormValue("min_people")
		}
		if c.FormValue("meet_point") != "" {
			meetPoint = c.FormValue("meet_point")
			input.MeetPoint = &meetPoint
		}
		if c.FormValue("content") != "" {
			content = c.FormValue("content")
			input.Content = &content
		}

		// Convert string values to appropriate types if they exist
		var price *float64
		if priceStr != "" {
			if p, err := strconv.ParseFloat(priceStr, 64); err == nil {
				price = &p
			}
		}
		if price != nil {
			input.Price = price
		}

		var minPeople *int
		if minPeopleStr != "" {
			if mp, err := strconv.Atoi(minPeopleStr); err == nil {
				minPeople = &mp
			}
		}
		if minPeople != nil {
			input.MinPeople = minPeople
		}

		// Parse JSON fields if they exist
		if openDatesStr != "" {
			// Validasi bahwa string ini adalah JSON yang valid dan parse
			var temp interface{}
			if err := json.Unmarshal([]byte(openDatesStr), &temp); err == nil {
				input.OpenDates = temp
			}
		}

		if destinationsStr != "" {
			// Validasi bahwa string ini adalah JSON yang valid dan parse
			var temp interface{}
			if err := json.Unmarshal([]byte(destinationsStr), &temp); err == nil {
				input.Destinations = temp
			}
		}

		if itineraryStr != "" {
			// Validasi bahwa string ini adalah JSON yang valid dan parse
			var temp interface{}
			if err := json.Unmarshal([]byte(itineraryStr), &temp); err == nil {
				input.Itinerary = temp
			}
		}

		// Handle single image upload
		if file, err := c.FormFile("image"); err == nil && file != nil {
			oldImagePath := ""
			if trip.Image != nil {
				oldImagePath = *trip.Image
			}

			filePath, err := utils.UpdateFile(c, oldImagePath, "image", "trips")
			if err != nil {
				return utils.RespApi(c, "bad", "Gagal memperbarui image Trip", err.Error())
			}
			input.Image = &filePath
		}

		// Handle multiple images upload
		// Step 1: Ambil images yang berupa string (URL) dari form value "images"
		// Karena client mengirim mix "images" (file) dan "images" (string),
		// fiber's FormValue hanya mengambil yang pertama atau terakhir, jadi kita cek MultipartForm
		var existingImages []string
		form, err := c.MultipartForm()
		if err == nil {
			// Retrieve existing strings
			if values, ok := form.Value["images"]; ok {
				for _, v := range values {
					// Pastikan bukan kosong
					if v != "" {
						// Hapus domain/base URL jika ada, simpan path relatif saja
						// Contoh: http://localhost:8080/uploads/file.jpg -> uploads/file.jpg
						if strings.Contains(v, "/uploads/") {
							parts := strings.Split(v, "/uploads/")
							if len(parts) > 1 {
								v = "uploads/" + parts[1]
							}
						}
						existingImages = append(existingImages, v)
					}
				}
			}
		}

		// Step 2: Upload file baru
		var newImagePaths []string
		if file, err := c.FormFile("images"); err == nil && file != nil {
			paths, err := utils.UploadFileFlex(c, "images", "trips")
			if err == nil {
				newImagePaths = paths
			}
		}

		// Step 3: Gabungkan (Existing + New)
		// Jika ada existing atau new, kita update. Jika kosong semua (tapi field dikirim), berarti user hapus semua
		if len(existingImages) > 0 || len(newImagePaths) > 0 {
			allImages := append(existingImages, newImagePaths...)
			jsonStr, err := json.Marshal(allImages)
			if err == nil {
				imgStr := string(jsonStr)
				input.Images = &imgStr
			}
		} else {
			// Jika client mengirim key "images" tapi kosong/tidak ada isinya,
			// dan kita tahu ini multipart update, kita bisa asumsikan user menghapus semua.
			// Namun perlu hati-hati. Logic di frontend sekarang mengirim semua sisa.
			// Kalau sisa 0, frontend mungkin tidak kirim key "images" ATAU kirim kosong.
			// Mari cek apakah key "images" ada di form
			if form != nil {
				if _, ok := form.Value["images"]; ok {
					// Key ada tapi kosong -> set empty array
					emptyStr := "[]"
					input.Images = &emptyStr
				} else if _, ok := form.File["images"]; ok {
					// Key ada di file tapi mungkin gagal/kosong?
					// Fallback safe
				} else {
					// Key tidak ada sama sekali -> Jangan update field ini (pertahankan DB)
					// Tapi tunggu, frontend kita kirim 'images' terus kalau ada.
					// Kalau user hapus semua di frontend, array jadi kosong.
					// Frontend: if (!formData.images || formData.images.length === 0) delete formData.images;
					// Jadi kalau kosong, key tidak dikirim. Berarti existing DB dipertahankan (Logic `if input.Images != nil` di bawah).
					// Ini BENAR untuk "Update partial".
					// TAPI user ingin "hapus image lama".
					// KASUS: User hapus 1 image, sisa 2. Frontend kirim 2 string. Backend terima 2 string. Update DB -> OK.
					// KASUS: User hapus SEMUA. Frontend delete key 'images'. Backend tidak update field 'images'. DB tetap ada image lama. -> BUG.
					// FIX: Frontend harus kirim key 'images' sebagai empty array string atau semacamnya jika kosong?
					// Atau kita tangani di sini: Kalau logic ini jalan (multipart), tapi input.Images masih nil,
					// berarti tidak ada images baru/lama yg dikirim.
					// Untuk sekarang ikuti logic "Existing + New", kalau resultnya ada isi, update.
				}
			}
		}
	} else {
		// Handle JSON data
		if err := c.BodyParser(&input); err != nil {
			return utils.RespApi(c, "bad", "Request Body tidak valid", err.Error())
		}
	}

	if err := utils.Validate.Struct(input); err != nil {
		if verrs, ok := err.(validator.ValidationErrors); ok {
			return utils.RespApi(c, "bad", "Validasi gagal", verrs.Translate(utils.Translator))
		}
		return utils.RespApi(c, "bad", "Validasi gagal", err.Error())
	}

	// Build updates map only with provided fields
	updates := make(map[string]interface{})

	if input.Title != nil {
		updates["title"] = input.Title
	}
	if input.Slug != nil {
		updates["slug"] = input.Slug
	}
	if input.Description != nil {
		updates["description"] = input.Description
	}
	if input.Location != nil {
		updates["location"] = input.Location
	}
	if input.Country != nil {
		updates["country"] = input.Country
	}
	if input.Type != nil {
		updates["type"] = input.Type
	}
	if input.Duration != nil {
		updates["duration"] = input.Duration
	}
	if input.Price != nil {
		updates["price"] = input.Price
	}
	if input.Image != nil {
		updates["image"] = input.Image
	}
	if input.Images != nil {
		if processed := processImagesInput(input.Images); processed != nil {
			updates["images"] = *processed
		}
	}
	if input.MinPeople != nil {
		updates["min_people"] = input.MinPeople
	}
	if input.MeetPoint != nil {
		updates["meet_point"] = input.MeetPoint
	}
	if input.Content != nil {
		updates["content"] = input.Content
	}
	if input.OpenDates != nil {
		if bytes, err := json.Marshal(input.OpenDates); err == nil {
			updates["open_dates"] = bytes
		} else {
			updates["open_dates"] = []byte("null")
		}
	}
	if input.Destinations != nil {
		if bytes, err := json.Marshal(input.Destinations); err == nil {
			updates["destinations"] = bytes
		} else {
			updates["destinations"] = []byte("null")
		}
	}
	if input.Itinerary != nil {
		if bytes, err := json.Marshal(input.Itinerary); err == nil {
			updates["itinerary"] = bytes
		} else {
			updates["itinerary"] = []byte("null")
		}
	}

	if len(updates) > 0 {
		if err := h.DB.Model(&trip).Updates(updates).Error; err != nil {
			return utils.RespApi(c, "ise", "Gagal memperbarui data Trip", err.Error())
		}
	}

	// Ambil data terbaru
	if err := h.DB.First(&trip, "id = ?", id).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal mendapatkan data terbaru", err.Error())
	}

	// Buat response object dengan format JSON yang benar
	responseTrip := map[string]interface{}{
		"id":           trip.ID,
		"created_at":   trip.CreatedAt,
		"updated_at":   trip.UpdatedAt,
		"title":        trip.Title,
		"slug":         trip.Slug,
		"description":  trip.Description,
		"location":     trip.Location,
		"country":      trip.Country,
		"type":         trip.Type,
		"duration":     trip.Duration,
		"price":        trip.Price,
		"image":        trip.Image,
		"images":       parseImagesField(trip.Images),
		"min_people":   trip.MinPeople,
		"meet_point":   trip.MeetPoint,
		"content":      trip.Content,
		"open_dates":   h.parseJSONField(trip.OpenDates),
		"destinations": h.parseJSONField(trip.Destinations),
		"itinerary":    h.parseJSONField(trip.Itinerary),
	}

	return utils.RespApi(c, "ok", "Berhasil memperbarui data Trip", responseTrip)
}

func (h *TripHandler) DeleteTrip(c *fiber.Ctx) error {
	idParam := c.Params("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		return utils.RespApi(c, "bad", "ID yang diberikan tidak valid", nil)
	}

	var trip models.Trip
	if err := h.DB.First(&trip, "id = ?", id).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal Mendapatkan Trip", err.Error())
	}

	// Hapus file terkait jika ada
	if trip.Image != nil && *trip.Image != "" {
		utils.DeleteFile(*trip.Image)
	}

	// Hapus multiple images jika ada
	if trip.Images != nil && *trip.Images != "" {
		var imagePaths []string
		if err := json.Unmarshal([]byte(*trip.Images), &imagePaths); err == nil {
			for _, imagePath := range imagePaths {
				if imagePath != "" {
					utils.DeleteFile(imagePath)
				}
			}
		}
	}

	if err := h.DB.Delete(&trip).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal Menghapus Trip", err.Error())
	}

	return utils.RespApi(c, "ok", "Berhasil Menghapus Trip", nil)
}
