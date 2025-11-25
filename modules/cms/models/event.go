package models

import (
	"aldev/modules/global/models"
)

type Event struct {
	models.BaseModel
	Title       *string          `json:"title" gorm:"type:varchar(300)"`
	Slug        *string          `json:"slug" gorm:"type:varchar(300);unique;index"`
	Image       *string          `json:"image,omitempty" gorm:"type:text;omitempty"`
	Description *string          `json:"description,omitempty" gorm:"type:text;omitempty"`
	Content     *string          `json:"content,omitempty" gorm:"type:text;omitempty"`
	Client      *string          `json:"client,omitempty" gorm:"type:varchar(300)"`
}
