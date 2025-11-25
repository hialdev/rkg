package handlers

import (
	"aldev/modules/cms/models"
	"aldev/utils"
	"fmt"
	"strconv"
	"strings"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type EventServiceInitialInput struct {
	Image       *string `json:"image,omitempty" validate:"omitempty"`
	Title       *string `json:"title" validate:"omitempty,max=300"`
	Description *string `json:"description" validate:"omitempty"`
}

type EventServiceHandler struct {
	DB *gorm.DB
}

func NewEventServiceHandler(db *gorm.DB) *EventServiceHandler {
	return &EventServiceHandler{DB: db}
}

func (h *EventServiceHandler) GetEventService(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		return utils.RespApi(c, "bad", "Id yang diberikan tidak valid", nil)
	}

	var eventService models.EventService
	if err := h.DB.First(&eventService, "id = ?", id).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal mendapatkan data EventService", err.Error())
	}

	return utils.RespApi(c, "ok", "Berhasil mendapatkan data EventService", eventService)
}

func (h *EventServiceHandler) GetAllEventServices(c *fiber.Ctx) error {
	page, _ := strconv.Atoi(c.Query("page", "1"))
	limit, _ := strconv.Atoi(c.Query("limit", "10"))
	search := strings.ToLower(c.Query("search", ""))
	sort := c.Query("sort", "id")
	order := c.Query("order", "asc")

	offset := (page - 1) * limit

	db := h.DB.Model(&models.EventService{})

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
	var eventServices []models.EventService
	if err := db.Offset(offset).Limit(limit).Find(&eventServices).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal ambil data", err.Error())
	}

	totalPages := (total + int64(limit) - 1) / int64(limit)

	// Konversi eventServices ke format yang bisa di-serialize dengan benar
	var responseEventServices []map[string]interface{}
	for _, eventService := range eventServices {
		// Buat response object dengan format JSON yang benar
		responseEventService := map[string]interface{}{
			"id":          eventService.ID,
			"created_at":  eventService.CreatedAt,
			"updated_at":  eventService.UpdatedAt,
			"title":       eventService.Title,
			"description": eventService.Description,
			"image":       eventService.Image,
		}
	responseEventServices = append(responseEventServices, responseEventService)
	}

	result := fiber.Map{
	"event_services": responseEventServices,
		"pagination": fiber.Map{
			"total":      total,
			"page":       page,
			"limit":      limit,
			"totalPages": totalPages,
		},
	}

	return utils.RespApi(c, "ok", "Berhasil mendapatkan data EventServices", result)
}

func (h *EventServiceHandler) AddEventService(c *fiber.Ctx) error {
	var input EventServiceInitialInput

	contentType := c.Get("Content-Type")
	if strings.Contains(contentType, "multipart/form-data") {
		// Handle multipart form data for file uploads
		title := c.FormValue("title")
		description := c.FormValue("description")

		input = EventServiceInitialInput{
			Title:       &title,
			Description: &description,
		}

		// Handle file upload
		if file, err := c.FormFile("image"); err == nil && file != nil {
			filePath, err := utils.UploadFile(c, "image", "event_services")
			if err != nil {
				return utils.RespApi(c, "bad", "Gagal upload image EventService", err.Error())
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

	eventService := models.EventService{
		Image:       input.Image,
		Title:       input.Title,
		Description: input.Description,
	}

	if err := h.DB.Create(&eventService).Error; err != nil {
		return utils.RespApi(c, "ise", "Tidak dapat membuat EventService", err.Error())
	}

	return utils.RespApi(c, "ok", "Berhasil membuat data EventService", eventService)
}

func (h *EventServiceHandler) UpdateEventService(c *fiber.Ctx) error {
	idParam := c.Params("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		return utils.RespApi(c, "bad", "ID yang diberikan tidak valid", nil)
	}

	var eventService models.EventService
	if err := h.DB.First(&eventService, "id = ?", id).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal Mendapatkan EventService", err.Error())
	}

	var input EventServiceInitialInput

	contentType := c.Get("Content-Type")
	if strings.Contains(contentType, "multipart/form-data") {
		// Handle multipart form data for file uploads
		title := c.FormValue("title")
		description := c.FormValue("description")

		input = EventServiceInitialInput{
			Title:       &title,
			Description: &description,
		}

		// Handle file upload
		if file, err := c.FormFile("image"); err == nil && file != nil {
			oldImagePath := ""
			if eventService.Image != nil {
				oldImagePath = *eventService.Image
			}

			filePath, err := utils.UpdateFile(c, oldImagePath, "image", "event_services")
			if err != nil {
				return utils.RespApi(c, "bad", "Gagal memperbarui image EventService", err.Error())
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

	updates := map[string]interface{}{
		"image":       input.Image,
		"title":       input.Title,
		"description": input.Description,
	}

	if err := h.DB.Model(&eventService).Updates(updates).Error; err != nil {
	return utils.RespApi(c, "ise", "Gagal memperbarui data EventService", err.Error())
	}

	// Ambil data terbaru
	if err := h.DB.First(&eventService, "id = ?", id).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal mendapatkan data terbaru", err.Error())
	}

	// Buat response object dengan format JSON yang benar
	responseEventService := map[string]interface{}{
	"id":          eventService.ID,
		"created_at":  eventService.CreatedAt,
		"updated_at":  eventService.UpdatedAt,
		"title":       eventService.Title,
		"description": eventService.Description,
		"image":       eventService.Image,
	}

	return utils.RespApi(c, "ok", "Berhasil memperbarui data EventService", responseEventService)
}

func (h *EventServiceHandler) DeleteEventService(c *fiber.Ctx) error {
	idParam := c.Params("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		return utils.RespApi(c, "bad", "ID yang diberikan tidak valid", nil)
	}

	var eventService models.EventService
	if err := h.DB.First(&eventService, "id = ?", id).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal Mendapatkan EventService", err.Error())
	}

	// Hapus file terkait jika ada
	if eventService.Image != nil && *eventService.Image != "" {
	utils.DeleteFile(*eventService.Image)
	}

	if err := h.DB.Delete(&eventService).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal Menghapus EventService", err.Error())
	}

	return utils.RespApi(c, "ok", "Berhasil Menghapus EventService", nil)
}
