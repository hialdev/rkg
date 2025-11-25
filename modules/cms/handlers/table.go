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

type TableInput struct {
	Name           string  `json:"name" validate:"required"`
	Description    *string `json:"description,omitempty"`
	Icon           *string `json:"icon,omitempty"`
	GenerateWidget bool    `json:"generate_widget"`
}

type TableHandler struct {
	DB *gorm.DB
}

func NewTableHandler(db *gorm.DB) *TableHandler {
	return &TableHandler{DB: db}
}

// 🟢 GET /cms/tables
func (h *TableHandler) GetAll(c *fiber.Ctx) error {
	page, _ := strconv.Atoi(c.Query("page", "1"))
	limit, _ := strconv.Atoi(c.Query("limit", "10"))
	search := strings.ToLower(c.Query("search", ""))
	sort := c.Query("sort", "id")
	order := c.Query("order", "asc")

	offset := (page - 1) * limit

	db := h.DB.Model(&models.Tables{}).Preload("Fields")

	// --- Filter search
	if search != "" {
		db = db.Where(`
			LOWER(name) LIKE ? OR 
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
		"name":        "name",
		"description": "description",
		"created_at":  "created_at",
		"updated_at":  "updated_at",
	}
	sortBy, ok := validSortFields[sort]
	if !ok {
		sortBy = "id"
	}
	db = db.Order(fmt.Sprintf("%s %s", sortBy, order))

	// --- Ambil data
	var tables []models.Tables
	if err := db.Offset(offset).Limit(limit).Find(&tables).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal ambil data", err.Error())
	}

	totalPages := (total + int64(limit) - 1) / int64(limit)

	result := fiber.Map{
		"tables": tables,
		"pagination": fiber.Map{
			"total":      total,
			"page":       page,
			"limit":      limit,
			"totalPages": totalPages,
		},
	}

	return utils.RespApi(c, "ok", "Berhasil mendapatkan Tables", result)
}

// 🟢 GET /cms/tables/:id
func (h *TableHandler) GetOne(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		return utils.RespApi(c, "bad", "ID tidak valid", nil)
	}

	var table models.Tables
	if err := h.DB.Preload("Fields").First(&table, "id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return utils.RespApi(c, "bad", "Table tidak ditemukan", nil)
		}
		return utils.RespApi(c, "ise", "Gagal mendapatkan Table", err.Error())
	}
	return utils.RespApi(c, "ok", "Berhasil mendapatkan Table", table)
}

// 🟢 POST /cms/tables
func (h *TableHandler) Create(c *fiber.Ctx) error {
	var input TableInput
	if err := c.BodyParser(&input); err != nil {
		return utils.RespApi(c, "bad", "Request body tidak valid", err.Error())
	}
	if err := utils.Validate.Struct(input); err != nil {
		if verrs, ok := err.(validator.ValidationErrors); ok {
			return utils.RespApi(c, "bad", "Validasi gagal", verrs.Translate(utils.Translator))
		}
		return utils.RespApi(c, "bad", "Validasi gagal", err.Error())
	}

	slug := strings.ToLower(strings.ReplaceAll(input.Name, " ", "_"))
	table := models.Tables{
		Name:           input.Name,
		Slug:           slug,
		Description:    input.Description,
		Icon:           input.Icon,
		GenerateWidget: input.GenerateWidget,
	}

	if err := h.DB.Create(&table).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal membuat Table", err.Error())
	}
	return utils.RespApi(c, "ok", "Berhasil membuat Table", table)
}

// 🟡 PUT /cms/tables/:id
func (h *TableHandler) Update(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		return utils.RespApi(c, "bad", "ID tidak valid", nil)
	}

	var input TableInput
	if err := c.BodyParser(&input); err != nil {
		return utils.RespApi(c, "bad", "Request body tidak valid", err.Error())
	}

	var table models.Tables
	if err := h.DB.First(&table, "id = ?", id).Error; err != nil {
		return utils.RespApi(c, "bad", "Table tidak ditemukan", nil)
	}

	slug := strings.ToLower(strings.ReplaceAll(input.Name, " ", "_"))
	updates := map[string]interface{}{
		"name":            input.Name,
		"slug":            slug,
		"description":     input.Description,
		"icon":            input.Icon,
		"generate_widget": input.GenerateWidget,
	}

	if err := h.DB.Model(&table).Updates(updates).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal memperbarui Table", err.Error())
	}

	return utils.RespApi(c, "ok", "Berhasil memperbarui Table", table)
}

// 🔴 DELETE /cms/tables/:id
func (h *TableHandler) Delete(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		return utils.RespApi(c, "bad", "ID tidak valid", nil)
	}

	var table models.Tables
	if err := h.DB.First(&table, "id = ?", id).Error; err != nil {
		return utils.RespApi(c, "bad", "Table tidak ditemukan", nil)
	}

	if err := h.DB.Delete(&table).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal menghapus Table", err.Error())
	}

	return utils.RespApi(c, "ok", "Berhasil menghapus Table", nil)
}
