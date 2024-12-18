<template>
    <div class="background">
      <!-- Hintergrund-Bereich -->
      <v-container
        class="d-flex flex-column align-center justify-center"
        style="position: relative; height: 100vh;"
      >
        <!-- Buttons mit Animation -->
        <div class="button-wrapper" :class="{ 'hidden': activeBox }">
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
  
        <!-- Dynamisches Kästchen mit Animation -->
        <v-scale-transition mode="out-in">
          <v-card
            v-if="activeBox"
            class="mx-auto card-container no-padding"
            max-width="700"
            elevation="10"
          >
            <component :is="activeComponent" />
          </v-card>
        </v-scale-transition>
      </v-container>
  
      <!-- Zurück-Button -->
      <v-slide-y-transition>
        <v-btn
          v-if="activeBox"
          color="secondary"
          outlined
          class="back-button"
          @click="toggleBox(null)"
        >
          Zurück
        </v-btn>
      </v-slide-y-transition>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import TrainingComponent from '../components/TrainingFrame.vue';
  import CreateRoomComponent from '../components/CreateRoomFrame.vue';
  import JoinRoomComponent from '../components/JoinRoomFrame.vue';
  
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
      toggleBox(box: string | null) {
        this.activeBox = this.activeBox === box ? null : box; // Wechsel zwischen Boxen
      },
    },
  });
  </script>
  
  <style scoped>
  .background {
    background-image: url('../../threejs/assets/textures/herobg.jpeg');
    height: 100vh;
    overflow: hidden;
  }
  
  .button-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    transition: opacity 0.3s ease;
  }
  
  .button-wrapper.hidden {
    opacity: 0;
    pointer-events: none;
  }
  
  .card-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: all 0.3s ease;
    padding: 0;
    overflow: hidden;
  }
  
  .back-button {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translate(-50%, 0);
    transition: opacity 0.3s ease;
  }
  </style>
  