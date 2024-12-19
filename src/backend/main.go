package main

import (
	"database/sql"
	"log"
	_ "github.com/mattn/go-sqlite3" // SQLite driver
)

func main() {
    db, err := sql.Open("sqlite3", "game.db")
    if err != nil {
        log.Fatalf("Cant open db")
        return
    }
    defer db.Close()
    createTable_Players(db)
    createTable_Scores(db)
    createTable_GameRooms(db)
}

func createTable_Players(db* sql.DB){
    createTableQueryPlayer := `
        CREATE TABLE IF NOT EXISTS player(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        player_name TEXT UNIQUE NOT NULL,
    ) `

    _, err = db.Exec(createTableQueryPlayer)
    if err != nil {
        log.Fatalf("cant create Table Player", err)
    }

}

func createTable_Scores(db* sql.DB){
    createTable_Scores := `
        CREATE TABLE IF NOT EXITSTS scores(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        player_id INTEGER NOT NULL,
        score INTEGER DEFAULT 0
    ) `

    _, err := db.Exec(createTable_Scores)
    if err != nil {
        log.Fatalf("Error createing Table Scores", err)
    }
}

func createTable_GameRooms(db* sql.DB){
    createTable_Gamerooms := `
        CREATE TABLE IF NOT EXISTS gamerooms,
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        player_id1 INTEGER NOT NULL,
        player_id2 INTEGER NOT NULL,
    `

    _, err := db.Exec(createTable_Gamerooms)
    if err != nil {
        log.Fatalf("Error creating Table gamerooms")
    }
}

func addPlayer(db* sql.DB, name string){
    insertSQL := `INSERT INTO users (name) VALUES (?)`
    _, err := db.Exec(insertSQL, name)
    if err != nil {
        log.Fatalf("failed adding player")
    }
}

func deletePlayer(db* sql.DB, name string){
    deleteSQL := `DELETE FROM users WHERE name = ?`
    result, err := db.Exec(deleteSQL, name)
    if err != nil {
        log.Fatalf(err)
    }
}


