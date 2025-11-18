package handlers

import (
	"aldev/modules/cms/models"
	"aldev/utils"
	"fmt"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type TableRecordInput struct {
	TableID string                 `json:"table_id" validate:"required,uuid4"`
	Data    map[string]interface{} `json:"data" validate:"required"`
}

type TableRecordHandler struct {
	DB *gorm.DB
}

func NewTableRecordHandler(db *gorm.DB) *TableRecordHandler {
	return &TableRecordHandler{DB: db}
}

// 🟢 CREATE /cms/records
func (h *TableRecordHandler) Create(c *fiber.Ctx) error {
	var input TableRecordInput
	if err := c.BodyParser(&input); err != nil {
		return utils.RespApi(c, "bad", "Body request tidak valid", err.Error())
	}

	if err := utils.Validate.Struct(input); err != nil {
		if verrs, ok := err.(validator.ValidationErrors); ok {
			return utils.RespApi(c, "bad", "Validasi gagal", verrs.Translate(utils.Translator))
		}
		return utils.RespApi(c, "bad", "Validasi gagal", err.Error())
	}

	// Ambil definisi field
	var fields []models.TableField
	if err := h.DB.Where("table_id = ?", input.TableID).Find(&fields).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal memuat definisi field", err.Error())
	}

	// Validasi dinamis
	for _, field := range fields {
		item, ok := input.Data[field.Name]
		if !ok && field.IsRequired {
			return utils.RespApi(c, "bad", fmt.Sprintf("Field '%s' wajib diisi", field.Name), nil)
		}
		if !ok {
			continue
		}

		fieldObj, ok := item.(map[string]interface{})
		if !ok {
			return utils.RespApi(c, "bad", fmt.Sprintf("Struktur '%s' tidak valid (harus object)", field.Name), nil)
		}

		val := fieldObj["value"]
		switch field.Type {
		case "string", "text", "richtext", "markdown":
			// multi-language: pastikan `value` berupa map[string]string
			if field.IsRequired && val == nil {
				return utils.RespApi(c, "bad", fmt.Sprintf("Field '%s' tidak boleh kosong", field.Name), nil)
			}

			if _, ok := val.(map[string]interface{}); !ok {
				return utils.RespApi(c, "bad", fmt.Sprintf("Field '%s' harus object berisi kode bahasa", field.Name), nil)
			}
		case "relation":
			if str, ok := val.(string); !ok || len(str) == 0 {
				return utils.RespApi(c, "bad", fmt.Sprintf("Field '%s' relasi tidak valid", field.Name), nil)
			}
		case "number":
			if _, ok := val.(float64); !ok {
				return utils.RespApi(c, "bad", fmt.Sprintf("Field '%s' harus angka", field.Name), nil)
			}
		}
	}

	// Simpan data JSON
	record := models.TableRecord{
		TableID: input.TableID,
		Data:    models.JSONB(input.Data),
	}

	if err := h.DB.Create(&record).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal menyimpan record", err.Error())
	}

	return utils.RespApi(c, "ok", "Berhasil membuat record", record)
}

// 🟢 GET ALL /cms/records/:table_id
func (h *TableRecordHandler) GetByTable(c *fiber.Ctx) error {
	tableID := c.Params("table_id")
	var records []models.TableRecord

	if err := h.DB.Where("table_id = ?", tableID).Find(&records).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal mengambil data", err.Error())
	}

	return utils.RespApi(c, "ok", "Berhasil mengambil data", records)
}

// 🟢 GET ONE /cms/record/:id
func (h *TableRecordHandler) GetByID(c *fiber.Ctx) error {
	id := c.Params("id")
	var record models.TableRecord

	if err := h.DB.First(&record, "id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return utils.RespApi(c, "empty", "Record tidak ditemukan", nil)
		}
		return utils.RespApi(c, "ise", "Gagal mengambil data", err.Error())
	}

	return utils.RespApi(c, "ok", "Berhasil mengambil record", record)
}

// 🟡 UPDATE /cms/record/:id
func (h *TableRecordHandler) Update(c *fiber.Ctx) error {
	id := c.Params("id")
	var input TableRecordInput

	if err := c.BodyParser(&input); err != nil {
		return utils.RespApi(c, "bad", "Body request tidak valid", err.Error())
	}

	if err := utils.Validate.Struct(input); err != nil {
		return utils.RespApi(c, "bad", "Validasi gagal", err.Error())
	}

	var record models.TableRecord
	if err := h.DB.First(&record, "id = ?", id).Error; err != nil {
		return utils.RespApi(c, "empty", "Record tidak ditemukan", err.Error())
	}

	record.Data = models.JSONB(input.Data)
	if err := h.DB.Save(&record).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal mengupdate record", err.Error())
	}

	return utils.RespApi(c, "ok", "Berhasil mengupdate record", record)
}

// 🔴 DELETE /cms/record/:id
func (h *TableRecordHandler) Delete(c *fiber.Ctx) error {
	id := c.Params("id")
	if _, err := uuid.Parse(id); err != nil {
		return utils.RespApi(c, "bad", "ID tidak valid", nil)
	}

	if err := h.DB.Delete(&models.TableRecord{}, "id = ?", id).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal menghapus record", err.Error())
	}

	return utils.RespApi(c, "ok", "Record berhasil dihapus", nil)
}
