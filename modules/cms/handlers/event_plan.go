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

type EventPlanInitialInput struct {
	Title    *string `json:"title" validate:"omitempty,max=300"`
	Step     *int    `json:"step_order" validate:"omitempty"`
	Subtitle *string `json:"subtitle" validate:"omitempty,max=300"`
	Content  *string `json:"content" validate:"omitempty"`
	Image    *string `json:"image,omitempty" validate:"omitempty"`
}

type EventPlanHandler struct {
	DB *gorm.DB
}

func NewEventPlanHandler(db *gorm.DB) *EventPlanHandler {
	return &EventPlanHandler{DB: db}
}

func (h *EventPlanHandler) GetEventPlan(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		return utils.RespApi(c, "bad", "Id yang diberikan tidak valid", nil)
	}

	var eventPlan models.EventPlan
	if err := h.DB.First(&eventPlan, "id = ?", id).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal mendapatkan data EventPlan", err.Error())
	}

	return utils.RespApi(c, "ok", "Berhasil mendapatkan data EventPlan", eventPlan)
}

func (h *EventPlanHandler) GetAllEventPlans(c *fiber.Ctx) error {
	page, _ := strconv.Atoi(c.Query("page", "1"))
	limit, _ := strconv.Atoi(c.Query("limit", "10"))
	search := strings.ToLower(c.Query("search", ""))
	sort := c.Query("sort", "step_order")
	order := c.Query("order", "asc")

	offset := (page - 1) * limit

	db := h.DB.Model(&models.EventPlan{})

	// --- Filter search
	if search != "" {
	db = db.Where(`
			LOWER(title) LIKE ? OR 
			LOWER(subtitle) LIKE ? OR 
			LOWER(content) LIKE ?`,
			"%"+search+"%", "%"+search+"%", "%"+search+"%",
		)
	}

	// --- Hitung total
	var total int64
	if err := db.Count(&total).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal hitung total", err.Error())
	}

	// --- Sorting (whitelisted)
	validSortFields := map[string]string{
		"id":         "id",
		"title":      "title",
		"step_order": "step_order",
		"subtitle":   "subtitle",
		"created_at": "created_at",
	}
	sortBy, ok := validSortFields[sort]
	if !ok {
		sortBy = "step_order"
	}
	db = db.Order(fmt.Sprintf("%s %s", sortBy, order))

	// --- Ambil data
	var eventPlans []models.EventPlan
	if err := db.Offset(offset).Limit(limit).Find(&eventPlans).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal ambil data", err.Error())
	}

	totalPages := (total + int64(limit) - 1) / int64(limit)

	// Konversi eventPlans ke format yang bisa di-serialize dengan benar
	var responseEventPlans []map[string]interface{}
	for _, eventPlan := range eventPlans {
		// Buat response object dengan format JSON yang benar
		responseEventPlan := map[string]interface{}{
			"id":         eventPlan.ID,
			"created_at": eventPlan.CreatedAt,
			"updated_at": eventPlan.UpdatedAt,
			"title":      eventPlan.Title,
			"step_order": eventPlan.Step,
			"subtitle":   eventPlan.Subtitle,
			"content":    eventPlan.Content,
			"image":      eventPlan.Image,
		}
	responseEventPlans = append(responseEventPlans, responseEventPlan)
	}

	result := fiber.Map{
	"event_plans": responseEventPlans,
		"pagination": fiber.Map{
			"total":      total,
			"page":       page,
			"limit":      limit,
			"totalPages": totalPages,
		},
	}

	return utils.RespApi(c, "ok", "Berhasil mendapatkan data EventPlans", result)
}

