package handlers

import (
	"aldev/modules/cms/models"
	globalModels "aldev/modules/global/models"
	"aldev/utils"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type TableFieldInput struct {
	globalModels.BaseModel
	TableID        string                  `json:"table_id" validate:"required,uuid4"`
	Name           string                  `json:"name" validate:"required"`
	Label          string                  `json:"label" validate:"required"`
	Type           string                  `json:"type" validate:"required,oneof=string text number boolean richtext markdown relation"`
	IsRequired     bool                    `json:"is_required"`
	IsUnique       bool                    `json:"is_unique"`
	RelationType   *string                 `json:"relation_type,omitempty"`
	RelatedTableID *string                 `json:"related_table_id,omitempty"`
	Languages      *models.LanguagesConfig `json:"languages,omitempty"`
	Options        []models.OptionsConfig  `json:"options,omitempty"`
}

type TableFieldHandler struct {
	DB *gorm.DB
}

func NewTableFieldHandler(db *gorm.DB) *TableFieldHandler {
	return &TableFieldHandler{DB: db}
}

// 🟢 POST /cms/fields
func (h *TableFieldHandler) Create(c *fiber.Ctx) error {
	var input TableFieldInput
	if err := c.BodyParser(&input); err != nil {
		return utils.RespApi(c, "bad", "Request body tidak valid", err.Error())
	}

	if err := utils.Validate.Struct(input); err != nil {
		if verrs, ok := err.(validator.ValidationErrors); ok {
			return utils.RespApi(c, "bad", "Validasi gagal", verrs.Translate(utils.Translator))
		}
		return utils.RespApi(c, "bad", "Validasi gagal", err.Error())
	}

	// Validasi khusus languages
	if input.Languages != nil {
		if len(input.Languages.Langs) == 0 {
			return utils.RespApi(c, "bad", "languages.langs tidak boleh kosong", nil)
		}
		if input.Languages.Default == "" {
			return utils.RespApi(c, "bad", "languages.default tidak boleh kosong", nil)
		}
		validDefault := false
		for _, l := range input.Languages.Langs {
			if l == input.Languages.Default {
				validDefault = true
				break
			}
		}
		if !validDefault {
			return utils.RespApi(c, "bad", "languages.default harus salah satu dari languages.langs", nil)
		}
	}

	field := models.TableField{
		TableID:        input.TableID,
		Name:           input.Name,
		Label:          input.Label,
		Type:           input.Type,
		IsRequired:     input.IsRequired,
		IsUnique:       input.IsUnique,
		RelationType:   input.RelationType,
		RelatedTableID: input.RelatedTableID,
	}

	if input.Languages != nil {
		field.Languages = *input.Languages
	}
	if input.Options != nil {
		field.Options = input.Options
	}

	if err := h.DB.Create(&field).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal menambah field", err.Error())
	}

	return utils.RespApi(c, "ok", "Berhasil menambah field", field)
}

// 🟢 GET /cms/fields/:table_id
func (h *TableFieldHandler) GetByTable(c *fiber.Ctx) error {
	tableID := c.Params("table_id")
	var fields []models.TableField
	if err := h.DB.Where("table_id = ?", tableID).Find(&fields).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal mendapatkan fields", err.Error())
	}
	return utils.RespApi(c, "ok", "Berhasil mendapatkan fields", fields)
}

// 🟡 PUT /cms/fields/:id
func (h *TableFieldHandler) Update(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		return utils.RespApi(c, "bad", "ID tidak valid", nil)
	}

	var input TableFieldInput
	if err := c.BodyParser(&input); err != nil {
		return utils.RespApi(c, "bad", "Request body tidak valid", err.Error())
	}

	var field models.TableField
	if err := h.DB.First(&field, "id = ?", id).Error; err != nil {
		return utils.RespApi(c, "empty", "Field tidak ditemukan", err.Error())
	}

	field.Name = input.Name
	field.Label = input.Label
	field.Type = input.Type
	field.IsRequired = input.IsRequired
	field.IsUnique = input.IsUnique
	field.RelationType = input.RelationType
	field.RelatedTableID = input.RelatedTableID
	if input.Languages != nil {
		field.Languages = *input.Languages
	}
	if input.Options != nil {
		field.Options = input.Options
	}

	if err := h.DB.Save(&field).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal mengupdate field", err.Error())
	}

	return utils.RespApi(c, "ok", "Berhasil mengupdate field", field)
}

// 🔴 DELETE /cms/fields/:id
func (h *TableFieldHandler) Delete(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		return utils.RespApi(c, "bad", "ID tidak valid", nil)
	}

	if err := h.DB.Delete(&models.TableField{}, "id = ?", id).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal menghapus field", err.Error())
	}

	return utils.RespApi(c, "ok", "Berhasil menghapus field", nil)
}
