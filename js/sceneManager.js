import * as THREE from "three";

export function createSceneManager(container) {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x020408, 0.012);

  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000,
  );
  camera.position.set(15, 12, 15);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  function setupLights() {
    scene.add(new THREE.AmbientLight(0x404050, 1.2));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight.position.set(-10, 20, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.set(2048, 2048);
    scene.add(dirLight);
    const p1 = new THREE.PointLight(0xffaa00, 0.6, 100);
    p1.position.set(20, 15, -20);
    scene.add(p1);
    const p2 = new THREE.PointLight(0x00f3ff, 0.4, 50);
    p2.position.set(-15, 5, 15);
    scene.add(p2);
  }

  function onResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }

  function render() {
    renderer.render(scene, camera);
  }

  setupLights();

  return {
    scene,
    camera,
    renderer,
    onResize,
    render,
  };
}
