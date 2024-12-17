<template>
    <v-container
      class="d-flex justify-center align-center fill-height"
    >
      <v-card class="pa-5" max-width="400" elevation="10">
        <v-card-title class="text-h5 text-center">Spiel-Lobby</v-card-title>
        <v-card-text>
          <!-- Eingabefeld für Spielername -->
          <v-text-field
            v-model="playerName"
            label="Dein Name"
            outlined
            dense
          ></v-text-field>
  
          <!-- Eingabefeld für Raumnamen -->
          <v-text-field
            v-model="roomName"
            label="Raum Name"
            outlined
            dense
          ></v-text-field>
  
          <!-- Button zum Raum erstellen -->
          <v-btn
            color="primary"
            block
            class="mt-4"
            :disabled="!playerName || !roomName"
            @click="createRoom"
          >
            Raum erstellen
          </v-btn>
  
          <!-- Button zum Raum beitreten -->
          <v-btn
            color="secondary"
            block
            class="mt-2"
            :disabled="!playerName || !roomName"
            @click="joinRoom"
          >
            Raum beitreten
          </v-btn>
        </v-card-text>
      </v-card>
    </v-container>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    name: 'HomeView',
    data() {
      return {
        playerName: '',
        roomName: '',
      };
    },
    methods: {
      createRoom() {
        alert(`Raum erstellt: ${this.roomName}\nSpieler: ${this.playerName}`);
        // Logik für Raumerstellung hier hinzufügen
      },
      joinRoom() {
        alert(`Raum beigetreten: ${this.roomName}\nSpieler: ${this.playerName}`);
        // Logik für Raumbeitritt hier hinzufügen
      },
    },
  });
  </script>
  