package models

import (
	"aldev/modules/global/models"
)

type Destination struct {
	models.BaseModel
	Title       *string `json:"title" gorm:"type:varchar(300)"`
	Slug        *string `json:"slug" gorm:"type:varchar(300);unique;index"`
	Description *string `json:"description,omitempty" gorm:"type:text;omitempty"`
	Image       *string `json:"image,omitempty" gorm:"type:text;omitempty"`
}
