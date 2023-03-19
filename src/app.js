import gsap from 'gsap';

import Webgl from './js/webgl/Webgl';
import SmoothScroll from './js/SmoothScroll';
import Loader from './js/Loader';

export default class App {
  constructor() {
    this.scroll = new SmoothScroll();

    // Preloader
    this.loader = new Loader(() => {
      this.scroll.instance.start();
    });

    // Header
    this.starRotation = 0;
    this.projectsSectionBackground = document.querySelector('.section-project-background-container');
    this.headerSvgs = document.querySelectorAll('svg');

    this.projects = [];
    this.projectsList = document.querySelectorAll('ul.projects-section__container-list li');
    this.setupProjectsInfos();

    this.onScroll();
    this.webgl = new Webgl(this.scroll);

    // this.rotateStarIcon();
    this.onProjectImageHovered();
  }

  setupProjectsInfos() {
    for (let i = 0; i < this.projectsList.length; i++) {
      this.projects.push({
        id: i,
        el: this.projectsList[i],
        img: this.projectsList[i].querySelector('img'),
        a: this.projectsList[i].querySelector('a'),
        viewInfos: {
          container: this.projectsList[i].querySelector('#view-project-infos'),
          el: this.projectsList[i].querySelector('#view-project-infos > span'),
        },
      });
    }
  }

  onMouseLeave() {
    this.images.forEach((image) => {
      image.addEventListener('mouseleave', () => {
        gsap.to(image.parentNode.querySelector('div').querySelectorAll('span'), {
          y: `${-100}%`,
          duration: 0.6,
          delay: 0.1,
          clearProps: 'all',
        });
      });
    });
  }

  onProjectImageHovered() {
    this.projects.forEach((project) => {
      if (!project.a) return;

      project.a.addEventListener('mouseenter', () => {
        gsap.to(project.viewInfos.el, {
          duration: 0.5,
          y: 0,
          ease: 'power1.out',
        });
      });

      project.a.addEventListener('mouseleave', () => {
        gsap.to(project.viewInfos.el, {
          duration: 0.5,
          y: `${100}%`,
          ease: 'power1.in',
        });
      });
    });
  }

  setHeaderColor() {
    this.headerSvgs.forEach((svg) => {
      const svgGroupPaths = svg.querySelector('g');
      const svgPaths = svg.querySelectorAll('path');

      if (this.projectsSectionBackground.getBoundingClientRect().top < 20) {
        if (svgGroupPaths) {
          gsap.to(svgGroupPaths, {
            duration: 0.3,
            fill: '#e2d5c8',
          });
        }

        if (svgPaths) {
          gsap.to(svgPaths, {
            duration: 0.3,
            stroke: '#e2d5c8',
          });
        }

        gsap.to(svg, {
          duration: 0.3,
          fill: '#e2d5c8',
        });
      } else {
        if (svgGroupPaths) {
          gsap.to(svgGroupPaths, {
            duration: 0.3,
            fill: '#0b090a',
          });
        }

        if (svgPaths) {
          gsap.to(svgPaths, {
            duration: 0.3,
            stroke: '#0b090a',
          });
        }

        gsap.to(svg, {
          duration: 0.3,
          fill: '#0b090a',
        });
      }
    });
  }

  onScroll() {
    this.scroll.instance.on('scroll', () => {
      this.setHeaderColor();
    });
  }

  // rotateStarIcon(speed, direction) {
  //   if (direction === 'down') {
  //     if (Math.round(this.starRotation) === 360) {
  //       this.starRotation = 0;
  //       this.starRotation += 1;
  //     }

  //     this.starRotation += 1;
  //   } else if (direction === 'up') {
  //     if (Math.round(this.starRotation) === 360) {
  //       this.starRotation = 0;
  //       this.starRotation -= 1;
  //     }

  //     this.starRotation -= 1;
  //   }
  // }
}

new App();
