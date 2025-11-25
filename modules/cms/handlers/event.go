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

type EventInitialInput struct {
	Title       *string `json:"title" validate:"omitempty,max=300"`
	Slug        *string `json:"slug" validate:"omitempty,max=300"`
	Image       *string `json:"image,omitempty" validate:"omitempty"`
	Description *string `json:"description,omitempty" validate:"omitempty"`
	Content     *string `json:"content,omitempty" validate:"omitempty"`
	Client      *string `json:"client,omitempty" validate:"omitempty,max=300"`
}

type EventHandler struct {
	DB *gorm.DB
}

func NewEventHandler(db *gorm.DB) *EventHandler {
	return &EventHandler{DB: db}
}

func (h *EventHandler) GetEvent(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		return utils.RespApi(c, "bad", "Id yang diberikan tidak valid", nil)
	}

	var event models.Event
	if err := h.DB.First(&event, "id = ?", id).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal mendapatkan data Event", err.Error())
	}

	return utils.RespApi(c, "ok", "Berhasil mendapatkan data Event", event)
}

func (h *EventHandler) GetAllEvents(c *fiber.Ctx) error {
	page, _ := strconv.Atoi(c.Query("page", "1"))
	limit, _ := strconv.Atoi(c.Query("limit", "10"))
	search := strings.ToLower(c.Query("search", ""))
	sort := c.Query("sort", "id")
	order := c.Query("order", "asc")

	offset := (page - 1) * limit

	db := h.DB.Model(&models.Event{})

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
		"client":      "client",
		"created_at":  "created_at",
	}
	sortBy, ok := validSortFields[sort]
	if !ok {
		sortBy = "id"
	}
	db = db.Order(fmt.Sprintf("%s %s", sortBy, order))

	// --- Ambil data
	var events []models.Event
	if err := db.Offset(offset).Limit(limit).Find(&events).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal ambil data", err.Error())
	}

	totalPages := (total + int64(limit) - 1) / int64(limit)

	// Konversi events ke format yang bisa di-serialize dengan benar
	var responseEvents []map[string]interface{}
	for _, event := range events {
		// Buat response object dengan format JSON yang benar
		responseEvent := map[string]interface{}{
			"id":          event.ID,
			"created_at":  event.CreatedAt,
			"updated_at":  event.UpdatedAt,
			"title":       event.Title,
			"slug":        event.Slug,
			"image":       event.Image,
			"description": event.Description,
			"content":     event.Content,
			"client":      event.Client,
		}
	responseEvents = append(responseEvents, responseEvent)
	}

	result := fiber.Map{
		"events": responseEvents,
		"pagination": fiber.Map{
			"total":      total,
			"page":       page,
			"limit":      limit,
			"totalPages": totalPages,
		},
	}

	return utils.RespApi(c, "ok", "Berhasil mendapatkan data Events", result)
}

func (h *EventHandler) AddEvent(c *fiber.Ctx) error {
	var input EventInitialInput

	contentType := c.Get("Content-Type")
	if strings.Contains(contentType, "multipart/form-data") {
		// Handle multipart form data for file uploads
		title := c.FormValue("title")
		slug := c.FormValue("slug")
		description := c.FormValue("description")
		content := c.FormValue("content")
		client := c.FormValue("client")

		input = EventInitialInput{
			Title:       &title,
			Slug:        &slug,
			Description: &description,
			Content:     &content,
			Client:      &client,
		}

		// Handle file upload
		if file, err := c.FormFile("image"); err == nil && file != nil {
			filePath, err := utils.UploadFile(c, "image", "events")
			if err != nil {
				return utils.RespApi(c, "bad", "Gagal upload image Event", err.Error())
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

	event := models.Event{
	Title:       input.Title,
		Slug:        input.Slug,
		Image:       input.Image,
		Description: input.Description,
		Content:     input.Content,
		Client:      input.Client,
	}

	if err := h.DB.Create(&event).Error; err != nil {
		return utils.RespApi(c, "ise", "Tidak dapat membuat Event", err.Error())
	}

	return utils.RespApi(c, "ok", "Berhasil membuat data Event", event)
}

func (h *EventHandler) UpdateEvent(c *fiber.Ctx) error {
	idParam := c.Params("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		return utils.RespApi(c, "bad", "ID yang diberikan tidak valid", nil)
	}

	var event models.Event
	if err := h.DB.First(&event, "id = ?", id).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal Mendapatkan Event", err.Error())
	}

	var input EventInitialInput

	contentType := c.Get("Content-Type")
	if strings.Contains(contentType, "multipart/form-data") {
	// Handle multipart form data for file uploads
		title := c.FormValue("title")
		slug := c.FormValue("slug")
		description := c.FormValue("description")
		content := c.FormValue("content")
		client := c.FormValue("client")

		input = EventInitialInput{
			Title:       &title,
			Slug:        &slug,
			Description: &description,
			Content:     &content,
			Client:      &client,
		}

		// Handle file upload
		if file, err := c.FormFile("image"); err == nil && file != nil {
			oldImagePath := ""
			if event.Image != nil {
				oldImagePath = *event.Image
			}

			filePath, err := utils.UpdateFile(c, oldImagePath, "image", "events")
			if err != nil {
				return utils.RespApi(c, "bad", "Gagal memperbarui image Event", err.Error())
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
		"title":       input.Title,
		"slug":        input.Slug,
		"image":       input.Image,
		"description": input.Description,
	"content":     input.Content,
	"client":      input.Client,
	}

	if err := h.DB.Model(&event).Updates(updates).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal memperbarui data Event", err.Error())
	}

	// Ambil data terbaru
	if err := h.DB.First(&event, "id = ?", id).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal mendapatkan data terbaru", err.Error())
	}

	// Buat response object dengan format JSON yang benar
	responseEvent := map[string]interface{}{
		"id":          event.ID,
		"created_at":  event.CreatedAt,
		"updated_at":  event.UpdatedAt,
		"title":       event.Title,
		"slug":        event.Slug,
		"image":       event.Image,
		"description": event.Description,
		"content":     event.Content,
		"client":      event.Client,
	}

	return utils.RespApi(c, "ok", "Berhasil memperbarui data Event", responseEvent)
}

func (h *EventHandler) DeleteEvent(c *fiber.Ctx) error {
	idParam := c.Params("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		return utils.RespApi(c, "bad", "ID yang diberikan tidak valid", nil)
	}

	var event models.Event
	if err := h.DB.First(&event, "id = ?", id).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal Mendapatkan Event", err.Error())
	}

	// Hapus file terkait jika ada
	if event.Image != nil && *event.Image != "" {
		utils.DeleteFile(*event.Image)
	}

	if err := h.DB.Delete(&event).Error; err != nil {
	return utils.RespApi(c, "ise", "Gagal Menghapus Event", err.Error())
	}

	return utils.RespApi(c, "ok", "Berhasil Menghapus Event", nil)
}
