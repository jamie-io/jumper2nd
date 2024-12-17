import * as THREE from "three";

export default class Obstacles {
    constructor() {
        this.obstacles = [];
        this.bboxes = [];
    }

    createBoxes(amount, width = 0.5, height = 0.5) {
        const geometry = new THREE.BoxGeometry(width, height);
        const texture = new THREE.TextureLoader().load("src/threejs/assets/textures/woodBoxText.jpg");
        const material = new THREE.MeshBasicMaterial({ map: texture });

        const out = [] // Will hold obstacle info objects

        for (let i = 0; i < amount; i++) {
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.y = height / 2 + 0.02; // Position above the ground
            mesh.position.x = i * 2 + 2; // Spacing obstacles apart on the X-axis

            // Create bounding box for the obstacle
            const boundingBox = new THREE.Box3().setFromObject(mesh); // Create a bounding box based on the mesh

            // Visualize the bounding box (optional, for debugging)
            const boxHelper = new THREE.Box3Helper(boundingBox, 0xffff00); // Create a helper with yellow color
            this.bboxes.push(boundingBox); // Adding bounding box to bboxes array

            // Add the box helper to the mesh's parent or to the scene directly
            this.obstacles.push(mesh); // Add mesh to obstacles array

            // Add the helper to the scene to visualize the bounding box
            mesh.add(boxHelper); // Add the bounding box helper to the mesh (make sure the helper follows the mesh)

            // Define the info object with obstacle and its bounding box
            const boxInfo = {
                obstacle: mesh,
                boundingBox: boundingBox,
                boxHelper: boxHelper // Store the helper so you can interact with it if needed
            };

            // Add to the output array
            out.push(boxInfo);
        }

        return out; // Returning array of obstacle info objects
    }
}