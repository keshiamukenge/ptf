import gsap, { Expo } from 'gsap';

export default class Loader {
  constructor(onLoaderFinished) {
    this.onLoaderFinished = onLoaderFinished;

    this.assetsLoaded = 0;
    this.images = [...document.querySelectorAll('img')];
    this.assetsToLoad = [];
    this.loaderProgress = document.querySelector('#loader-progress > span');
    this.getAssetsToLoad();
    this.setupPreloader();
  }

  setupPreloader() {
    gsap.to(this.loaderProgress, {
      y: 0,
      duration: 0.6,
      delay: 0.2,
      onComplete: () => {
        this.startPreloader();
      },
    });
  }

  getAssetsToLoad() {
    this.images.forEach((image) => {
      this.assetsToLoad = [
        ...this.assetsToLoad,
        {
          type: 'image',
          src: image.src,
        },
      ];
    });
  }

  startPreloader() {
    this.assetsToLoad.forEach((assets) => {
      if (assets.type === 'image') {
        const image = new Image();
        image.src = assets.src;
        image.onload = () => {
          this.assetsLoaded += 1;
          this.loaderProgress.innerText = `${Math.round((this.assetsLoaded / this.assetsToLoad.length) * 100)}%`;

          if (this.assetsLoaded === this.assetsToLoad.length) {
            this.runLoaderAnimation();
          }
        };
      }
    });
  }

  runLoaderAnimation() {
    const timeline = gsap.timeline();

    timeline.to('#loader-progress > span', {
      y: `${-100}%`,
      duration: 0.8,
    });

    timeline.to('#loader-white', {
      y: `${-100}%`,
      duration: 2,
      ease: Expo.easeInOut,
    }, '<30%');

    timeline.to('#loader-black', {
      y: `${-100}%`,
      duration: 1.8,
      ease: Expo.easeInOut,
      onComplete: () => {
        this.onLoaderFinished();
      },
    }, '<17%');
  }
}
