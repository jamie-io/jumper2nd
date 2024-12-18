<template>
    <div class="create-room-frame">
      <v-container
        class="d-flex flex-column align-center justify-center "
        style="color: #1A237E;"
      >
        <v-row justify="center">
          
            <v-card elevation="10" class="p-6" color="#1A237E" 
            >
              <v-card-title class="text-h5">Raum erstellen</v-card-title>
              <v-card-text>
                <v-form ref="createRoomForm">
                  <!-- Raumname -->
                  <v-text-field
                    label="Raumname"
                    v-model="roomName"
                    outlined
                    required
                  ></v-text-field>

                  <v-text-field
                    label="Spielername"
                    v-model="playername"
                    outlined
                    type="playername"
                    required
                  ></v-text-field>
  
                  
                </v-form>
              </v-card-text>
  
              <v-card-actions class="d-flex justify-space-between">
                <v-btn color="secondary" @click="clearForm">Zurücksetzen</v-btn>
                <v-btn color="primary" @click="createRoom">Raum erstellen</v-btn>
              </v-card-actions>
            </v-card>
          
        </v-row>
      </v-container>
    </div>
  </template>
  
  <script>
  export default {
    name: "CreateRoomFrame",
    data() {
      return {
        roomName: "",
        playername: "",
      };
    },
    methods: {
      clearForm() {
        this.roomName = "";
        this.playername = "";
      },
      createRoom() {
        if (!this.roomName || !this.playername) {
          this.$emit("error", "Bitte füllen Sie alle Pflichtfelder aus.");
          return;
        }
  
        const roomData = {
          name: this.roomName,
          playername: this.playername,
        };
  
        console.log("Raumdaten:", roomData);
        this.$emit("room-created", roomData);
      },
    },
  };
  </script>
  
  <style scoped>
 .create-room-frame {
    color: #1A237E;
 }
  </style>
  