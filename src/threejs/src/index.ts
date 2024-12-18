import * as THREE from 'three';
import {TextureLoader, Vector3} from 'three';
// @ts-ignore
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import createCharacter from './CreateCharacter';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

const WIDTH = 100;
const HEIGHT = 500;

function createSceneAndBG() {
    const scene = new THREE.Scene();
    const loader = new TextureLoader();
    const texture = loader.load('src/textures/herobg.jpeg');
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    //scene.background = new THREE.Color(0xa8def0);
    scene.background = texture
    return scene;
}

function createOrbitControls(camera: THREE.Camera, renderer: THREE.WebGLRenderer) {
    const orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = false;
    orbitControls.minDistance = 5;
    orbitControls.maxDistance = 1500;
    orbitControls.enablePan = false;
    orbitControls.maxPolarAngle = Math.PI / 2 - 0.05;
    return orbitControls;
}

function createRenderer() {
    return new THREE.WebGLRenderer({ antialias: true });
}

function light(scene: THREE.Scene) {
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(-60, 100, -10);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 50;
    dirLight.shadow.camera.bottom = -50;
    dirLight.shadow.camera.left = -50;
    dirLight.shadow.camera.right = 50;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 200;
    dirLight.shadow.mapSize.width = 4096;
    dirLight.shadow.mapSize.height = 4096;
    scene.add(dirLight);
}

function createFollowingCamera(position: Vector3) {
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.copy(position);
    return camera;
}

function generateFloor(width: number, length: number) {
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('src/textures/horror_wall_09-512x512.png');
    texture.wrapT = texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.set(1,1);
    const normalMap = textureLoader.load('./src/textures/grasslight-big-nm.jpg');

    const geometry = new THREE.PlaneGeometry(width, length);
    const material = new THREE.MeshStandardMaterial({
        map: texture,
        //normalMap: normalMap,
    });
    const floor = new THREE.Mesh(geometry, material);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;

    return floor;
}

function createWoodBoxes(amount: number, boxSize: Vector3, textureUrl = './src/textures/woodBoxText.jpg'): THREE.Group {
    const loader = new THREE.TextureLoader();
    const texture = loader.load(textureUrl);

    const group = new THREE.Group();
    const geometry = new THREE.BoxGeometry(boxSize.x, boxSize.y, boxSize.z);
    const material = new THREE.MeshStandardMaterial({ map: texture });

    for (let i = 0; i < amount; i++) {
        const box = new THREE.Mesh(geometry, material);
        box.position.set(
            getRandomInt(-WIDTH / 2, WIDTH / 2),
            boxSize.y / 2,
            getRandomInt(-HEIGHT / 2, HEIGHT / 2)
        );
        box.castShadow = true;
        group.add(box);
    }
    return group;
}

function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createWall(textureURL: string, size: Vector3, translation: Vector3) {
    const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
    const loader = new THREE.TextureLoader();
    const texture = loader.load(textureURL);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(5, 1);
    const material = new THREE.MeshStandardMaterial({ map: texture });
    const wall = new THREE.Mesh(geometry, material);
    //maze.position.set(-WIDTH / 2, size.y / 2, 0);
    wall.position.set(translation.x, translation.y, translation.z);
    wall.castShadow = true;
    return wall;
}

function createLevel() : THREE.Group{
    // WALLS
    const textureUrl = 'src/textures/stone512x512.jpg';
    const outerWallGroup = new THREE.Group();
    const height = 25;
    const thickness = 2
    const wallSize_sides: Vector3 = new Vector3(thickness, height, HEIGHT);

    const translation_left: Vector3 = new Vector3(-WIDTH/2, wallSize_sides.y/2, 0);
    const translation_right: Vector3 = new Vector3(WIDTH/2, wallSize_sides.y/2, 0);


    const wallSize_topbot: Vector3 = new Vector3(thickness, height, WIDTH);

    const translation_top: Vector3 = new Vector3(0, wallSize_sides.y/2, HEIGHT/2);
    const translation_bottom: Vector3 = new Vector3(0, wallSize_sides.y/2, -HEIGHT/2);

    const leftWall = createWall(textureUrl, wallSize_sides, translation_left);
    const rightWall = createWall(textureUrl, wallSize_sides, translation_right);
    const topWall = createWall(textureUrl,wallSize_topbot, translation_top);
    const bottomWall = createWall(textureUrl, wallSize_topbot, translation_bottom);
    topWall.rotation.y = Math.PI / 2;
    bottomWall.rotation.y = Math.PI / 2;

    outerWallGroup.add(leftWall, rightWall, topWall, bottomWall);

    return outerWallGroup;
}

