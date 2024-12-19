<template>
    <div class="global-scoreboard">
      <v-card class="pa-4" outlined>
        <v-card-title class="text-h6">Globales Scoreboard</v-card-title>
        <v-card-text class="scrollable-content">
          <v-skeleton-loader
            v-if="loading"
            class="mt-4"
            :loading="loading"
            type="table"
          ></v-skeleton-loader>
  
          <v-data-table
            v-else
            :headers="headers"
            :items="scores"
            class="elevation-1"
            dense
            hide-default-footer
          ></v-data-table>
        </v-card-text>
      </v-card>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    name: "GlobalScoreboard",
    data() {
      return {
        loading: false,
        scores: [
            { playerName: "Spieler1", score: 1500 },
            { playerName: "Spieler2", score: 1200 },
    ],
        headers: [
          { text: "Spielername", value: "playerName" },
          { text: "Punkte", value: "score" },
        ],
      };
    },
    methods: {
      async fetchScores() {
        this.loading = true;
        try {
          const response = await axios.get("https://api.example.com/scoreboard"); // Ersetze mit deinem Backend-Endpunkt

          // Annahme: JSON hat das Format { "spielername1": score1, "spielername2": score2, ... }
          this.scores = [];
          for (const [playerName, score] of Object.entries(response.data)) {
            this.scores.push({ playerName, score });
          }
        } catch (error) {
          console.error("Fehler beim Abrufen des Scoreboards:", error);
          this.scores = [];
        } finally {
          this.loading = false;
        }
      },
    },
    mounted() {
      //this.fetchScores();
    },
  };
  </script>
  
  <style scoped>
  .global-scoreboard {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
  }
  
  .scrollable-content {
    max-height: 300px;
    overflow-y: auto;
  }
  
  .v-data-table {
    border: none;
  }
  </style>
  