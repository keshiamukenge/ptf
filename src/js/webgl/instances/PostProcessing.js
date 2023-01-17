import * as THREE from 'three';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';

export default class PostProcessing {
  constructor(webgl) {
    this.webgl = webgl;

    this.setupPostProcessing();
  }

  setupPostProcessing() {
    this.composer = new EffectComposer(this.webgl.renderer.instance);
    this.composer.setSize(this.webgl.sizes.width, this.webgl.sizes.height);
    this.composer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.renderPass = new RenderPass(this.webgl.scene, this.webgl.camera.instance);
    this.renderPass.renderToScreen = true;
    this.composer.addPass(this.renderPass);
    this.displacementShader = {
      uniforms: {
        tDiffuse: {
          value: null,
        },
        uResolution: {
          value: new THREE.Vector2(1.0, this.webgl.sizes.height / this.webgl.sizes.width),
        },
        uMouse: {
          value: new THREE.Vector2(0, 0),
        },
        uVelo: {
          value: 0,
        },
      },
      vertexShader: `
        varying vec2 vUv;

        void main() {
          vUv = uv;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform vec2 uResolution;
        uniform float uVelo;
        uniform vec2 uMouse;

        varying vec2 vUv;

        float circle(vec2 uv, vec2 disc_center, float disc_radius, float border_size) {
          uv -= disc_center;
          uv *= uResolution;
          float dist = sqrt(dot(uv, uv));
          return smoothstep(disc_radius + border_size, disc_radius - border_size, dist);
        }

        float hash12(vec2 p) {
          float h = dot(p,vec2(127.1,311.7));
          return fract(sin(h)*43758.5453123);
        }

        void main() {
          vec2 newUV = vUv;
          vec4 color = vec4(1.,0.,0.,1.);

          // float c = circle(vUv, uMouse, 0.0, 0.4);
          // float r = texture2D(tDiffuse, newUV.xy += c * (uVelo * 1.5)).x;
          // float g = texture2D(tDiffuse, newUV.xy += c * (uVelo * 1.525)).y;
          // float b = texture2D(tDiffuse, newUV.xy += c * (uVelo * 1.55)).z;
          // vec4 color = vec4(r, g, b, 1.0);

          // float hash = hash12(vUv*10.);
          // float c = circle(newUV, uMouse, 0.0, 50.)*10.*uVelo;
          // vec2 offsetVector = normalize(uMouse - vUv);
          // vec2 warpedUV = vUv + vec2(hash - 0.5)*c; //power
          // color = texture2D(tDiffuse,warpedUV) + texture2D(tDiffuse,warpedUV)*vec4(vec3(c),1.);

          // float c = circle(newUV, uMouse, 0.0, 0.2);
          float c = circle(newUV, uMouse, 0.0, 0.2 + uVelo * 2.0) * 40.0 * uVelo;
          vec2 offsetVector = normalize(uMouse - vUv);
          vec2 warpedUV = mix(vUv, uMouse, c * 0.99); //power
          color = texture2D(tDiffuse,warpedUV) + texture2D(tDiffuse, warpedUV) * vec4(vec3(c), 1.0);

          gl_FragColor = color;
        }
      `,
    };
    this.customPass = new ShaderPass(this.displacementShader);
    this.composer.addPass(this.customPass);
  }

  resize() {
    this.composer.setSize(this.webgl.sizes.width, this.webgl.sizes.height);
    this.composer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  update() {
    this.customPass.uniforms.uMouse.value = this.webgl.mouse.coordinates;
    this.customPass.uniforms.uVelo.value = Math.min(this.webgl.mouse.targetSpeed, 0.5);
    this.webgl.mouse.targetSpeed *= 0.999;

    this.composer.render();
  }
}
