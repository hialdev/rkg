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

type DestinationInitialInput struct {
	Title       *string `json:"title" validate:"omitempty,max=300"`
	Slug        *string `json:"slug" validate:"omitempty,max=300"`
	Description *string `json:"description,omitempty" validate:"omitempty"`
	Image       *string `json:"image,omitempty" validate:"omitempty"`
}

type DestinationHandler struct {
	DB *gorm.DB
}

func NewDestinationHandler(db *gorm.DB) *DestinationHandler {
	return &DestinationHandler{DB: db}
}

func (h *DestinationHandler) GetDestination(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		return utils.RespApi(c, "bad", "Id yang diberikan tidak valid", nil)
	}

	var destination models.Destination
	if err := h.DB.First(&destination, "id = ?", id).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal mendapatkan data Destination", err.Error())
	}

	return utils.RespApi(c, "ok", "Berhasil mendapatkan data Destination", destination)
}

func (h *DestinationHandler) GetAllDestinations(c *fiber.Ctx) error {
	page, _ := strconv.Atoi(c.Query("page", "1"))
	limit, _ := strconv.Atoi(c.Query("limit", "10"))
	search := strings.ToLower(c.Query("search", ""))
	sort := c.Query("sort", "id")
	order := c.Query("order", "asc")

	offset := (page - 1) * limit

	db := h.DB.Model(&models.Destination{})

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
	var destinations []models.Destination
	if err := db.Offset(offset).Limit(limit).Find(&destinations).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal ambil data", err.Error())
	}

	totalPages := (total + int64(limit) - 1) / int64(limit)

	// Konversi destinations ke format yang bisa di-serialize dengan benar
	var responseDestinations []map[string]interface{}
	for _, destination := range destinations {
		// Buat response object dengan format JSON yang benar
		responseDestination := map[string]interface{}{
			"id":          destination.ID,
			"created_at":  destination.CreatedAt,
			"updated_at":  destination.UpdatedAt,
			"title":       destination.Title,
			"slug":        destination.Slug,
			"description": destination.Description,
			"image":       destination.Image,
		}
	responseDestinations = append(responseDestinations, responseDestination)
	}

	result := fiber.Map{
	"destinations": responseDestinations,
		"pagination": fiber.Map{
			"total":      total,
			"page":       page,
			"limit":      limit,
			"totalPages": totalPages,
		},
	}

	return utils.RespApi(c, "ok", "Berhasil mendapatkan data Destinations", result)
}

func (h *DestinationHandler) AddDestination(c *fiber.Ctx) error {
	var input DestinationInitialInput

	contentType := c.Get("Content-Type")
	if strings.Contains(contentType, "multipart/form-data") {
	// Handle multipart form data for file uploads
		title := c.FormValue("title")
		slug := c.FormValue("slug")
		description := c.FormValue("description")

		input = DestinationInitialInput{
			Title:       &title,
			Slug:        &slug,
			Description: &description,
		}

		// Handle file upload
		if file, err := c.FormFile("image"); err == nil && file != nil {
			filePath, err := utils.UploadFile(c, "image", "destinations")
			if err != nil {
				return utils.RespApi(c, "bad", "Gagal upload image Destination", err.Error())
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

	destination := models.Destination{
		Title:       input.Title,
		Slug:        input.Slug,
		Description: input.Description,
		Image:       input.Image,
	}

	if err := h.DB.Create(&destination).Error; err != nil {
		return utils.RespApi(c, "ise", "Tidak dapat membuat Destination", err.Error())
	}

	return utils.RespApi(c, "ok", "Berhasil membuat data Destination", destination)
}

func (h *DestinationHandler) UpdateDestination(c *fiber.Ctx) error {
	idParam := c.Params("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		return utils.RespApi(c, "bad", "ID yang diberikan tidak valid", nil)
	}

	var destination models.Destination
	if err := h.DB.First(&destination, "id = ?", id).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal Mendapatkan Destination", err.Error())
	}

	var input DestinationInitialInput

	contentType := c.Get("Content-Type")
	if strings.Contains(contentType, "multipart/form-data") {
	// Handle multipart form data for file uploads
		title := c.FormValue("title")
		slug := c.FormValue("slug")
		description := c.FormValue("description")

		input = DestinationInitialInput{
			Title:       &title,
			Slug:        &slug,
			Description: &description,
		}

		// Handle file upload
		if file, err := c.FormFile("image"); err == nil && file != nil {
			oldImagePath := ""
			if destination.Image != nil {
				oldImagePath = *destination.Image
			}

			filePath, err := utils.UpdateFile(c, oldImagePath, "image", "destinations")
			if err != nil {
				return utils.RespApi(c, "bad", "Gagal memperbarui image Destination", err.Error())
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
		"description": input.Description,
		"image":       input.Image,
	}

	if err := h.DB.Model(&destination).Updates(updates).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal memperbarui data Destination", err.Error())
	}

	// Ambil data terbaru
	if err := h.DB.First(&destination, "id = ?", id).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal mendapatkan data terbaru", err.Error())
	}

	// Buat response object dengan format JSON yang benar
	responseDestination := map[string]interface{}{
		"id":          destination.ID,
		"created_at":  destination.CreatedAt,
		"updated_at":  destination.UpdatedAt,
		"title":       destination.Title,
		"slug":        destination.Slug,
		"description": destination.Description,
		"image":       destination.Image,
	}

	return utils.RespApi(c, "ok", "Berhasil memperbarui data Destination", responseDestination)
}

func (h *DestinationHandler) DeleteDestination(c *fiber.Ctx) error {
	idParam := c.Params("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
	return utils.RespApi(c, "bad", "ID yang diberikan tidak valid", nil)
	}

	var destination models.Destination
	if err := h.DB.First(&destination, "id = ?", id).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal Mendapatkan Destination", err.Error())
	}

	// Hapus file terkait jika ada
	if destination.Image != nil && *destination.Image != "" {
		utils.DeleteFile(*destination.Image)
	}

	if err := h.DB.Delete(&destination).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal Menghapus Destination", err.Error())
	}

	return utils.RespApi(c, "ok", "Berhasil Menghapus Destination", nil)
}
