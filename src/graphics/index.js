import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'; // GLTFLoader import

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
        this.setCanvasSize(); // Set canvas size initially


        // Initialize loader
        this.loaderGLTF = new GLTFLoader(); // Initialize the GLTF loader

        // Add ground
        this.createGround();
        // Add player
        this.createPlayer();

        // Handle keyboard input
        this.keys = { left: false, right: false, space: false };
        this.addEventListeners();
    }

    start() {
        this.gameLoop();
    }

    setCanvasSize() {
        this.renderer.setSize(window.innerWidth, window.innerHeight); // Set size to window size
        this.camera.aspect = window.innerWidth / window.innerHeight; // Update camera aspect ratio
        this.camera.updateProjectionMatrix(); // Update camera projection matrix
    }

    gameLoop() {
        if (this.player) {  // Check if the player model is loaded
            // Handle player movement
            this.handleMovement();
            // Apply gravity
            this.applyGravity();
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
        if (this.player.position.y > -2) {
            // If the player is above the ground, apply gravity
            this.velocityY += this.gravity;
        } else {
            // When the player touches the ground, stop the fall and reset jumping status
            this.velocityY = 0;
            this.player.position.y = -2; // Keep the player at ground level
            this.isJumping = false; // Allow jumping again when touching the ground
        }

        this.player.position.y += this.velocityY;
    }

    jump() {
        // Only allow jumping if the player is not already in the air
        if (!this.isJumping) {
            this.velocityY = this.jumpStrength; // Give the player an initial upward velocity
            this.isJumping = true; // Set the jump status to true
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
        // Load GLB model with texture
        const modelPath = 'src/threejs/assets/models/Soldier.glb'; // or 'path_to_your_model.obj'
        const texturePath = 'src/threejs/assets/textures/grasslight-big.jpg'; // Set the texture path

        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load(texturePath);

        // GLTF loader example
        this.loaderGLTF.load(modelPath, (gltf) => {
            const model = gltf.scene;
            model.scale.set(1, 1, 1); // Set the size
            model.traverse((child) => {
                if (child.isMesh) {
                    child.material.map = texture; // Apply the texture
                }
            });
            this.player = model;
            this.player.position.set(0, -3, 0);
            this.scene.add(this.player);
        }, undefined, (error) => {
            console.error('Error loading GLTF model:', error);
        });
    }

    addEventListeners() {
        window.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.keys.left = true;
            }
            if (e.key === 'ArrowRight') {
                this.keys.right = true;
            }
            if (e.key === 'ArrowUp' && !this.isJumping) { // Listen for ArrowUp
                this.keys.space = true;
            }
        });

        window.addEventListener('keyup', (e) => {
            if (e.key === 'ArrowLeft') {
                this.keys.left = false;
            }
            if (e.key === 'ArrowRight') {
                this.keys.right = false;
            }
            if (e.key === 'ArrowUp') { // Listen for ArrowUp
                this.keys.space = false;
            }
        });
    }
}