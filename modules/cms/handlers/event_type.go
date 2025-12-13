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

type EventTypeInitialInput struct {
	Title       *string  `json:"title" validate:"omitempty,max=300"`
	Slug        *string  `json:"slug" validate:"omitempty,max=300"`
	Description *string  `json:"description,omitempty" validate:"omitempty"`
	Image       *string  `json:"image,omitempty" validate:"omitempty"`
	Content     *string  `json:"content,omitempty" validate:"omitempty"`
	Galleries   []string `json:"galleries,omitempty" validate:"omitempty,max=5"`
}

type EventTypeHandler struct {
	DB *gorm.DB
}

func NewEventTypeHandler(db *gorm.DB) *EventTypeHandler {
	return &EventTypeHandler{DB: db}
}

func (h *EventTypeHandler) GetEventType(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		return utils.RespApi(c, "bad", "Id yang diberikan tidak valid", nil)
	}

	var eventType models.EventType
	if err := h.DB.First(&eventType, "id = ?", id).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal mendapatkan data EventType", err.Error())
	}

	return utils.RespApi(c, "ok", "Berhasil mendapatkan data EventType", eventType)
}

func (h *EventTypeHandler) GetAllEventTypes(c *fiber.Ctx) error {
	page, _ := strconv.Atoi(c.Query("page", "1"))
	limit, _ := strconv.Atoi(c.Query("limit", "10"))
	search := strings.ToLower(c.Query("search", ""))
	sort := c.Query("sort", "id")
	order := c.Query("order", "asc")

	offset := (page - 1) * limit

	db := h.DB.Model(&models.EventType{})

	// --- Filter search
	if search != "" {
		db = db.Where(`
			LOWER(title) LIKE ? OR 
			LOWER(description) LIKE ?`,
			"%"+search+"%", "%"+search+"%",
		)
	}

	// --- Hitung total
	var total int64
	if err := db.Count(&total).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal hitung total", err.Error())
	}

	// --- Sorting (whitelisted)
	validSortFields := map[string]string{
		"id":          "id",
		"title":       "title",
		"description": "description",
		"created_at":  "created_at",
	}
	sortBy, ok := validSortFields[sort]
	if !ok {
		sortBy = "id"
	}
	db = db.Order(fmt.Sprintf("%s %s", sortBy, order))

	// --- Ambil data
	var eventTypes []models.EventType
	if err := db.Offset(offset).Limit(limit).Find(&eventTypes).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal ambil data", err.Error())
	}

	totalPages := (total + int64(limit) - 1) / int64(limit)

	// Konversi eventTypes ke format yang bisa di-serialize dengan benar
	var responseEventTypes []map[string]interface{}
	for _, eventType := range eventTypes {
		// Buat response object dengan format JSON yang benar
		responseEventType := map[string]interface{}{
			"id":          eventType.ID,
			"created_at":  eventType.CreatedAt,
			"updated_at":  eventType.UpdatedAt,
			"title":       eventType.Title,
			"slug":        eventType.Slug,
			"description": eventType.Description,
			"image":       eventType.Image,
			"content":     eventType.Content,
			"galleries":   eventType.Galleries,
		}
		responseEventTypes = append(responseEventTypes, responseEventType)
	}

	result := fiber.Map{
		"event_types": responseEventTypes,
		"pagination": fiber.Map{
			"total":      total,
			"page":       page,
			"limit":      limit,
			"totalPages": totalPages,
		},
	}

	return utils.RespApi(c, "ok", "Berhasil mendapatkan data EventTypes", result)
}

