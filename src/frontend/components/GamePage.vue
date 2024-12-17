<template>
  <div>
    <h1>Game Over</h1>
    <form @submit.prevent="submitScore">
      <input v-model="playerName" placeholder="Your name" />
      <button type="submit">Submit Score</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      playerName: '',
      score: 100 // Example score, replace with actual game score
    };
  },
  methods: {
    submitScore() {
      axios.post('http://localhost:8080/players', {
        player_name: this.playerName,
        score: this.score
      })
          .then(response => {
            console.log('Score submitted:', response.data);
            this.$router.push('/scoreboard');
          })
          .catch(error => {
            console.error('There was an error submitting the score:', error);
          });
    }
  }
};
</script>