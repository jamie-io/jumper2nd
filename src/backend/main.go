package main

import (
	"database/sql"
	"log"

	_ "github.com/mattn/go-sqlite3" // SQLite driver
)

func main() {
	// Open or create the database file
	db, err := sql.Open("sqlite3", "players.db")
	if err != nil {
		log.Fatalf("Failed to open the database: %v", err)
	}
	defer db.Close()

	// Create the players table if it does not exist
	createTableQuery := `
	CREATE TABLE IF NOT EXISTS players (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		player_name TEXT UNIQUE NOT NULL,
		matches_played INTEGER DEFAULT 0,
		highest_score INTEGER DEFAULT 0
	);
	`

	_, err = db.Exec(createTableQuery)
	if err != nil {
		log.Fatalf("Failed to create the players table: %v", err)
	}

	log.Println("Database initialized and players table created (if not exists).")
}
