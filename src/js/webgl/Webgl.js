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

    this.addPlanes();
  }

  addPlanes() {
    this.projectsImages = document.querySelectorAll('ul.projects-list li img');
    this.projectImagesPlanes = [];

    this.profilPicturePlane = new Plane(this, { imgElement: document.querySelector('.profil-img') });
    this.scene.add(this.profilPicturePlane.instance);

    this.projectsImages.forEach((projectImage) => {
      const plane = new Plane(this, { imgElement: projectImage });
      this.projectImagesPlanes = [
        ...this.projectImagesPlanes,
        plane,
      ];

      this.scene.add(plane.instance);
    });
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

  updatePlanes() {
    this.profilPicturePlane.updateImageSize();
    this.profilPicturePlane.updateImagePosition();
    this.profilPicturePlane.updatePlaneSize();
    this.profilPicturePlane.updatePlanePosition();

    this.projectImagesPlanes.forEach((projectImagePlane) => {
      projectImagePlane.updateImageSize();
      projectImagePlane.updateImagePosition();
      projectImagePlane.updatePlaneSize();
      projectImagePlane.updatePlanePosition();
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    this.updatePlanes();

    this.mouse.getVelocity();

    // this.camera.updateControls();

    // this.renderer.instance.render(this.scene, this.camera.instance);
    this.postProcessing.update();
  }
}
