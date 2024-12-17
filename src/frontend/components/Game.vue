<template>
  <div class="game-container">
    <canvas ref="gameCanvas" width="1200" height="900"></canvas>
  </div>
</template>

<script>
// Import the Graphics class
import Graphics from '@/graphics/index';

export default {
  name: 'Game',
  mounted() {
    // Initialize and start the graphics rendering
    const canvas = this.$refs.gameCanvas;
    const graphics = new Graphics(canvas);
    graphics.start();
  }
};
</script>

<style scoped>
.game-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #87CEEB;
}

canvas {
  border: 1px solid black;
}
</style>