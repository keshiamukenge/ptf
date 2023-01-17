import LocomotiveScroll from 'locomotive-scroll';

export default class SmoothScroll {
  constructor() {
    this.setupSmoothScroll();
  }

  setupSmoothScroll() {
    this.instance = new LocomotiveScroll({
      el: document.querySelector('[data-scroll-container]'),
      smooth: true,
    });
  }
}
