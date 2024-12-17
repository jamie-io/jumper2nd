package main

import (
    "fmt"
    "backend/handlers"  // Correct import path
    "github.com/gin-gonic/gin"
)

func main() {
    r := gin.Default()

    // Define routes for interacting with the database
    r.POST("/players", handlers.CreatePlayer)
    r.GET("/scoreboard", handlers.GetScoreboard)

    // Start the server on port 8080
    err := r.Run(":8080")
    if err != nil {
        fmt.Println("Error starting server:", err)
    }
}