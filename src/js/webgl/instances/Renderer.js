import * as THREE from 'three';

export default class Renderer {
  constructor(webgl) {
    this.webgl = webgl;

    this.setupRenderer();
  }

  setupRenderer() {
    this.instance = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    this.instance.setSize(this.webgl.sizes.width, this.webgl.sizes.height);
  }

  rendererSize() {
    this.instance.setSize(this.webgl.sizes.width, this.webgl.sizes.height);
    this.instance.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
}
