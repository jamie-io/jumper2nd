<template>
  <div>
    <h1>Scoreboard</h1>
    <ul>
      <li v-for="player in players" :key="player.id">
        {{ player.player_name }} - {{ player.score }}
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      players: []
    };
  },
  mounted() {
    axios.get('http://localhost:8080/scoreboard')
        .then(response => {
          this.players = response.data;
        })
        .catch(error => {
          console.error('There was an error retrieving the scoreboard:', error);
        });
  }
};
</script>