func (h *EventPlanHandler) AddEventPlan(c *fiber.Ctx) error {
	var input EventPlanInitialInput

	contentType := c.Get("Content-Type")
	if strings.Contains(contentType, "multipart/form-data") {
		// Handle multipart form data for file uploads
		title := c.FormValue("title")
		stepStr := c.FormValue("step_order")
		subtitle := c.FormValue("subtitle")
		content := c.FormValue("content")

		var step *int
		if stepStr != "" {
			stepVal, err := strconv.Atoi(stepStr)
			if err == nil {
				step = &stepVal
			}
	}

		input = EventPlanInitialInput{
			Title:    &title,
			Step:     step,
			Subtitle: &subtitle,
			Content:  &content,
		}

		// Handle file upload
		if file, err := c.FormFile("image"); err == nil && file != nil {
			filePath, err := utils.UploadFile(c, "image", "event_plans")
			if err != nil {
				return utils.RespApi(c, "bad", "Gagal upload image EventPlan", err.Error())
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

	eventPlan := models.EventPlan{
		Title:    input.Title,
		Step:     input.Step,
		Subtitle: input.Subtitle,
		Content:  input.Content,
		Image:    input.Image,
	}

	if err := h.DB.Create(&eventPlan).Error; err != nil {
		return utils.RespApi(c, "ise", "Tidak dapat membuat EventPlan", err.Error())
	}

	return utils.RespApi(c, "ok", "Berhasil membuat data EventPlan", eventPlan)
}

func (h *EventPlanHandler) UpdateEventPlan(c *fiber.Ctx) error {
	idParam := c.Params("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		return utils.RespApi(c, "bad", "ID yang diberikan tidak valid", nil)
	}

	var eventPlan models.EventPlan
	if err := h.DB.First(&eventPlan, "id = ?", id).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal Mendapatkan EventPlan", err.Error())
	}

	var input EventPlanInitialInput

	contentType := c.Get("Content-Type")
	if strings.Contains(contentType, "multipart/form-data") {
		// Handle multipart form data for file uploads
		title := c.FormValue("title")
		stepStr := c.FormValue("step_order")
		subtitle := c.FormValue("subtitle")
		content := c.FormValue("content")

		var step *int
		if stepStr != "" {
			stepVal, err := strconv.Atoi(stepStr)
			if err == nil {
				step = &stepVal
			}
		}

		input = EventPlanInitialInput{
			Title:    &title,
			Step:     step,
			Subtitle: &subtitle,
			Content:  &content,
		}

		// Handle file upload
		if file, err := c.FormFile("image"); err == nil && file != nil {
			oldImagePath := ""
			if eventPlan.Image != nil {
				oldImagePath = *eventPlan.Image
			}

			filePath, err := utils.UpdateFile(c, oldImagePath, "image", "event_plans")
			if err != nil {
				return utils.RespApi(c, "bad", "Gagal memperbarui image EventPlan", err.Error())
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
		"title":      input.Title,
		"step_order": input.Step,
		"subtitle":   input.Subtitle,
		"content":    input.Content,
		"image":      input.Image,
	}

	if err := h.DB.Model(&eventPlan).Updates(updates).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal memperbarui data EventPlan", err.Error())
	}

	// Ambil data terbaru
	if err := h.DB.First(&eventPlan, "id = ?", id).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal mendapatkan data terbaru", err.Error())
	}

	// Buat response object dengan format JSON yang benar
	responseEventPlan := map[string]interface{}{
	"id":         eventPlan.ID,
		"created_at": eventPlan.CreatedAt,
		"updated_at": eventPlan.UpdatedAt,
	"title":      eventPlan.Title,
	"step_order": eventPlan.Step,
		"subtitle":   eventPlan.Subtitle,
		"content":    eventPlan.Content,
		"image":      eventPlan.Image,
	}

	return utils.RespApi(c, "ok", "Berhasil memperbarui data EventPlan", responseEventPlan)
}

func (h *EventPlanHandler) DeleteEventPlan(c *fiber.Ctx) error {
	idParam := c.Params("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		return utils.RespApi(c, "bad", "ID yang diberikan tidak valid", nil)
	}

	var eventPlan models.EventPlan
	if err := h.DB.First(&eventPlan, "id = ?", id).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal Mendapatkan EventPlan", err.Error())
	}

	// Hapus file terkait jika ada
	if eventPlan.Image != nil && *eventPlan.Image != "" {
		utils.DeleteFile(*eventPlan.Image)
	}

	if err := h.DB.Delete(&eventPlan).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal Menghapus EventPlan", err.Error())
	}

	return utils.RespApi(c, "ok", "Berhasil Menghapus EventPlan", nil)
}
