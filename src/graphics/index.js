import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'; // Import GLTFLoader
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'; // Import OBJLoader if needed

export default class Graphics {
    constructor(canvas) {
        this.canvas = canvas;
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
        this.renderer.setSize(canvas.width, canvas.height);
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
        this.scene.background = new THREE.Color(0x87CEEB); // Set background color
        this.camera.position.z = 5;
        this.gravity = -0.1; // Gravity strength
        this.jumpStrength = 0.2; // Jump strength
        this.isJumping = false;
        this.velocityY = 0;

        // Initialize the loader
        this.loaderGLTF = new GLTFLoader();
        this.loaderOBJ = new OBJLoader();

        // Add ground and player
        this.createGround();
        this.createPlayer();

        // Handle keyboard input
        this.keys = { left: false, right: false, space: false };
        this.addEventListeners();
    }

    start() {
        this.gameLoop();
    }

    gameLoop() {
        // Ensure player is loaded before handling movement or gravity
        if (this.player) {
            // Handle player movement
            this.handleMovement();
            // Apply gravity (only if not jumping)
            if (!this.isJumping) {
                this.applyGravity();
            }
        }

        // Render the scene
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    handleMovement() {
        if (this.keys.left) {
            this.player.position.x -= 0.1; // Move left
        }
        if (this.keys.right) {
            this.player.position.x += 0.1; // Move right
        }
        if (this.keys.space && !this.isJumping) {
            this.jump();
        }
    }

    applyGravity() {
        if (this.player) { // Ensure player is defined
            if (this.player.position.y > -2) {
                this.velocityY += this.gravity;
            } else {
                this.velocityY = 0;
                this.player.position.y = -2; // Stop falling when touching ground
                this.isJumping = false; // Reset jumping status when touching ground
            }

            this.player.position.y += this.velocityY;
        }
    }

    jump() {
        if (!this.isJumping) {
            this.velocityY = this.jumpStrength; // Give the player an initial upward velocity
            this.isJumping = true;
        }
    }

    createGround() {
        const groundGeometry = new THREE.PlaneGeometry(20, 1);
        const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x228B22 });
        this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
        this.ground.position.y = -3; // Position it at the bottom
        this.scene.add(this.ground);
    }

    createPlayer() {
        const modelPath = 'src/threejs/assets/models/Soldier.glb'; // or 'path_to_your_model.obj'
        const texturePath = 'src/threejs/assets/textures/grasslight-big.jpg'; // Set the texture path

        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load(texturePath);

        // GLB loader example
        this.loaderGLTF.load(modelPath, (gltf) => {
            const model = gltf.scene;
            model.scale.set(1, 1, 1); // Set the size
            model.position.set(0, -2, 0); // Set initial position
            model.traverse((child) => {
                if (child.isMesh) {
                    child.material.map = texture; // Apply the texture
                }
            });
            this.player = model;
            this.scene.add(this.player);
        }, undefined, (error) => {
            console.error('Error loading GLTF model:', error);
        });
    }
    addEventListeners() {
        window.addEventListener('keydown', (e) => {
            e.preventDefault();  // Prevent the default action (like page scrolling)

            if (e.key === 'ArrowLeft') {
                this.keys.left = true;
            }
            if (e.key === 'ArrowRight') {
                this.keys.right = true;
            }
            if (e.key === ' ' && !this.isJumping) {
                this.keys.space = true;
            }
        });

        window.addEventListener('keyup', (e) => {
            e.preventDefault();  // Prevent the default action

            if (e.key === 'ArrowLeft') {
                this.keys.left = false;
            }
            if (e.key === 'ArrowRight') {
                this.keys.right = false;
            }
            if (e.key === ' ') {
                this.keys.space = false;
            }
        });
    }
}