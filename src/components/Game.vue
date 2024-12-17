<template>
  <div class="game-container">
    <canvas ref="gameCanvas"></canvas>
  </div>
</template>

<script>
import Graphics from "@/graphics/index";

export default {
  name: "Game",
  mounted() {
    const canvas = this.gameCanvas;
    const graphics = new Graphics(canvas);
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
