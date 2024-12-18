<template>
    <div class="background">
      <!-- Hintergrund-Bereich -->
      <v-container
        class="fill-height d-flex flex-column align-center justify-center"
        style="background-image: url('../../threejs/assets/textures/backgrounddetailed6.jpg'); background-size: cover; background-position: center; height: 100vh;"
      >
        <!-- Buttons -->
        <div class="d-flex justify-center mb-5">
          <v-btn
            color="primary"
            outlined
            large
            class="mx-2"
            @click="toggleBox('training')"
          >
            Training
          </v-btn>
          <v-btn
            color="primary"
            outlined
            large
            class="mx-2"
            @click="toggleBox('createRoom')"
          >
            Raum erstellen
          </v-btn>
          <v-btn
            color="primary"
            outlined
            large
            class="mx-2"
            @click="toggleBox('joinRoom')"
          >
            Raum betreten
          </v-btn>
        </div>
  
        <!-- Dynamisches Kästchen -->
        <v-scale-transition mode="out-in">
          <v-card
            v-if="activeBox"
            class="mx-auto"
            width="500"
            elevation="10"
          >
            <v-card-text>
              <component :is="activeComponent" />
            </v-card-text>
          </v-card>
        </v-scale-transition>
      </v-container>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import TrainingComponent from '../components/TrainingFrame.vue';
  import CreateRoomComponent from '../components/TrainingFrame.vue';
  import JoinRoomComponent from '../components/TrainingFrame.vue';
  
  export default defineComponent({
    name: 'HomeView',
    components: {
      TrainingComponent,
      CreateRoomComponent,
      JoinRoomComponent,
    },
    data() {
      return {
        activeBox: null as string | null, // Aktive Box
      };
    },
    computed: {
      activeComponent() {
        switch (this.activeBox) {
          case 'training':
            return 'TrainingComponent';
          case 'createRoom':
            return 'CreateRoomComponent';
          case 'joinRoom':
            return 'JoinRoomComponent';
          default:
            return null;
        }
      },
    },
    methods: {
      toggleBox(box: string) {
        this.activeBox = this.activeBox === box ? null : box; // Wechsel zwischen Boxen
      },
    },
  });
  </script>
  
  <style scoped>
  .background {
    background-image: url('../../threejs/assets/textures/herobg.jpeg');
    height: 100vh;
  }
  </style>
  