import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default class Graphics {
    constructor(canvas) {
        // Renderer setup
        this.canvas = canvas;
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        // Scene and camera setup
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(-4, 3, 0);
        this.camera.lookAt(0, 0, 0);

        // OrbitControls setup
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;

        // Add event listeners for resize
        window.addEventListener('resize', this.onWindowResize.bind(this));

        // Initialize game components
        this.createLights();
        this.createGround();
        this.createPlayer();
        this.addEventListeners();

        // Game state
        this.player = null;
        this.obstacles = [];
        this.score = 0;
        this.keys = { left: false, right: false, space: false };
        this.gameSpeed = 0.1;
        this.obstacleSpeed = 0.3;
        this.gravity = -0.1;
        this.jumpStrength = 0.4;
        this.velocityY = 0;
        this.isJumping = false;

        // Start the game loop
        this.start();
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
            this.updateScore();
        }

        this.controls.update();
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    updateScore() {
        this.score += 1;  // Increase score based on your own conditions

        // Update the HUD score
        const scoreElement = document.getElementById('score');
        if (scoreElement) {
            scoreElement.textContent = this.score.toString();
        }
    }

    handlePlayerMovement() {
        if (this.keys.left) {
            this.player.position.z = Math.max(this.player.position.z - 0.1, -2);
        }
        if (this.keys.right) {
            this.player.position.z = Math.min(this.player.position.z + 0.1, 2);
        }
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

    createLights() {
        const ambientLight = new THREE.AmbientLight(0x404040, 1);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
        directionalLight.position.set(0, 5, 5);
        this.scene.add(directionalLight);
    }

    createGround() {
        const groundGeometry = new THREE.PlaneGeometry(200, 10);
        const texture = new THREE.TextureLoader().load("src/threejs/assets/textures/stone512x512.jpg");
        texture.needsUpdate = true;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(2, 20); // Repeats the texture 2x horizontally and vertically
        texture.rotation = Math.PI / 2;
        const groundMaterial = new THREE.MeshStandardMaterial({ map: texture });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = 0;
        this.scene.add(ground);
    }

    createPlayer() {
        const modelPath = 'src/threejs/assets/models/Soldier.glb';
        const loader = new GLTFLoader();
        loader.load(modelPath, (gltf) => {
            this.player = gltf.scene;
            this.player.scale.set(1, 1, 1);
            this.player.position.set(0, 0, 0);
            this.player.rotation.y = -Math.PI / 2;
            this.scene.add(this.player);
        }, undefined, (error) => {
            console.error('Error loading player model:', error);
        });
    }

    addEventListeners() {
        window.addEventListener('keydown', (e) => {
            switch (e.key) {
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
            switch (e.key) {
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

    spawnObstacles() {
        if (this.obstacles.length < 1) {
            const geometry = new THREE.BoxGeometry(2, 1, 1);
            const texture = new THREE.TextureLoader().load("src/threejs/assets/textures/woodBoxText.jpg");
            const material = new THREE.MeshStandardMaterial({ map: texture });
            const obstacle = new THREE.Mesh(geometry, material);

            obstacle.position.set(30, 0.5, Math.random() * 4);
            this.obstacles.push(obstacle);
            this.scene.add(obstacle);
        }
    }

    updateObstacles() {
        this.obstacles.forEach(obstacle => {
            obstacle.position.x -= this.obstacleSpeed;
            if (obstacle.position.x < -10) {
                this.scene.remove(obstacle);
            }
        });

        this.obstacles = this.obstacles.filter(obstacle => obstacle.position.x >= -10);
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
        // Add logic to reset the game or show a message
    }
}

// const canvas = document.querySelector('game-container');
// const game = new Graphics(canvas);