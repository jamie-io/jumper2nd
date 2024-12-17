import * as THREE from "three";
import {Vector2} from "three";
import {texture} from "three/tsl";

export default class Obstacles {
    constructor() {
        this.obstacles = [];
    }
    createBoxes(amount, width=1, height=1) {
        const obstacle = [];
        const geometry = new THREE.BoxGeometry(width, height);
        const texture = new THREE.TextureLoader().load("src/threejs/assets/textures/woodBoxText.jpg")
        const material = new THREE.MeshBasicMaterial({map: texture})
        const mesh = new THREE.Mesh(geometry, material);
        for (let i = 0; i < amount; i++) {
            this.obstacle.push(mesh);
        }
        return obstacle;
    }
}