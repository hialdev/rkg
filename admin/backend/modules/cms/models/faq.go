package models

import (
	"aldev/modules/global/models"
)

type Faq struct {
	models.BaseModel
	Title   *string `json:"title" gorm:"type:varchar(300)"`
	Content *string `json:"content" gorm:"type:text"`
}
