import { createRouter, createWebHistory } from 'vue-router';

// Komponenten importieren
import Home from '../views/Home.vue';
import Game from '../components/Game.vue';
import Room from '../views/Room.vue'

// Router-Konfiguration
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/game',
    name: 'Game',
    component: Game,
  },
  {
    path: '/room/:id',
    name: 'Room',
    component: Room,
    props: true
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;