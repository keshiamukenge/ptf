import * as THREE from 'three';

export default class MouseTracking {
  constructor(webgl) {
    this.webgl = webgl;

    this.targetSpeed = 0;
    this.coordinates = new THREE.Vector2(0, 0);
    this.followMouse = new THREE.Vector2(0, 0);
    this.prevMouse = new THREE.Vector2(0, 0);

    this.raycaster = new THREE.Raycaster();
  }

  onMouseMove(event) {
    this.coordinates.x = event.clientX / this.webgl.sizes.width;
    this.coordinates.y = 1.0 - event.clientY / this.webgl.sizes.height;
  }

  getVelocity() {
    this.speed = Math.sqrt(
      (this.prevMouse.x - this.coordinates.x) ** 2 + (this.prevMouse.y - this.coordinates.y) ** 2,
    );

    this.targetSpeed -= 0.1 * (this.targetSpeed - this.speed);
    this.followMouse.x -= 0.1 * (this.followMouse.x - this.coordinates.x);
    this.followMouse.y -= 0.1 * (this.followMouse.y - this.coordinates.y);

    this.prevMouse.x = this.coordinates.x;
    this.prevMouse.y = this.coordinates.y;
  }

  update() {
    this.raycaster.setFromCamera(this.coordinates, this.webgl.camera.instance);
    this.intersects = this.raycaster.intersectObjects(this.webgl.scene.children);
  }
}
