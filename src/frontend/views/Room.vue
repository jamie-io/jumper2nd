<template>
    <div class="background">
    <div class="room">
      <v-container class="d-flex flex-column align-center justify-center">
        <v-row>
          <v-card elevation="10" class="p-6" color="#1A237E">
            <v-card-title class="text-h5">
              Raum: {{ mockRoomData.name }}
            </v-card-title>
            <v-card-text>
              <p><strong>Raum ID:</strong> {{ roomId }}</p>
              <p><strong>Spieler im Raum:</strong></p>
              <v-list>
                <v-list-item
                  v-for="(player, index) in mockRoomData.players"
                  :key="index"
                >
                  <v-list-item-content>
                    {{ player }}
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card-text>
  
            <v-card-actions>
              <v-btn color="error" to="/" outlined>Raum verlassen</v-btn>
            </v-card-actions>
          </v-card>
        </v-row>
      </v-container>
    </div>
</div>
  </template>
  
  <script>
  export default {
    name: "Room",
    data() {
      return {
        roomId: null, // ID aus der Route
        mockRoomData: {
          // Simulierte Raumdaten
          name: "Beispiel-Raum",
          players: ["Spieler1", "Spieler2", "Spieler3"],
        },
      };
    },
    created() {
      this.roomId = this.$route.params.id; // Raum-ID aus der URL holen
    },
  };
  </script>
  
  <style scoped>
  .room {
    color: #1A237E;
    margin: 20px;
  }

  .background {
    background-image: url('../../threejs/assets/textures/herobg.jpeg');
    height: 100vh;
    overflow: hidden;
  }
  </style>
  