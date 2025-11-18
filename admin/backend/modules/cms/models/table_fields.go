package models

import (
	"aldev/modules/global/models"
	"database/sql/driver"
	"encoding/json"
	"errors"
)

type LanguagesConfig struct {
	Langs   []string `json:"langs"`
	Default string   `json:"default"`
}

type OptionsConfig struct {
	Key   string `json:"key"`
	Value string `json:"value"`
}

type JSONB map[string]interface{}

func (j JSONB) Value() (driver.Value, error) {
	if j == nil {
		return "{}", nil
	}
	return json.Marshal(j)
}

func (j *JSONB) Scan(value interface{}) error {
	if value == nil {
		*j = JSONB{}
		return nil
	}
	b, ok := value.([]byte)
	if !ok {
		return errors.New("invalid type for JSONB")
	}
	return json.Unmarshal(b, &j)
}

// TableField = definisi struktur field
type TableField struct {
	models.BaseModel
	TableID        string          `gorm:"type:uuid;not null" json:"table_id"`
	Name           string          `gorm:"type:varchar(100);not null" json:"name"`
	Label          string          `gorm:"type:varchar(100);not null" json:"label"`
	Type           string          `gorm:"type:varchar(30);not null" json:"type"`
	IsRequired     bool            `gorm:"default:false" json:"is_required"`
	IsUnique       bool            `gorm:"default:false" json:"is_unique"`
	RelationType   *string         `gorm:"type:varchar(20)" json:"relation_type,omitempty"`
	RelatedTableID *string         `gorm:"type:uuid" json:"related_table_id,omitempty"`
	Languages      LanguagesConfig `gorm:"type:jsonb;default:'{}'" json:"languages,omitempty"`
	Options        []OptionsConfig `gorm:"type:jsonb;default:'{}'" json:"options,omitempty"`
}
