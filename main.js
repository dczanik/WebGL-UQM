// Scene Setup
const scene = new THREE.Scene();

// Camera Setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Renderer Setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Player Ship Creation
let ship;
const shipGeometry = new THREE.BufferGeometry();
const shipVertices = new Float32Array([
    0, 0.5, 0,
    -0.5, -0.5, 0,
    0.5, -0.5, 0,
]);
shipGeometry.setAttribute('position', new THREE.BufferAttribute(shipVertices, 3));
const shipMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
ship = new THREE.Mesh(shipGeometry, shipMaterial);
scene.add(ship);

// Initialize Movement Variables
ship.velocity = new THREE.Vector3(0, 0, 0);
ship.angularVelocity = 0; // Though not used in this specific 2D rotation via ship.rotation.z
const thrustSpeed = 0.01;
const rotationSpeed = 0.05;
const damping = 0.99;

// Movement Controls
const keysPressed = {};
document.addEventListener('keydown', (event) => {
    keysPressed[event.key.toLowerCase()] = true;
});
document.addEventListener('keyup', (event) => {
    keysPressed[event.key.toLowerCase()] = false;
});

function updateShipMovement() {
    // Rotation
    if (keysPressed['arrowleft']) {
        ship.rotation.z += rotationSpeed; // Corrected: positive rotation for left turn if ship points up
    }
    if (keysPressed['arrowright']) {
        ship.rotation.z -= rotationSpeed; // Corrected: negative rotation for right turn if ship points up
    }

    // Thrust
    if (keysPressed['arrowup']) {
        // The default orientation of the triangle has its "front" pointing towards positive Y.
        // So, rotation.z = 0 means forward is (0, 1, 0).
        // Rotation is clockwise, so sin for X and cos for Y is correct for this orientation.
        const thrustX = Math.sin(ship.rotation.z) * thrustSpeed;
        const thrustY = Math.cos(ship.rotation.z) * thrustSpeed;
        ship.velocity.x += thrustX;
        ship.velocity.y += thrustY;
    }

    // Apply Damping
    ship.velocity.x *= damping;
    ship.velocity.y *= damping;

    // Update Position
    ship.position.x += ship.velocity.x;
    ship.position.y += ship.velocity.y;
}

// Game Loop
function animate() {
    requestAnimationFrame(animate);
    updateShipMovement();
    renderer.render(scene, camera);
}
animate();
