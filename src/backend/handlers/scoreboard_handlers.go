package handlers

import (
	"net/http"
	"backend/models"
	"github.com/gin-gonic/gin"
)

// GetScoreboard retrieves a list of players sorted by score
func GetScoreboard(c *gin.Context) {
	var players []models.Player
	if result := db.Order("score desc").Find(&players); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve scoreboard"})
		return
	}

	c.JSON(http.StatusOK, players)
}