import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';

// Import components
import GamePage from './components/GamePage.vue';
import StartingPage from './components/StartingPage.vue';
import Scoreboard from './components/Scoreboard.vue';

// Define routes
const routes = [
    { path: '/', component: StartingPage },
    { path: '/game', component: GamePage },
    { path: '/scoreboard', component: Scoreboard },
];

// Create the router instance
const router = createRouter({
    history: createWebHistory(),
    routes,
});

const app = createApp(App);
app.use(router);
app.mount('#app');