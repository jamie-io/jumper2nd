package models

import (
	"gorm.io/gorm"
)

type Player struct {
	gorm.Model
	PlayerName string `json:"player_name"`
	Score      int    `json:"score"`
}