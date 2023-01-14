import * as THREE from 'three';

import {
  Plane,
  Camera,
  Renderer,
  PostProcessing,
  MouseTracking,
} from './instances';

export default class Webgl {
  constructor() {
    window.webgl = this;

    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
      aspect: window.innerWidth / window.innerHeight,
    };

    this.initWebgl();

    this.onResizeWindow();
    this.onMouseMove();
    this.animate();
  }

  initWebgl() {
    this.scene = new THREE.Scene();

    this.camera = new Camera(this, { orbitControls: false });

    this.renderer = new Renderer(this);
    this.mouse = new MouseTracking(this);

    document.body.appendChild(this.renderer.instance.domElement);

    this.postProcessing = new PostProcessing(this);

    this.plane = new Plane(this);
    this.scene.add(this.plane.instance);
  }

  onResizeWindow() {
    window.addEventListener('resize', () => {
      this.sizes.width = window.innerWidth;
      this.sizes.height = window.innerHeight;

      this.camera.update();
      this.postProcessing.resize();

      this.renderer.rendererSize();
    });
  }

  onMouseMove() {
    window.addEventListener('mousemove', (event) => {
      this.mouse.onMouseMove(event);
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    this.plane.updateImageSize();
    this.plane.updateImagePosition();
    this.plane.updatePlaneSize();
    this.plane.updatePlanePosition();

    this.mouse.getVelocity();

    // this.camera.updateControls();

    // this.renderer.instance.render(this.scene, this.camera.instance);
    this.postProcessing.update();
  }
}