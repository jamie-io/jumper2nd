<template>
    <div class="join-room-frame">
      <v-container
        class="d-flex flex-column align-center justify-center"
        style="color: #1A237E;"
      >
        <v-row justify="center">
          <v-card elevation="10" class="pa-6" color="#1A237E">
            <v-card-title class="text-h5">Raum betreten</v-card-title>
            <v-card-text>
              <v-form ref="joinRoomForm">
                <!-- Name -->
                <v-text-field
                  label="Spielername"
                  v-model="userName"
                  outlined
                  required
                ></v-text-field>
  
                <!-- Raum-ID -->
                <v-text-field
                  label="Raum-ID"
                  v-model="roomId"
                  outlined
                  required
                ></v-text-field>
              </v-form>
            </v-card-text>
  
            <v-card-actions class="d-flex justify-space-between">
              <v-btn color="secondary" @click="clearForm">Zurücksetzen</v-btn>
              <v-btn color="primary" dark @click="joinRoom">Raum betreten</v-btn>
            </v-card-actions>
          </v-card>
        </v-row>
      </v-container>
    </div>
  </template>
  
  <script>
  export default {
    name: "JoinRoomFrame",
    data() {
      return {
        userName: "",
        roomId: "",
      };
    },
    methods: {
      clearForm() {
        this.userName = "";
        this.roomId = "";
      },
      joinRoom() {
        if (!this.userName || !this.roomId) {
          this.$emit("error", "Bitte geben Sie Ihren Namen und eine Raum-ID ein.");
          return;
        }
  
        const roomData = {
          userName: this.userName,
          roomId: this.roomId,
        };
  
        console.log("Raum betreten mit Daten:", roomData);
        this.$emit("room-joined", roomData);
      },
    },
  };
  </script>
  
  <style scoped>
  .join-room-frame {
    color: #1A237E;
  }

  </style>
  