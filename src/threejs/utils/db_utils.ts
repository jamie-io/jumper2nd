import Database from 'better-sqlite3';

export interface Player {
    id?: number;
    playerName: string;
    matchesPlayed: number;
    highestScore: number;
}

export class GameDatabase {
    private db: Database.Database;

    constructor(dbFile: string) {
        // Open or create the database
        this.db = new Database(dbFile);

        // Ensure the players table exists
        this.initializeSchema();
    }

    private initializeSchema() {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS players (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                player_name TEXT UNIQUE NOT NULL,
                matches_played INTEGER DEFAULT 0,
                highest_score INTEGER DEFAULT 0
            );
        `;
        this.db.prepare(createTableQuery).run();
        console.log('Database schema initialized.');
    }

    addPlayer(playerName: string): void {
        const query = `
            INSERT INTO players (player_name, matches_played, highest_score)
            VALUES (?, 0, 0);
        `;
        try {
            this.db.prepare(query).run(playerName);
            console.log(`Player "${playerName}" added to the database.`);
        } catch (error) {
            console.error(`Failed to add player "${playerName}":`, error.message);
        }
    }

    updateScore(playerName: string, score: number): void {
        const query = `
            UPDATE players
            SET highest_score = MAX(highest_score, ?),
                matches_played = matches_played + 1
            WHERE player_name = ?;
        `;
        const result = this.db.prepare(query).run(score, playerName);
        if (result.changes > 0) {
            console.log(`Player "${playerName}" updated with score ${score}.`);
        } else {
            console.error(`Player "${playerName}" not found.`);
        }
    }

    getLeaderboard(limit: number = 10): Player[] {
        const query = `
            SELECT id, player_name AS playerName, matches_played AS matchesPlayed, highest_score AS highestScore
            FROM players
            ORDER BY highest_score DESC
            LIMIT ?;
        `;
        return this.db.prepare(query).all(limit);
    }

    close(): void {
        this.db.close();
        console.log('Database connection closed.');
    }
}

// Example Usage
const db = new GameDatabase('players.db');

// Add players
db.addPlayer('Player1');
db.addPlayer('Player2');

// Update scores
db.updateScore('Player1', 500);
db.updateScore('Player2', 300);

// Get leaderboard
const leaderboard = db.getLeaderboard();
console.log('Leaderboard:', leaderboard);

// Close the database
db.close();