<template>
  <div class="game-container">
    <!-- Zurück-Button -->
    <v-btn
      color="primary"
      outlined
      class="top-left-button"
      to="/"
    >
      Zurück zur Startseite
    </v-btn>

    <!-- Scoreboard -->
    <div class="scoreboard">
      <p><strong>{{ playerName }}</strong>: {{ playerScore }}</p>
      <p><strong>{{ opponentName }}</strong>: {{ opponentScore }}</p>
    </div>

    <!-- Game-Canvas -->
    <canvas ref="gameCanvas"></canvas>
  </div>
</template>

<script>
import axios from "axios"; // Axios importieren
import Graphics from "@/graphics/index.js"; // Ensure this path is correct

export default {
  name: "Game",
  data() {
    return {
      playerName: "Lade Spieler...", // Platzhalter
      playerScore: 0, // Initialer Wert
      opponentName: "Lade Gegner...", // Platzhalter
      opponentScore: 0, // Initialer Wert
      scoreInterval: null, // Referenz für das Intervall
    };
  },
  mounted() {
    // Zugriff auf das Canvas-Element und Initialisierung der Grafik
    const canvas = this.$refs.gameCanvas;
    const graphics = new Graphics(canvas);
    graphics.start();

    // Spieler- und Gegnerdaten initial laden
    this.loadPlayerData();
    this.loadOpponentData();

    // Intervall starten, um den Score regelmäßig zu aktualisieren
    this.scoreInterval = setInterval(() => {
      this.loadScores();
    }, 2000); // Alle 2 Sekunden
  },
  beforeDestroy() {
    // Intervall stoppen, wenn die Komponente zerstört wird
    if (this.scoreInterval) {
      clearInterval(this.scoreInterval);
    }
  },
  methods: {
    async loadPlayerData() {
      try {
        const response = await axios.get("/api/player");
        const data = response.data;
        this.playerName = data.name || "Unbekannter Spieler";
      } catch (error) {
        console.error("Fehler beim Laden der Spielerdaten:", error);
      }
    },
    async loadOpponentData() {
      try {
        const response = await axios.get("/api/opponent");
        const data = response.data;
        this.opponentName = data.name || "Unbekannter Gegner";
      } catch (error) {
        console.error("Fehler beim Laden der Gegnerdaten:", error);
      }
    },
    async loadScores() {
      try {
        // Spieler-Score laden
        const playerResponse = await axios.get("/api/player/score");
        this.playerScore = playerResponse.data.score || 0;

        // Gegner-Score laden
        const opponentResponse = await axios.get("/api/opponent/score");
        this.opponentScore = opponentResponse.data.score || 0;
      } catch (error) {
        console.error("Fehler beim Laden der Scores:", error);
      }
    },
  },
};
</script>

<style scoped>
.game-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
}
canvas {
  display: block;
  width: 100%;
  height: 100%;
}
.top-left-button {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 10;
}
.scoreboard {
  position: absolute;
  top: 50px; /* Unter dem Zurück-Button */
  left: 10px;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.7); /* Halbtransparenter Hintergrund */
  color: white;
  padding: 10px;
  border-radius: 5px;
  font-size: 18px;
  width: 200px;
}
.scoreboard p {
  margin: 5px 0;
}
</style>
