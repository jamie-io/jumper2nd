import * as THREE from 'three';
import {TextureLoader, Vector3} from 'three';
// @ts-ignore
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import {W} from "./utils.ts";
import {textureCubeUV} from "three/src/nodes/pmrem/PMREMUtils";
import {cameraPosition} from "three/src/nodes/accessors/Camera";
import Shooter from "../Shooter.ts";
import {objectDirection} from "three/src/nodes/accessors/Object3DNode";

const WIDTH = 65;
const HEIGHT = 80;

function createSceneAndBG() {
    const scene = new THREE.Scene();
    const loader = new TextureLoader();
    const texture = loader.load('src/spaceinvaders/Large 1024x1024/Blue Nebula/Blue_Nebula_01-1024x1024.png');
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    scene.background = new THREE.Color(0xa8def0);
    scene.background = texture
    return scene;
}

function createOrbitControls(camera: THREE.Camera, renderer: THREE.WebGLRenderer) {
    const orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.minDistance = 5;
    orbitControls.maxDistance = 1500;
    orbitControls.enablePan = true;
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

function addBoundingBoxHelpers(scene: THREE.Scene, object: THREE.Object3D) {
    const box = new THREE.Box3().setFromObject(object);
    const helper = new THREE.Box3Helper(box, 0xff0000);
    scene.add(helper);
    return box;
}

function loadObjModel(objPath: string, textureUrl: string): Promise<THREE.Object3D> {
    return new Promise((resolve, reject) => {
        const loader = new OBJLoader();
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load(textureUrl);

        loader.load(
            objPath,
            (object) => {
                // Traverse to adjust properties of meshes if needed
                object.traverse((child) => {
                    if ((child as THREE.Mesh).isMesh) { // Type assertion with runtime check
                        console.log("load..")
                        child.castShadow = true;
                        child.scale.set(1,1,1);
                        child.receiveShadow = true;
                        const mesh = child as THREE.Mesh;
                        // Apply the texture to a new material
                        mesh.material = new THREE.MeshStandardMaterial({
                           // map: texture,
                            color: 0x00ff00,
                        });
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
    //floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;

    return floor;
}

function getEntityHeight(entity: THREE.Object3D): number {
    // Create a bounding box for the entity
    const boundingBox = new THREE.Box3().setFromObject(entity);
    // Calculate the height using the bounding box
    const height = boundingBox.max.y - boundingBox.min.y;
    return height;
}

async function loadGroupedInvaders(path: string, count: number): Promise<THREE.Group> {
    const modelGroup = new THREE.Group();
    const textureUrl = "src/textures/placeholder/placeholder.png";

    try {
        const baseModel = await loadObjModel(path, textureUrl);
        baseModel.scale.set(0.07, 0.09, 0.2);
        const modelHeight = getEntityHeight(baseModel);

        for (let i = 0; i < count; i++) {
            // Clone the base model for each entity
            const modelClone = baseModel.clone();
            modelClone.position.set(
                (-WIDTH / 2 + WIDTH - 7) - i * 10,
                (HEIGHT / 2) - modelHeight - 1,
                2
            ); // Adjust position dynamically
            modelGroup.add(modelClone);
        }
        return modelGroup; // Return the group instead of adding it to the scene

    } catch (error) {
        console.error("Error loading grouped invaders:", error);
        return modelGroup; // Return an empty group in case of error
    }
}
async function loadGroupedDefender(scene:any, paths: string[]) {
    const modelGroup = new THREE.Group();
    try {
        const models = await Promise.all(paths.map((path) => loadObjModel(path)));

        models.forEach((model, index) => {
            model.position.set(index * 10, 0, 0); // Adjust position dynamically
            modelGroup.add(model);
        });
        const index = 0;

        if (index < 0 || index >= modelGroup.children.length) {
            console.error('Invalid index');
            return;
        }
        const spaceInvader = modelGroup.children[index] as THREE.Object3D;
        spaceInvader.scale.set(0.1,0.1,0.1);

        scene.add(modelGroup);
    } catch (error) {
        console.error('Error loading grouped models:', error);
    }
}

async function loadGroupedBullets(path: string, count:number) {
    const modelGroup = new THREE.Group();
    const textureUrl = "src/textures/placeholder/placeholder.png";

    try {
        const baseModel = await loadObjModel(path, textureUrl);
        baseModel.scale.set(1, 1, 1);
        const modelHeight = getEntityHeight(baseModel);

        for (let i = 0; i < count; i++) {
            // Clone the base model for each entity
            const modelClone = baseModel.clone();
            modelClone.position.set(-i*2, -HEIGHT/2, 4); // Adjust position dynamically
            modelClone.rotation.x = Math.PI / -2; // Rotate 90 degrees around X-axis

            modelGroup.add(modelClone);
        }
        return modelGroup; // Return the group instead of adding it to the scene

    } catch (error) {
        console.error("Error loading grouped invaders:", error);
        return modelGroup; // Return an empty group in case of error
    }
}

async function main() {
    const scene = createSceneAndBG();
    const camera = createFollowingCamera(new THREE.Vector3(0, 0, 120), );
    const renderer = createRenderer();
    const orbitControls = createOrbitControls(camera, renderer);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    const backwall = generateFloor(WIDTH, HEIGHT);
    scene.add(backwall);
    light(scene);


    // INVADER
    const invaderGroup = new THREE.Group();
    const invaderPath = 'src/spaceinvaders/Space_Invader.obj';
    // Load groups
    const invadersGroup1 = await loadGroupedInvaders(invaderPath, 6);
    const invadersGroup2 = await loadGroupedInvaders(invaderPath, 6);

    // Translate groups individually
    invadersGroup1.position.set(0, 0, 0);
    invadersGroup2.position.set(0, -10, 0);

    invaderGroup.add(invadersGroup1, invadersGroup2);
    invaderGroup.translateY(-2)

    scene.add(invaderGroup)


    const boundingBox = new THREE.Box3();
    const boxHelper = new THREE.Box3Helper(boundingBox, 0xff0000);
    scene.add(boxHelper);

    //Scene, Position, obj, texture
    let position = new THREE.Vector3(0, -HEIGHT/2, 5);
    const bulletPath = 'src/spaceinvaders/rocket.obj';
    const textureUrl = "src/textures/placeholder/placeholder.png";

    //const shooter = new Shooter(scene, position, bulletPath, textureUrl)
    const shooter = new Shooter(scene, position, bulletPath, textureUrl);

    // Movement and shooting
    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') shooter.move('left');
        if (event.key === 'ArrowRight') shooter.move('right');
        if (event.key === ' ') shooter.shoot();
    });

    function animate() {
        orbitControls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
        shooter.update(invaderGroup);


        boundingBox.setFromObject();
    }

    animate();
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    document.body.appendChild(renderer.domElement);
}

main();