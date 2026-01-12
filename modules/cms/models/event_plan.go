package models

import (
	"aldev/modules/global/models"
)

type EventPlan struct {
	models.BaseModel
	Title    *string `json:"title" gorm:"type:varchar(300)"`
	Step     *int    `json:"step_order" gorm:"type:integer;column:step_order"`
	Subtitle *string `json:"subtitle" gorm:"type:varchar(300)"`
	Content  *string `json:"content" gorm:"type:text"`
	Images   *string `json:"images,omitempty" gorm:"type:text;omitempty"`
}
