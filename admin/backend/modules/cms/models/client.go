package models

import (
	"aldev/modules/global/models"
)

type Client struct {
	models.BaseModel
	Image *string `json:"image,omitempty" gorm:"type:text;omitempty"`
	Title *string `json:"title" gorm:"type:varchar(300)"`
}
