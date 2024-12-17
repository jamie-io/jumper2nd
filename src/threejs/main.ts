import * as THREE from 'three';

// Setup Scene
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gameCanvas') });
renderer.setSize(window.innerWidth, window.innerHeight);

// Add Ground (Platform)
const groundGeometry = new THREE.PlaneGeometry(200, 20);
const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x228B22 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -10;
scene.add(ground);

// Create Player
const playerGeometry = new THREE.BoxGeometry(2, 4, 2);
const playerMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const player = new THREE.Mesh(playerGeometry, playerMaterial);
player.position.y = -8;
scene.add(player);

// Basic Lighting
const light = new THREE.AmbientLight(0x404040);  // Ambient light
scene.add(light);

// Set Camera Position
camera.position.z = 50;

// Player Movement Variables
let velocityX = 0;
let velocityY = 0;
let isJumping = false;

// Keyboard Controls
const keys = { left: false, right: false, up: false };
document.addEventListener('keydown', (event) => {
    if (event.code === 'ArrowLeft' || event.code === 'KeyA') keys.left = true;
    if (event.code === 'ArrowRight' || event.code === 'KeyD') keys.right = true;
    if (event.code === 'Space' && !isJumping) keys.up = true;
});

document.addEventListener('keyup', (event) => {
    if (event.code === 'ArrowLeft' || event.code === 'KeyA') keys.left = false;
    if (event.code === 'ArrowRight' || event.code === 'KeyD') keys.right = false;
    if (event.code === 'Space') keys.up = false;
});

// Game Loop
function animate() {
    requestAnimationFrame(animate);

    // Update Player Movement
    if (keys.left) velocityX = -2;
    else if (keys.right) velocityX = 2;
    else velocityX = 0;

    // Jumping Mechanics
    if (keys.up && !isJumping) {
        velocityY = 5;
        isJumping = true;
    }

    // Apply Gravity
    if (player.position.y > -8) {
        velocityY -= 0.2; // Gravity pull
    } else {
        player.position.y = -8;
        isJumping = false;
        velocityY = 0;
    }

    // Move Player
    player.position.x += velocityX;
    player.position.y += velocityY;

    // Keep player inside screen bounds
    if (player.position.x < -window.innerWidth / 2) player.position.x = -window.innerWidth / 2;
    if (player.position.x > window.innerWidth / 2) player.position.x = window.innerWidth / 2;

    // Render Scene
    renderer.render(scene, camera);
}

// Start Game Loop
animate();

// Resize Handling
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.left = window.innerWidth / -2;
    camera.right = window.innerWidth / 2;
    camera.top = window.innerHeight / 2;
    camera.bottom = window.innerHeight / -2;
    camera.updateProjectionMatrix();
});