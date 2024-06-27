import './style.css'
import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/* ----Gui---- */
const gui = new dat.GUI();

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000); // Use PerspectiveCamera instead of Camera
camera.position.set(5, 5, 4);
scene.add(camera);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height);
document.body.appendChild(renderer.domElement);
renderer.render(scene, camera);

/* Bulb */
const pi = Math.PI;

const material = new THREE.MeshStandardMaterial({
  wireframe: true,
  color: 0xffffff,
});
const lightGeo = new THREE.CapsuleGeometry(0.2, 0.2);
const light = new THREE.Mesh(lightGeo, new THREE.MeshBasicMaterial({ color: 0xfdfefa }));
light.position.y = -2;

const lightCoverGeo = new THREE.SphereGeometry(1, 10, 3, 0, pi*2, pi/10, pi/2.5);
const lightCover = new THREE.Mesh(lightCoverGeo, material);

const lidGeo = new THREE.RingGeometry(pi/10 - 0.1, pi/10, 10);
const lid = new THREE.Mesh(lidGeo, new THREE.MeshStandardMaterial({ color: 0xf5e171, side: THREE.DoubleSide }));
lid.rotation.x = pi / 2;
lid.position.y = 1 - 0.047;

const standGeo = new THREE.CylinderGeometry(1, 0.5, 2, 10, 3, true);
const stand = new THREE.Mesh(standGeo, material);
stand.rotation.y = pi * 2 / 20;
stand.position.y = -1;

const footGeo = new THREE.CylinderGeometry(0.5, 0.4, 0.5);
const foot = new THREE.Mesh(footGeo, new THREE.MeshStandardMaterial({ color: 0xf5e171 }));
foot.position.y = -2.25;

const footStandGeo = new THREE.TorusGeometry(0.4, 0.1);
const footStand = new THREE.Mesh(footStandGeo, new THREE.MeshStandardMaterial({ color: 0xf5e171 }));
footStand.rotation.x = pi / 2;
footStand.position.y = -(2.25 + 0.5 / 2);

const floorGeo = new THREE.PlaneGeometry(5, 5);
const floor = new THREE.Mesh(floorGeo, new THREE.MeshStandardMaterial({ color: 0x111111, side: THREE.DoubleSide }));
floor.rotation.x = pi / 2;
floor.position.y = -(2.25 + 0.5 - 0.15);

scene.add(light, lightCover, lid, stand, foot, footStand, floor);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Light
const amLight = new THREE.AmbientLight(0xfcc754, 3);
const pointLight = new THREE.PointLight(0xfdfefa, 5);
pointLight.position.set(0, -(2 - 0.5), 0);
scene.add(amLight, pointLight);

// Intermediate objects for colors
const lightSettings = {
  amLightColor: amLight.color.getHex(),
  pointLightColor: pointLight.color.getHex()
};

// GUI
gui.add(amLight, 'intensity', 0, 100);
gui.addColor(lightSettings, 'amLightColor').name('Ambient Light Color').onChange((value) => {
  amLight.color.setHex(value);
});

gui.add(pointLight, 'intensity', 0, 100);
gui.addColor(lightSettings, 'pointLightColor').name('Point Light Color').onChange((value) => {
  pointLight.color.setHex(value);
});

// Calling F(x)
animate();
window.addEventListener('resize', handleResize);

// Imp F(x)
function animate() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

function handleResize() {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.render(scene, camera);
}