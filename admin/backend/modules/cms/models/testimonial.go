package models

import (
	"aldev/modules/global/models"
)

type Testimonial struct {
	models.BaseModel
	Name    *string `json:"name" gorm:"type:varchar(300)"`
	Role    *string `json:"role" gorm:"type:varchar(300)"`
	Image   *string `json:"image,omitempty" gorm:"type:text;omitempty"`
	Quote   *string `json:"quote" gorm:"type:text"`
	Galleries *string `json:"galleries,omitempty" gorm:"type:text;omitempty"`
}
