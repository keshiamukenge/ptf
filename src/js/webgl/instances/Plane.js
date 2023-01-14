import * as THREE from 'three';

export default class Plane {
  constructor(webgl) {
    this.webgl = webgl;

    this.imageElement = document.querySelector('.profil-img');
    this.image = {
      element: this.imageElement,
      src: this.imageElement.src,
      width: this.imageElement.getBoundingClientRect().width,
      height: this.imageElement.getBoundingClientRect().height,
      aspect: this.imageElement.offsetWidth / this.imageElement.offsetHeight,
      top: this.imageElement.getBoundingClientRect().top,
      left: this.imageElement.getBoundingClientRect().left,
    };

    this.texture = new THREE.TextureLoader().load(this.image.src);
    // this.texture.needsUpdate = true;

    this.setupPlane();
  }

  setupPlane() {
    this.geometry = new THREE.PlaneGeometry(1, 1);
    this.material = new THREE.MeshBasicMaterial({ map: this.texture, side: THREE.DoubleSide });
    this.instance = new THREE.Mesh(this.geometry, this.material);
    this.instance.scale.set(this.image.width, this.image.height, 1);
  }

  updateImageSize() {
    this.image.width = this.imageElement.getBoundingClientRect().width;
    this.image.height = this.imageElement.getBoundingClientRect().height;
    this.image.aspect = this.imageElement.offsetWidth / this.imageElement.offsetHeight;
  }

  updateImagePosition() {
    this.image.top = -this.imageElement.getBoundingClientRect().top;
    this.image.left = this.imageElement.getBoundingClientRect().left;
  }

  updatePlaneSize() {
    this.instance.scale.set(this.image.width, this.image.height, 1);
  }

  updatePlanePosition() {
    this.instance.position.set(
      this.image.left - this.webgl.sizes.width / 2 + this.image.width / 2,
      this.image.top + this.webgl.sizes.height / 2 - this.image.height / 2,
      1,
    );
  }
}
