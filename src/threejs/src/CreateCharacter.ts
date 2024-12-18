import * as THREE from 'three';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { Mesh } from 'three';

function createCharacter(
    path: string,
    scene: THREE.Scene,
    camera: any,
    renderer: THREE.WebGLRenderer
): Promise<Mesh> {
    const loader = new GLTFLoader();
    const clock = new THREE.Clock();
    const keys: { [key: string]: boolean } = {}; // To store active keys
    let isJumping = false;
    let jumpVelocity = 0;
    let onGround = true;

    return new Promise((resolve, reject) => {
        loader.load(
            path,
            (gltf: GLTF) => {
                const soldier = gltf.scene as Mesh;
                soldier.scale.set(5, 5, 5);
                soldier.position.set(0, 0, 20);
                scene.add(soldier);

                // Listen for key events
                window.addEventListener('keydown', (event) => {
                    keys[event.key.toLowerCase()] = true;
                });

                window.addEventListener('keyup', (event) => {
                    keys[event.key.toLowerCase()] = false;
                });

                // Animation or physics update loop
                function animate() {
                    const delta = clock.getDelta();

                    // Movement logic
                    const speed = 20; // Units per second
                    const moveDistance = speed * delta; // Distance to move per frame

                    if (keys['w']) {
                        soldier.position.z -= moveDistance; // Move forward
                        soldier.rotation.y = 0;
                    }
                    if (keys['s']) {
                        soldier.position.z += moveDistance; // Move backward
                        soldier.rotation.y = 3;
                    }
                    if (keys['a']) {
                        soldier.position.x -= moveDistance; // Move left
                        soldier.rotation.y = 1.5; // Move left
                    }
                    if (keys['d']) {
                        soldier.position.x += moveDistance; // Move right
                        soldier.rotation.y = -1.5; // Move left
                    }

                    // Jump logic
                    if (keys[' '] && onGround) {
                        isJumping = true;
                        onGround = false;
                        jumpVelocity = 8; // Initial jump velocity
                    }

                    if (isJumping) {
                        soldier.position.y += jumpVelocity * delta; // Move up
                        jumpVelocity -= 20 * delta; // Simulate gravity

                        // Stop jump when character lands
                        if (soldier.position.y <= 0) {
                            soldier.position.y = 0;
                            isJumping = false;
                            onGround = true;
                        }
                    }

                    requestAnimationFrame(animate);
                    renderer.render(scene, camera);
                }

                animate();

                // Resolve the promise with the soldier model
                resolve(soldier);
            },
            undefined,
            (error:any) => {
                console.error('Error loading model:', error);
                reject(error);
            }
        );
    });
}

export default createCharacter;