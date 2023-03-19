import Lenis from '@studio-freight/lenis';

export default class SmoothScroll {
  constructor() {
    this.instance = new Lenis();
    this.instance.stop();
    requestAnimationFrame(this.udpate.bind(this));
  }

  udpate(time) {
    this.instance.raf(time);
    requestAnimationFrame(this.udpate.bind(this));
  }
}