func (h *EventTypeHandler) AddEventType(c *fiber.Ctx) error {
	var input EventTypeInitialInput

	contentType := c.Get("Content-Type")
	if strings.Contains(contentType, "multipart/form-data") {
		// Handle multipart form data for file uploads
		title := c.FormValue("title")
		slug := c.FormValue("slug")
		description := c.FormValue("description")
		content := c.FormValue("content")

		input = EventTypeInitialInput{
			Title:       &title,
			Slug:        &slug,
			Description: &description,
			Content:     &content,
		}

		// Handle file upload
		if file, err := c.FormFile("image"); err == nil && file != nil {
			filePath, err := utils.UploadFile(c, "image", "event_types")
			if err != nil {
				return utils.RespApi(c, "bad", "Gagal upload image EventType", err.Error())
			}
			input.Image = &filePath
		}

		// Handle galleries upload - process galleries first
		galleries := []string{}
		// Check if there are multiple files in the galleries field
		form, err := c.MultipartForm()
		if err == nil {
			galleryFiles := form.File["galleries"]
			if len(galleryFiles) > 0 {
				// Use UploadFileFlex to handle multiple files properly
				if filePaths, err := utils.UploadFileFlex(c, "galleries", "event_types"); err == nil && len(filePaths) > 0 {
					galleries = filePaths
				}
			}
		} else {
			// Fallback to single file processing if multipart form parsing fails
			galleryFiles, _ := c.FormFile("galleries")
			if galleryFiles != nil {
				// Handle single file
				if filePath, err := utils.UploadFile(c, "galleries", "event_types"); err == nil {
					galleries = append(galleries, filePath)
				}
			} else {
				// Handle multiple files using UploadFileFlex
				if filePaths, err := utils.UploadFileFlex(c, "galleries", "event_types"); err == nil && len(filePaths) > 0 {
					galleries = filePaths
				}
			}
		}

		if len(galleries) > 0 {
			input.Galleries = galleries
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

	// Convert galleries slice to JSON string for storage
	var galleriesJSON *string
	if len(input.Galleries) > 0 {
		galleriesBytes, err := json.Marshal(input.Galleries)
		if err != nil {
			return utils.RespApi(c, "ise", "Gagal mengkonversi galleries ke JSON", err.Error())
		}
		galleriesStr := string(galleriesBytes)
		galleriesJSON = &galleriesStr
	}

	eventType := models.EventType{
		Title:       input.Title,
		Slug:        input.Slug,
		Description: input.Description,
		Image:       input.Image,
		Content:     input.Content,
		Galleries:   galleriesJSON,
	}

	if err := h.DB.Create(&eventType).Error; err != nil {
		return utils.RespApi(c, "ise", "Tidak dapat membuat EventType", err.Error())
	}

	return utils.RespApi(c, "ok", "Berhasil membuat data EventType", eventType)
}

func (h *EventTypeHandler) UpdateEventType(c *fiber.Ctx) error {
	idParam := c.Params("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		return utils.RespApi(c, "bad", "ID yang diberikan tidak valid", nil)
	}

	var eventType models.EventType
	if err := h.DB.First(&eventType, "id = ?", id).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal Mendapatkan EventType", err.Error())
	}

	var input EventTypeInitialInput

	contentType := c.Get("Content-Type")
	if strings.Contains(contentType, "multipart/form-data") {
		// Handle multipart form data for file uploads
		title := c.FormValue("title")
		slug := c.FormValue("slug")
		description := c.FormValue("description")
		content := c.FormValue("content")

		input = EventTypeInitialInput{
			Title:       &title,
			Slug:        &slug,
			Description: &description,
			Content:     &content,
		}

		// Handle file upload
		if file, err := c.FormFile("image"); err == nil && file != nil {
			oldImagePath := ""
			if eventType.Image != nil {
				oldImagePath = *eventType.Image
			}

			filePath, err := utils.UpdateFile(c, oldImagePath, "image", "event_types")
			if err != nil {
				return utils.RespApi(c, "bad", "Gagal memperbarui image EventType", err.Error())
			}
			input.Image = &filePath
		} else {
			// Jika tidak ada file image yang diupload, gunakan image yang lama
			input.Image = eventType.Image
		}

		// Handle galleries upload
		var galleries []string

		// Step 1: Ambil galleries yang berupa string (URL) dari form value "galleries"
		// Jangan ambil dari DB (eventType.Galleries) karena kita ingin STATE TERBARU dari frontend (hasil penghapusan user)
		galleryForm, err := c.MultipartForm()
		if err == nil {
			// Retrieve existing strings
			if values, ok := galleryForm.Value["galleries"]; ok {
				for _, v := range values {
					if v != "" {
						galleries = append(galleries, v)
					}
				}
			}
		}

		// Step 2: Upload file baru
		if galleryFiles, err := c.MultipartForm(); err == nil && galleryFiles != nil {
			if len(galleryFiles.File["galleries"]) > 0 {
				if filePaths, err := utils.UploadFileFlex(c, "galleries", "event_types"); err == nil && len(filePaths) > 0 {
					galleries = append(galleries, filePaths...)
				}
			}
		}

		input.Galleries = galleries
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

	// Convert galleries slice to JSON string for storage
	var galleriesJSON *string
	if len(input.Galleries) > 0 {
		galleriesBytes, err := json.Marshal(input.Galleries)
		if err != nil {
			return utils.RespApi(c, "ise", "Gagal mengkonversi galleries ke JSON", err.Error())
		}
		galleriesStr := string(galleriesBytes)
		galleriesJSON = &galleriesStr
	}

	updates := map[string]interface{}{
		"title":       input.Title,
		"slug":        input.Slug,
		"description": input.Description,
		"image":       input.Image,
		"content":     input.Content,
		"galleries":   galleriesJSON,
	}

	if err := h.DB.Model(&eventType).Updates(updates).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal memperbarui data EventType", err.Error())
	}

	// Ambil data terbaru
	if err := h.DB.First(&eventType, "id = ?", id).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal mendapatkan data terbaru", err.Error())
	}

	// Buat response object dengan format JSON yang benar
	responseEventType := map[string]interface{}{
		"id":          eventType.ID,
		"created_at":  eventType.CreatedAt,
		"updated_at":  eventType.UpdatedAt,
		"title":       eventType.Title,
		"slug":        eventType.Slug,
		"description": eventType.Description,
		"image":       eventType.Image,
		"content":     eventType.Content,
		"galleries":   eventType.Galleries,
	}

	return utils.RespApi(c, "ok", "Berhasil memperbarui data EventType", responseEventType)
}

func (h *EventTypeHandler) DeleteEventType(c *fiber.Ctx) error {
	idParam := c.Params("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		return utils.RespApi(c, "bad", "ID yang diberikan tidak valid", nil)
	}

	var eventType models.EventType
	if err := h.DB.First(&eventType, "id = ?", id).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal Mendapatkan EventType", err.Error())
	}

	// Hapus file terkait jika ada
	if eventType.Image != nil && *eventType.Image != "" {
		utils.DeleteFile(*eventType.Image)
	}
	// Hapus gallery files
	if eventType.Galleries != nil {
		var galleries []string
		if err := json.Unmarshal([]byte(*eventType.Galleries), &galleries); err == nil {
			for _, galleryPath := range galleries {
				if galleryPath != "" {
					utils.DeleteFile(galleryPath)
				}
			}
		}
	}

	if err := h.DB.Delete(&eventType).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal Menghapus EventType", err.Error())
	}

	return utils.RespApi(c, "ok", "Berhasil Menghapus EventType", nil)
}
