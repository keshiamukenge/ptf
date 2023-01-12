import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default class Camera {
  constructor(webgl, { orbitControls }) {
    this.webgl = webgl;

    this.setupCamera();

    if (orbitControls) {
      this.controls = new OrbitControls(this.instance, this.webgl.renderer.domElement);
    }
  }

  setupCamera() {
    this.instance = new THREE.PerspectiveCamera(
      70,
      this.webgl.sizes.width / this.webgl.sizes.height,
      100,
      2000,
    );
    this.instance.position.z = 600;
    this.instance.fov = 2 * Math.atan((this.webgl.sizes.height / 2) / 600) * (180 / Math.PI);
  }

  updateControls() {
    this.controls.update();
  }

  update() {
    this.instance.aspect = this.webgl.sizes.width / this.webgl.sizes.height;
    this.instance.updateProjectionMatrix();
  }
}
