package models

import "aldev/modules/global/models"

type Tables struct {
	models.BaseModel
	Name           string       `gorm:"not null;type:varchar(100)" json:"name"`
	Slug           string       `gorm:"uniqueIndex;not null;type:varchar(50)" json:"slug"`
	Description    *string      `gorm:"type:text" json:"description,omitempty"`
	Icon           *string      `gorm:"type:varchar(50)" json:"icon,omitempty"`
	GenerateWidget bool         `gorm:"default:false" json:"generate_widget"`
	Fields         []TableField `gorm:"foreignKey:TableID" json:"fields,omitempty"`
}
