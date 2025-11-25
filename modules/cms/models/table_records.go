package models

import (
	"aldev/modules/global/models"
)

type TableRecord struct {
	models.BaseModel
	TableID string `gorm:"type:uuid;not null" json:"table_id"`
	Data    JSONB  `gorm:"type:jsonb;not null;default:'{}'" json:"data"` // data dinamis per field
}
