/* eslint-disable no-new */
import gsap from 'gsap';

import Webgl from './js/webgl/Webgl';
import SmoothScroll from './js/SmoothScroll';
import SplitText from './js/SplitText';

const scroll = new SmoothScroll();

export default class App {
  constructor() {
    this.scroll = scroll;

    this.projects = [];
    this.projectsList = document.querySelectorAll('ul.projects-section__container-list li');
    this.setupProjectsInfos();

    this.onWindowLoaded();
    this.webgl = new Webgl(this.scroll);

    this.revealTextOnScroll();
  }

  setupProjectsInfos() {
    for (let i = 0; i < this.projectsList.length; i++) {
      this.projects.push({
        id: i,
        el: this.projectsList[i],
      });
    }
  }

  setCursorPosition() {
    this.cursor = document.querySelector('.cursor');
    this.isVisible = false;

    window.addEventListener('mousemove', (event) => {
      if (!this.isVisible) {
        this.cursor.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
        this.cursor.style.visibility = 'visible';
        this.isVisible = true;
      }

      gsap.to(this.cursor, {
        x: event.clientX - 15,
        y: event.clientY - 15,
      });
    });
  }

  onWindowLoaded() {
    window.onload = () => {
      this.setCursorPosition();
      this.scroll.instance.update();
    };
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

  // TEXT ANIMATIONS
  revealSlideWords() {
    this.element = document.querySelector('.container-slide-words');

    gsap.to(this.element, {
      duration: 0.8,
      y: 0,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  revealSplitingText({
    element, delay, duration, stagger,
  }) {
    const linesContent = element;

    gsap.to(linesContent, {
      delay: delay || 0,
      duration: duration || 0.8,
      y: 0,
      stagger,
    });
  }

  revealTextOnScroll() {
    this.scroll.instance.on('scroll', (args) => {
      if (typeof args.currentElements['slide-text'] === 'object' || this.scroll.instance.scroll.els['slide-text']?.progress > 0.2) {
        this.revealSlideWords();
      }
    });
  }
}

new App();
