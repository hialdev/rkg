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
			Title:       &title,
			Slug:        &slug,
			Description: &description,
			Location:    &location,
			Country:     &country,
			Type:        &tripType,
			Duration:    &duration,
			Price:       price,
			MinPeople:   minPeople,
			MeetPoint:   &meetPoint,
			Content:     &content,
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

		// Handle file upload
		if file, err := c.FormFile("image"); err == nil && file != nil {
			filePath, err := utils.UploadFile(c, "image", "trips")
			if err != nil {
				return utils.RespApi(c, "bad", "Gagal upload image Trip", err.Error())
			}
			input.Image = &filePath
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
			Title:       &title,
			Slug:        &slug,
			Description: &description,
			Location:    &location,
			Country:     &country,
			Type:        &tripType,
			Duration:    &duration,
			Price:       price,
			MinPeople:   minPeople,
			MeetPoint:   &meetPoint,
			Content:     &content,
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

		// Handle file upload
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

	// Konversi interface{} ke []byte untuk field JSON dalam update
	var openDatesUpdate interface{}
	if input.OpenDates != nil {
		if bytes, err := json.Marshal(input.OpenDates); err == nil {
			openDatesUpdate = bytes
		} else {
			openDatesUpdate = []byte("null")
		}
	} else {
		openDatesUpdate = nil
	}

	var destinationsUpdate interface{}
	if input.Destinations != nil {
		if bytes, err := json.Marshal(input.Destinations); err == nil {
			destinationsUpdate = bytes
		} else {
			destinationsUpdate = []byte("null")
		}
	} else {
		destinationsUpdate = nil
	}

	var itineraryUpdate interface{}
	if input.Itinerary != nil {
		if bytes, err := json.Marshal(input.Itinerary); err == nil {
			itineraryUpdate = bytes
		} else {
			itineraryUpdate = []byte("null")
		}
	} else {
		itineraryUpdate = nil
	}

	updates := map[string]interface{}{
		"title":        input.Title,
		"slug":         input.Slug,
		"description":  input.Description,
		"location":     input.Location,
		"country":      input.Country,
		"type":         input.Type,
		"duration":     input.Duration,
		"price":        input.Price,
		"image":        input.Image,
		"min_people":   input.MinPeople,
		"meet_point":   input.MeetPoint,
		"content":      input.Content,
		"open_dates":   openDatesUpdate,
		"destinations": destinationsUpdate,
		"itinerary":    itineraryUpdate,
	}

	if err := h.DB.Model(&trip).Updates(updates).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal memperbarui data Trip", err.Error())
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

	if err := h.DB.Delete(&trip).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal Menghapus Trip", err.Error())
	}

	return utils.RespApi(c, "ok", "Berhasil Menghapus Trip", nil)
}
