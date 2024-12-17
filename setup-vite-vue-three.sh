#!/bin/bash

# Check if Vite is installed
if ! command -v npm &> /dev/null
then
    echo "npm is not installed. Please install Node.js and npm before proceeding."
    exit 1
fi

# Step 1: Initialize Vite with Vue
echo "Initializing Vite with Vue..."
npm create vite@latest . --template vue

# Step 2: Install Three.js
echo "Installing Three.js..."
npm install three

# Step 3: Modify Vite Configuration (Optional, Example: Alias)
echo "Updating Vite configuration..."
cat <<EOL >> vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
EOL

# Step 4: Create Starter Files
echo "Creating default files..."
mkdir -p src/graphics
cat <<EOL > src/graphics/index.js
import * as THREE from 'three';

export default class Graphics {
    constructor(canvas) {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas });
        this.renderer.setSize(canvas.width, canvas.height);
        this.camera.position.z = 5;

        this.scene.background = new THREE.Color(0x87CEEB); // Light blue background

        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        this.scene.add(cube);

        this.animate();
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.camera);
    }
}
EOL

cat <<EOL > src/components/Game.vue
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
    const canvas = this.$refs.gameCanvas;
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
EOL

cat <<EOL > src/App.vue
<template>
  <Game />
</template>

<script>
import Game from "@/components/Game.vue";

export default {
  name: "App",
  components: { Game },
};
</script>
EOL

# Step 5: Clean Up Defaults
echo "Removing default Vue files..."
rm src/assets/logo.svg
rm src/components/HelloWorld.vue

# Step 6: Install Dependencies
echo "Installing dependencies..."
npm install

# Step 7: Done
echo "Setup complete! Run the following command to start your app:"
echo "npm run dev"