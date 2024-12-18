import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Vector3 } from "three";

export default class Graphics {
    constructor(canvas) {
        // Renderer setup
        this.canvas = canvas;
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        // Scene and camera
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        // OrbitControls setup
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true; // Smooth damping for controls
        this.controls.dampingFactor = 0.05;

        // Background
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load('src/threejs/assets/textures/horror_wall_09-512x512.png', (texture) => {
            texture.generateMipmaps = false;
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            this.scene.background = texture;
        });

        // Camera positioning
        this.camera.position.set(-5, 3, 5);
        this.camera.lookAt(0, 0, 0);

        // Game parameters
        this.gameSpeed = 0.1;
        this.obstacleSpeed = 0.2;
        this.obstacles = [];
        this.maxObstacles = 10;
        this.obstacleSpawnDistance = 20;

        // Player physics
        this.gravity = -0.1;
        this.jumpStrength = 0.4;
        this.isJumping = false;
        this.velocityY = 0;

        // Input tracking
        this.keys = { left: false, right: false, space: false };

        // Initialize game components
        this.createLights();
        this.createGround();
        this.createPlayer();
        this.addEventListeners();

        // Resize listener
        window.addEventListener('resize', this.onWindowResize.bind(this));
    }

    start() {
        this.gameLoop();
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    gameLoop() {
        if (this.player) {
            this.handlePlayerMovement();
            this.applyGravity();
            this.updateObstacles();
            this.spawnObstacles();
            this.checkCollisions();
        }

        // Update OrbitControls
        this.controls.update();

        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    handlePlayerMovement() {
        // Horizontal movement
        if (this.keys.left) {
            this.player.position.x = Math.max(this.player.position.x - 0.1, -2);
        }
        if (this.keys.right) {
            this.player.position.x = Math.min(this.player.position.x + 0.1, 2);
        }

        // Jumping
        if (this.keys.space && !this.isJumping) {
            this.jump();
        }
    }

    applyGravity() {
        if (this.player.position.y > 0) {
            this.velocityY += this.gravity;
        } else {
            this.velocityY = 0;
            this.player.position.y = 0;
            this.isJumping = false;
        }

        this.player.position.y += this.velocityY;
    }

    jump() {
        if (!this.isJumping) {
            this.velocityY = this.jumpStrength;
            this.isJumping = true;
        }
    }

    spawnObstacles() {
        // Limit total number of obstacles
        if (this.obstacles.length < this.maxObstacles) {
            const geometry = new THREE.BoxGeometry(1, 1, 1);
            const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
            const obstacle = new THREE.Mesh(geometry, material);

            // Spawn obstacles at a distance with random vertical positioning
            obstacle.position.set(
                this.obstacleSpawnDistance,
                Math.random() * 2,  // Random height
                0
            );

            this.obstacles.push(obstacle);
            this.scene.add(obstacle);
        }
    }

    updateObstacles() {
        // Move existing obstacles
        this.obstacles = this.obstacles.filter(obstacle => {
            obstacle.position.x -= this.obstacleSpeed;

            // Remove obstacles that are off-screen
            if (obstacle.position.x < -10) {
                this.scene.remove(obstacle);
                return false;
            }
            return true;
        });
    }

    checkCollisions() {
        if (!this.player) return;

        const playerBox = new THREE.Box3().setFromObject(this.player);

        this.obstacles.forEach(obstacle => {
            const obstacleBox = new THREE.Box3().setFromObject(obstacle);

            if (playerBox.intersectsBox(obstacleBox)) {
                this.gameOver();
            }
        });
    }

    gameOver() {
        console.log('Game Over!');
        // Add game over logic here - reset game, show score, etc.
    }

    createLights() {
        const ambientLight = new THREE.AmbientLight(0x404040, 1);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);
    }

    createGround() {
        const groundGeometry = new THREE.PlaneGeometry(200, 10);
        const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
        this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
        this.ground.rotation.x = -Math.PI / 2;
        this.ground.position.y = 0;
        this.scene.add(this.ground);
    }

    createPlayer() {
        const modelPath = 'src/threejs/assets/models/Soldier.glb';

        const loader = new GLTFLoader();
        loader.load(modelPath, (gltf) => {
            this.player = gltf.scene;
            this.player.scale.set(0.5, 0.5, 0.5);
            this.player.position.set(0, 0, 0);
            this.scene.add(this.player);
        }, undefined, (error) => {
            console.error('Error loading player model:', error);
        });
    }

    addEventListeners() {
        window.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                    this.keys.left = true;
                    break;
                case 'ArrowRight':
                    this.keys.right = true;
                    break;
                case 'ArrowUp':
                    this.keys.space = true;
                    break;
            }
        });

        window.addEventListener('keyup', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                    this.keys.left = false;
                    break;
                case 'ArrowRight':
                    this.keys.right = false;
                    break;
                case 'ArrowUp':
                    this.keys.space = false;
                    break;
            }
        });
    }
}