import * as THREE from 'three';
import gsap from 'gsap';

import { vertexShader } from './shaders/vertexShader';
import { fragmentShader } from './shaders/fragmentShader';

export default class Plane {
  constructor(webgl, { imgElement }) {
    this.webgl = webgl;

    this.imageElement = imgElement;
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
    this.texture.minFilter = THREE.LinearFilter;
    this.texture.magFilter = THREE.LinearFilter;
    this.texture.wrapS = THREE.RepeatWrapping;
    this.texture.wrapT = THREE.RepeatWrapping;

    this.materialTemplate = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        tMap: {
          value: this.texture,
        },
        uViewportSizes: {
          value: new THREE.Vector2(this.webgl.sizes.width, this.webgl.sizes.height),
        },
        uOffset: {
          value: new THREE.Vector2(0.0, 0.0),
        },
        uHover: {
          value: new THREE.Vector2(0.5, 0.5),
        },
        uHoverState: {
          value: 1.0,
        },
        uPlaneSizes: {
          value: new THREE.Vector2(0, 0),
        },
        uImageSizes: {
          value: new THREE.Vector2(0, 0),
        },
        uAlpha: {
          value: 0.0,
        },
      },
      vertexShader,
      fragmentShader,
    });

    this.current = 0;
    this.target = 0;
    this.ease = 0.05;
    this.setupPlane();

    this.lerp = (start, end, t) => start * (1 - t) + end * t;

    this.webgl.scroll.instance.on('scroll', ({ progress }) => {
      this.planeAppear();
      this.target = progress * 1.3;
      this.current = this.lerp(this.current, this.target, this.ease);
      this.instance.material.uniforms.uOffset.value.set(
        this.instance.position.x * 0.0,
        -(this.target - this.current),
      );
    });
  }

  setupPlane() {
    this.geometry = new THREE.PlaneGeometry(1, 1, 100, 100);
    this.material = this.materialTemplate.clone();
    this.material.uniforms = THREE.UniformsUtils.clone(this.materialTemplate.uniforms);
    this.material.vertexShader = this.materialTemplate.vertexShader;
    this.material.fragmentShader = this.materialTemplate.fragmentShader;
    this.instance = new THREE.Mesh(this.geometry, this.material);
    this.instance.scale.set(this.image.width, this.image.height, 0.5);
    this.instance.position.set(
      this.image.left + this.image.width / 2 - this.webgl.sizes.width / 2,
      this.webgl.sizes.height / 2 - this.image.top - this.image.height / 2,
      0.5,
    );
  }

  planeAppear() {
    gsap.to(this.instance.material.uniforms.uAlpha, {
      scrollTrigger: {
        trigger: this.image.element,
        start: 'top 80%',
      },
      duration: 0.5,
      value: 1.0,
    });
  }

  updateImageSize() {
    this.image.width = this.imageElement.getBoundingClientRect().width;
    this.image.height = this.imageElement.getBoundingClientRect().height;
    this.image.aspect = this.imageElement.offsetWidth / this.imageElement.offsetHeight;
    this.instance.material.uniforms.uImageSizes.value.x = this.image.element.naturalWidth;
    this.instance.material.uniforms.uImageSizes.value.y = this.image.element.naturalHeight;
  }

  updateImagePosition() {
    this.image.top = this.imageElement.getBoundingClientRect().top;
    this.image.left = this.imageElement.getBoundingClientRect().left;
  }

  updatePlaneSize() {
    this.instance.scale.set(this.image.width, this.image.height, 0.5);
    this.instance.material.uniforms.uPlaneSizes.value.x = this.instance.scale.x;
    this.instance.material.uniforms.uPlaneSizes.value.y = this.instance.scale.y;
  }

  updatePlanePosition() {
    this.instance.position.set(
      this.image.left + this.image.width / 2 - this.webgl.sizes.width / 2,
      this.webgl.sizes.height / 2 - this.image.top - this.image.height / 2,
      0.5,
    );
  }
}
