package models

import (
	"aldev/modules/global/models"
)

type Team struct {
	models.BaseModel
	Name    *string `json:"name" gorm:"type:varchar(300)"`
	Role    *string `json:"role" gorm:"type:varchar(300)"`
	Summary *string `json:"summary,omitempty" gorm:"type:text;omitempty"`
	Image   *string `json:"image,omitempty" gorm:"type:text;omitempty"`
}