function addBoundingBoxHelpers(scene: THREE.Scene, object: THREE.Object3D) {
    const box = new THREE.Box3().setFromObject(object);
    const helper = new THREE.Box3Helper(box, 0xff0000);
    scene.add(helper);
    return box;
}

function loadObjModel(objPath: string): Promise<THREE.Object3D> {
    return new Promise((resolve, reject) => {
        const loader = new OBJLoader();

        loader.load(
            objPath,
            (object) => {
                // Traverse to adjust properties of meshes if needed
                object.traverse((child) => {
                    if ((child as THREE.Mesh).isMesh) { // Type assertion with runtime check
                        console.log("load..")
                        child.castShadow = false;
                        child.scale.set(10,10,10);
                        child.position.set(0,0,0)
                        child.receiveShadow = false;
                    }
                });
                resolve(object); // Return the loaded object
            },
            undefined, // Progress callback (optional)
            (error) => {
                reject(`Failed to load OBJ model: ${error}`);
            }
        );
    });
}

async function main() {
    const scene = createSceneAndBG();
    const camera = createFollowingCamera(new THREE.Vector3(0, 50, 100), );
    const renderer = createRenderer();
    const orbitControls = createOrbitControls(camera, renderer);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    renderer.shadowMap.enabled = true;
    const floor = generateFloor(WIDTH, HEIGHT);

    scene.add(floor);

    light(scene);

    const borderWalls = createLevel();
    scene.add(borderWalls);

    try {
        const character = await createCharacter('./src/models/Soldier.glb', scene, camera, renderer);
        addBoundingBoxHelpers(scene, character);

        const ferrariModel = await loadObjModel('src/knight/knightReduced.obj');
        ferrariModel.position.set(0, 0, 0); // Adjust position if necessary
        ferrariModel.scale.set(1, 1, 1); // Adjust scale if necessary
        scene.add(ferrariModel); // Add the model to the scene

        // Track key states
        const keys = {
            a: false, // Left
            d: false, // Right
            w: false, // Forward
            s: false, // Backward
        };

// Add event listeners for keydown and keyup
        window.addEventListener('keydown', (event) => {
            const key = event.key.toLowerCase();
            if (keys.hasOwnProperty(key)) keys[key as keyof typeof keys] = true;
        });

        window.addEventListener('keyup', (event) => {
            const key = event.key.toLowerCase();
            if (keys.hasOwnProperty(key)) keys[key as keyof typeof keys] = false;
        });

        const cubesize = new Vector3(3,3,3);
        const amount = 50;
        const woodBox_group = createWoodBoxes(amount, cubesize);

        function spawnRecursice(amount:number){
            let n = 0
            if (n < amount){
                scene.add(woodBox_group.children[n]);
                n++;
                setTimeout(spawnRecursice, 50)
            }
        }

        spawnRecursice(50);

        // BB Character
        const boundingBox = new THREE.Box3();
        const boxHelper = new THREE.Box3Helper(boundingBox, 0xff0000);
        scene.add(boxHelper);

        // BB Walls
        const boundingBoxWalls = new THREE.Box3();
        const boxHelperWalls = new THREE.Box3Helper(boundingBoxWalls, 0xff0000);
        scene.add(boxHelperWalls);

        function animate() {
            orbitControls.update();

            //if (characterBox.intersectsBox(bboxleft) || characterBox.intersectsBox(bboxright)) {
            //    console.log('Collision detected!');
            //}

            // Make the camera follow the character
            const characterPosition = new THREE.Vector3();
            character.getWorldPosition(characterPosition);
            boundingBox.setFromObject(character);


            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        }

        animate();
    } catch (error) {
        console.error('Error loading character:', error);
    }

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    document.body.appendChild(renderer.domElement);
}

main();