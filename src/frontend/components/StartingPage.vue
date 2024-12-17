<template>
  <div>
    <h1>Welcome to the Game!</h1>
    <button @click="startGame">Start Game</button>
  </div>
</template>

<script>
export default {
  methods: {
    startGame() {
      this.$router.push('/game');
    }
  }
};
</script>