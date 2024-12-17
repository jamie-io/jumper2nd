import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import Obstacles from "@/graphics/Obstacles.js";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'; // Import OrbitControls

export default class Graphics {
    constructor(canvas) {
        this.canvas = canvas;
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
        this.renderer.setSize(window.innerWidth, window.innerHeight); // Set canvas size to window size
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.scene.background = new THREE.Color(0x87CEEB); // Set background color
        this.camera.position.z = 5;
        this.camera.position.y = 3;
        this.camera.position.x = -2;


        // Initialize OrbitControls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true; // Enable damping (inertia)
        this.controls.dampingFactor = 0.25; // Set damping factor
        this.controls.screenSpacePanning = false; // Disable screen space panning (optional)
        this.controls.maxPolarAngle = Math.PI / 2; // Prevent going below the ground

        this.gravity = -0.1; // Gravity strength
        this.jumpStrength = 0.2; // Jump strength
        this.isJumping = false;
        this.velocityY = 0;
        this.createObstacles();

        // Initialize loader
        this.loaderGLTF = new GLTFLoader(); // Initialize the GLTF loader

        // Add lights to the scene
        this.createLights();

        // Add ground
        this.createGround();
        // Add player
        this.createPlayer();

        // Handle keyboard input
        this.keys = { left: false, right: false, space: false, down: false };
        this.addEventListeners();

        // Adjust camera aspect ratio for window resizing
        window.addEventListener('resize', this.setCanvasSize.bind(this));
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

        // Update OrbitControls
        this.controls.update(); // Only required if controls.enableDamping = true, or if controls.enableZoom = true

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
            this.jump(); // Jump
        }
        if (this.keys.down) {
            this.player.position.y -= 0.1; // Move down manually
        }
    }

    applyGravity() {
        // Apply gravity if the player is above the ground
        if (this.player.position.y > -0) {
            this.velocityY += this.gravity; // Gravity applies
        } else {
            this.velocityY = 0; // Stop falling
            this.player.position.y = 0; // Stop at ground level
            this.isJumping = false; // Reset jump status when grounded
        }

        this.player.position.y += this.velocityY; // Apply vertical movement
    }

    jump() {
        // Only allow jumping if not already jumping
        if (!this.isJumping) {
            this.velocityY = this.jumpStrength; // Jump with initial upward velocity
            this.isJumping = true; // Set jumping status
        }
    }

    createLights() {
        // Add an ambient light (soft, non-directional light)
        const ambientLight = new THREE.AmbientLight(0x404040, 1); // Light gray color with intensity of 1
        this.scene.add(ambientLight);

        // Add a directional light (simulates sunlight)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // White light with intensity of 1
        directionalLight.position.set(5, 5, 5); // Position the light
        this.scene.add(directionalLight);

        // Optional: Add a helper to visualize the directional light (for debugging)
        const lightHelper = new THREE.DirectionalLightHelper(directionalLight, 1);
        this.scene.add(lightHelper);
    }

    createGround() {
        const groundGeometry = new THREE.BoxGeometry(200, 0.1,1);
        const texture = new THREE.TextureLoader().load("src/threejs/assets/textures/stone512x512.jpg");
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set( 8, 32 );
        texture.rotation = Math.PI / 2; // Rotate the texture by 45 degrees (PI / 4 radians)

        const groundMaterial = new THREE.MeshStandardMaterial({ map: texture }); // Changed to MeshStandardMaterial
        this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
        this.ground.position.y = -0; // Position it at the bottom
        this.scene.add(this.ground);
    }

    createPlayer() {
        // Load GLB model with texture
        const modelPath = 'src/threejs/assets/models/Soldier.glb'; // Replace with your model path
        const texturePath = 'src/threejs/assets/textures/grasslight-big.jpg'; // Replace with your texture path

        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load(texturePath);

        // GLTF loader example
        this.loaderGLTF.load(modelPath, (gltf) => {
            const model = gltf.scene;
            model.scale.set(1, 1, 1); // Set the size

            model.traverse((child) => {
                if (child.isMesh) {
                    // Apply the texture to each mesh
                    child.material.map = texture;
                    child.material.needsUpdate = true; // Ensure the material is updated
                    console.log('Texture applied to mesh:', child.name);
                }
            });

            this.player = model;
            this.player.position.set(0, -3, 0); // Position player above the ground
            this.scene.add(this.player);

        }, undefined, (error) => {
            console.error('Error loading GLTF model:', error);
        });
    }

    createObstacles() {
        const obst = new Obstacles();
        let obstacles = obst.createBoxes(20);
        for (let i = 0; i < obstacles.length; i++) {
            this.scene.add(obstacles[i]);
        }
    }

    addEventListeners() {
        window.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.keys.left = true;
            }
            if (e.key === 'ArrowRight') {
                this.keys.right = true;
            }
            if (e.key === 'ArrowUp' && !this.isJumping) { // Listen for ArrowUp for jumping
                this.keys.space = true;
            }
            if (e.key === 'ArrowDown') { // Listen for ArrowDown to move down
                this.keys.down = true;
            }
        });

        window.addEventListener('keyup', (e) => {
            if (e.key === 'ArrowLeft') {
                this.keys.left = false;
            }
            if (e.key === 'ArrowRight') {
                this.keys.right = false;
            }
            if (e.key === 'ArrowUp') { // Listen for ArrowUp for jumping
                this.keys.space = false;
            }
            if (e.key === 'ArrowDown') { // Stop moving down
                this.keys.down = false;
            }
        });
    }
}