package models

import (
	"aldev/modules/global/models"
	"encoding/json"
)

type Trip struct {
	models.BaseModel
	Title        *string          `json:"title" gorm:"type:varchar(300)"`
	Slug         *string          `json:"slug" gorm:"type:varchar(300);unique;index"`
	Description  *string          `json:"description,omitempty" gorm:"type:text;omitempty"`
	Location     *string          `json:"location" gorm:"type:varchar(200)"`
	Country      *string          `json:"country" gorm:"type:varchar(100)"`
	Type         *string          `json:"type" gorm:"type:varchar(50);default:'open-trip'"`
	Duration     *string          `json:"duration" gorm:"type:varchar(20)"`
	Price        *float64         `json:"price" gorm:"type:decimal(15,2);default:0.00"`
	Image        *string          `json:"image,omitempty" gorm:"type:text;omitempty"`
	Images       *string           `json:"images,omitempty" gorm:"type:text;omitempty"`
	MinPeople    *int             `json:"min_people,omitempty" gorm:"type:int;default:2"`
	MeetPoint    *string          `json:"meet_point,omitempty" gorm:"type:varchar(300);omitempty"`
	Content      *string          `json:"content,omitempty" gorm:"type:text;omitempty"`
	OpenDates    json.RawMessage  `json:"open_dates" gorm:"type:jsonb"`
	Destinations json.RawMessage  `json:"destinations" gorm:"type:jsonb"`
	Itinerary    json.RawMessage  `json:"itinerary" gorm:"type:jsonb"`
}
