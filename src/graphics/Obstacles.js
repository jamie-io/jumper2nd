import * as THREE from "three";
import {h} from "vue";

export default class Obstacles {
    constructor() {
        this.obstacles = [];
    }

    createBoxes(amount, width = 0.5, height = 0.5) {
        const geometry = new THREE.BoxGeometry(width, height);
        const texture = new THREE.TextureLoader().load("src/threejs/assets/textures/woodBoxText.jpg");
        const material = new THREE.MeshBasicMaterial({ map: texture });

        for (let i = 0; i < amount; i++) {
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.y = height/2+0.1;
            mesh.position.x = i*2+2
            this.obstacles.push(mesh);  // Correctly pushing into the obstacles array
        }

        return this.obstacles;  // Returning the updated obstacles array
    }
}