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

type FaqInitialInput struct {
	Title   *string `json:"title" validate:"omitempty,max=300"`
	Content *string `json:"content" validate:"omitempty"`
}

type FaqHandler struct {
	DB *gorm.DB
}

func NewFaqHandler(db *gorm.DB) *FaqHandler {
	return &FaqHandler{DB: db}
}

func (h *FaqHandler) GetFaq(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		return utils.RespApi(c, "bad", "Id yang diberikan tidak valid", nil)
	}

	var faq models.Faq
	if err := h.DB.First(&faq, "id = ?", id).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal mendapatkan data Faq", err.Error())
	}

	return utils.RespApi(c, "ok", "Berhasil mendapatkan data Faq", faq)
}

func (h *FaqHandler) GetAllFaqs(c *fiber.Ctx) error {
	page, _ := strconv.Atoi(c.Query("page", "1"))
	limit, _ := strconv.Atoi(c.Query("limit", "10"))
	search := strings.ToLower(c.Query("search", ""))
	sort := c.Query("sort", "id")
	order := c.Query("order", "asc")

	offset := (page - 1) * limit

	db := h.DB.Model(&models.Faq{})

	// --- Filter search
	if search != "" {
	db = db.Where(`
			LOWER(title) LIKE ? OR 
			LOWER(content) LIKE ?`,
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
	var faqs []models.Faq
	if err := db.Offset(offset).Limit(limit).Find(&faqs).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal ambil data", err.Error())
	}

	totalPages := (total + int64(limit) - 1) / int64(limit)

	// Konversi faqs ke format yang bisa di-serialize dengan benar
	var responseFaqs []map[string]interface{}
	for _, faq := range faqs {
		// Buat response object dengan format JSON yang benar
	responseFaq := map[string]interface{}{
			"id":         faq.ID,
			"created_at": faq.CreatedAt,
			"updated_at": faq.UpdatedAt,
			"title":      faq.Title,
			"content":    faq.Content,
		}
	responseFaqs = append(responseFaqs, responseFaq)
	}

	result := fiber.Map{
	"faqs": responseFaqs,
		"pagination": fiber.Map{
			"total":      total,
			"page":       page,
			"limit":      limit,
			"totalPages": totalPages,
		},
	}

	return utils.RespApi(c, "ok", "Berhasil mendapatkan data Faqs", result)
}

func (h *FaqHandler) AddFaq(c *fiber.Ctx) error {
	var input FaqInitialInput

	if err := c.BodyParser(&input); err != nil {
		return utils.RespApi(c, "bad", "Request Body tidak valid", err.Error())
	}

	if err := utils.Validate.Struct(input); err != nil {
		if verrs, ok := err.(validator.ValidationErrors); ok {
			return utils.RespApi(c, "bad", "Validasi gagal", verrs.Translate(utils.Translator))
		}
	return utils.RespApi(c, "bad", "Validasi gagal", err.Error())
	}

	faq := models.Faq{
	Title:   input.Title,
		Content: input.Content,
	}

	if err := h.DB.Create(&faq).Error; err != nil {
		return utils.RespApi(c, "ise", "Tidak dapat membuat Faq", err.Error())
	}

	return utils.RespApi(c, "ok", "Berhasil membuat data Faq", faq)
}

func (h *FaqHandler) UpdateFaq(c *fiber.Ctx) error {
	idParam := c.Params("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		return utils.RespApi(c, "bad", "ID yang diberikan tidak valid", nil)
	}

	var faq models.Faq
	if err := h.DB.First(&faq, "id = ?", id).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal Mendapatkan Faq", err.Error())
	}

	var input FaqInitialInput

	if err := c.BodyParser(&input); err != nil {
		return utils.RespApi(c, "bad", "Request Body tidak valid", err.Error())
	}

	if err := utils.Validate.Struct(input); err != nil {
		if verrs, ok := err.(validator.ValidationErrors); ok {
			return utils.RespApi(c, "bad", "Validasi gagal", verrs.Translate(utils.Translator))
		}
	return utils.RespApi(c, "bad", "Validasi gagal", err.Error())
	}

	updates := map[string]interface{}{
		"title":   input.Title,
		"content": input.Content,
	}

	if err := h.DB.Model(&faq).Updates(updates).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal memperbarui data Faq", err.Error())
	}

	// Ambil data terbaru
	if err := h.DB.First(&faq, "id = ?", id).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal mendapatkan data terbaru", err.Error())
	}

	// Buat response object dengan format JSON yang benar
	responseFaq := map[string]interface{}{
		"id":         faq.ID,
		"created_at": faq.CreatedAt,
		"updated_at": faq.UpdatedAt,
		"title":      faq.Title,
		"content":    faq.Content,
	}

	return utils.RespApi(c, "ok", "Berhasil memperbarui data Faq", responseFaq)
}

func (h *FaqHandler) DeleteFaq(c *fiber.Ctx) error {
	idParam := c.Params("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		return utils.RespApi(c, "bad", "ID yang diberikan tidak valid", nil)
	}

	var faq models.Faq
	if err := h.DB.First(&faq, "id = ?", id).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal Mendapatkan Faq", err.Error())
	}

	if err := h.DB.Delete(&faq).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal Menghapus Faq", err.Error())
	}

	return utils.RespApi(c, "ok", "Berhasil Menghapus Faq", nil)
}
