/* eslint-disable no-new */
import gsap from 'gsap';

import Webgl from './js/webgl/Webgl';
import SmoothScroll from './js/SmoothScroll';
import SplitText from './js/SplitText';
import DuplicateText from './js/DuplicateText';

export default class App {
  constructor() {
    this.onWindowLoaded();
    new Webgl();
    new DuplicateText({
      parentElement: document.querySelector('.container-slide-words'),
      element: document.querySelector('.slide-item'),
      wrapElement: 'span',
    });
    this.scroll = new SmoothScroll();

    this.mainTitle = new SplitText({
      target: document.querySelector('h1'),
      wrapEl: 'span',
      wrapClass: 'main-title-line',
    });

    this.contactSectionTitle = new SplitText({
      target: document.querySelector('.contact-section-title'),
      wrapEl: 'span',
      wrapClass: 'contact-title-line',
    });

    this.contactSectionText = new SplitText({
      target: document.querySelector('.contact-section-text'),
      wrapEl: 'span',
      wrapClass: 'contact-text-line',
    });

    this.revealTextOnScroll();
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
      this.revealSplitingText({ element: this.mainTitle.text.querySelectorAll('span'), delay: 0.5 });
    };
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
  revealSplitingText({ element, delay, duration }) {
    const timeline = gsap.timeline({ delay: delay || 0 });
    const linesContent = element;

    linesContent.forEach((lineContent) => {
      timeline.to(lineContent, {
        duration: duration || 0.8,
        y: 0,
      }, '<5%');
    });
  }

  revealTextOnScroll() {
    this.scroll.instance.on('scroll', (args) => {
      if (typeof args.currentElements['slide-text'] === 'object' && this.scroll.instance.scroll.els['slide-text'].progress > 0.2) {
        this.revealSlideWords();
      }

      if (typeof args.currentElements['contact-section-title'] === 'object' && this.scroll.instance.scroll.els['contact-section-title'].progress > 0.2) {
        this.revealSplitingText({ element: this.contactSectionTitle.text.querySelectorAll('span'), duration: 0.7 });
      }

      if (typeof args.currentElements['contact-section-text'] === 'object' && this.scroll.instance.scroll.els['contact-section-text'].progress > 0.2) {
        this.revealSplitingText({ element: this.contactSectionText.text.querySelectorAll('span'), duration: 0.7 });
      }
    });
  }
}

new App();
