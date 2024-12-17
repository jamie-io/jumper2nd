package handlers

import (
	"net/http"
	"backend/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

var db *gorm.DB // This will be initialized in main.go

// CreatePlayer handles adding a new player to the database
func CreatePlayer(c *gin.Context) {
	var newPlayer models.Player
	if err := c.BindJSON(&newPlayer); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if result := db.Create(&newPlayer); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add player"})
		return
	}

	c.JSON(http.StatusOK, newPlayer)
}