<template>
  <div class="game-container">
    <canvas ref="gameCanvas"></canvas>
  </div>
</template>

<script>
import Graphics from "@/graphics/index.js"; // Ensure this path is correct

export default {
  name: "Game",
  mounted() {
    // Access the canvas reference and initialize the Three.js scene
    const canvas = this.$refs.gameCanvas;
    const graphics = new Graphics(canvas); // Pass the canvas element to the Graphics class

    // Optionally, you can start the game logic or animation loop here if needed
    graphics.start();
  },
};
</script>

<style scoped>
.game-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>