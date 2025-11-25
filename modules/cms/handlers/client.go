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

type ClientInitialInput struct {
	Image *string `json:"image,omitempty" validate:"omitempty"`
	Title *string `json:"title" validate:"omitempty,max=300"`
}

type ClientHandler struct {
	DB *gorm.DB
}

func NewClientHandler(db *gorm.DB) *ClientHandler {
	return &ClientHandler{DB: db}
}

func (h *ClientHandler) GetClient(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		return utils.RespApi(c, "bad", "Id yang diberikan tidak valid", nil)
	}

	var client models.Client
	if err := h.DB.First(&client, "id = ?", id).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal mendapatkan data Client", err.Error())
	}

	return utils.RespApi(c, "ok", "Berhasil mendapatkan data Client", client)
}

func (h *ClientHandler) GetAllClients(c *fiber.Ctx) error {
	page, _ := strconv.Atoi(c.Query("page", "1"))
	limit, _ := strconv.Atoi(c.Query("limit", "10"))
	search := strings.ToLower(c.Query("search", ""))
	sort := c.Query("sort", "id")
	order := c.Query("order", "asc")

	offset := (page - 1) * limit

	db := h.DB.Model(&models.Client{})

	// --- Filter search
	if search != "" {
	db = db.Where(`
			LOWER(title) LIKE ?`,
			"%"+search+"%",
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
		"created_at": "created_at",
	}
	sortBy, ok := validSortFields[sort]
	if !ok {
		sortBy = "id"
	}
	db = db.Order(fmt.Sprintf("%s %s", sortBy, order))

	// --- Ambil data
	var clients []models.Client
	if err := db.Offset(offset).Limit(limit).Find(&clients).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal ambil data", err.Error())
	}

	totalPages := (total + int64(limit) - 1) / int64(limit)

	// Konversi clients ke format yang bisa di-serialize dengan benar
	var responseClients []map[string]interface{}
	for _, client := range clients {
		// Buat response object dengan format JSON yang benar
		responseClient := map[string]interface{}{
			"id":         client.ID,
			"created_at": client.CreatedAt,
			"updated_at": client.UpdatedAt,
			"title":      client.Title,
			"image":      client.Image,
		}
	responseClients = append(responseClients, responseClient)
	}

	result := fiber.Map{
	"clients": responseClients,
		"pagination": fiber.Map{
			"total":      total,
			"page":       page,
			"limit":      limit,
			"totalPages": totalPages,
		},
	}

	return utils.RespApi(c, "ok", "Berhasil mendapatkan data Clients", result)
}

func (h *ClientHandler) AddClient(c *fiber.Ctx) error {
	var input ClientInitialInput

	contentType := c.Get("Content-Type")
	if strings.Contains(contentType, "multipart/form-data") {
		// Handle multipart form data for file uploads
		title := c.FormValue("title")

		input = ClientInitialInput{
			Title: &title,
		}

		// Handle file upload
		if file, err := c.FormFile("image"); err == nil && file != nil {
			filePath, err := utils.UploadFile(c, "image", "clients")
			if err != nil {
				return utils.RespApi(c, "bad", "Gagal upload image Client", err.Error())
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

	client := models.Client{
	Image: input.Image,
		Title: input.Title,
	}

	if err := h.DB.Create(&client).Error; err != nil {
		return utils.RespApi(c, "ise", "Tidak dapat membuat Client", err.Error())
	}

	return utils.RespApi(c, "ok", "Berhasil membuat data Client", client)
}

func (h *ClientHandler) UpdateClient(c *fiber.Ctx) error {
	idParam := c.Params("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		return utils.RespApi(c, "bad", "ID yang diberikan tidak valid", nil)
	}

	var client models.Client
	if err := h.DB.First(&client, "id = ?", id).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal Mendapatkan Client", err.Error())
	}

	var input ClientInitialInput

	contentType := c.Get("Content-Type")
	if strings.Contains(contentType, "multipart/form-data") {
		// Handle multipart form data for file uploads
		title := c.FormValue("title")

		input = ClientInitialInput{
			Title: &title,
		}

		// Handle file upload
		if file, err := c.FormFile("image"); err == nil && file != nil {
			oldImagePath := ""
			if client.Image != nil {
				oldImagePath = *client.Image
			}

			filePath, err := utils.UpdateFile(c, oldImagePath, "image", "clients")
			if err != nil {
				return utils.RespApi(c, "bad", "Gagal memperbarui image Client", err.Error())
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
		"image": input.Image,
		"title": input.Title,
	}

	if err := h.DB.Model(&client).Updates(updates).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal memperbarui data Client", err.Error())
	}

	// Ambil data terbaru
	if err := h.DB.First(&client, "id = ?", id).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal mendapatkan data terbaru", err.Error())
	}

	// Buat response object dengan format JSON yang benar
	responseClient := map[string]interface{}{
		"id":         client.ID,
		"created_at": client.CreatedAt,
		"updated_at": client.UpdatedAt,
		"title":      client.Title,
		"image":      client.Image,
	}

	return utils.RespApi(c, "ok", "Berhasil memperbarui data Client", responseClient)
}

func (h *ClientHandler) DeleteClient(c *fiber.Ctx) error {
	idParam := c.Params("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		return utils.RespApi(c, "bad", "ID yang diberikan tidak valid", nil)
	}

	var client models.Client
	if err := h.DB.First(&client, "id = ?", id).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal Mendapatkan Client", err.Error())
	}

	// Hapus file terkait jika ada
	if client.Image != nil && *client.Image != "" {
		utils.DeleteFile(*client.Image)
	}

	if err := h.DB.Delete(&client).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal Menghapus Client", err.Error())
	}

	return utils.RespApi(c, "ok", "Berhasil Menghapus Client", nil)
}
