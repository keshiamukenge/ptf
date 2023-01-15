/* eslint-disable no-new */
import gsap from 'gsap';

import Webgl from './js/webgl/Webgl';
import SmoothScroll from './js/SmoothScroll';

export default class App {
  constructor() {
    new Webgl();
    new SmoothScroll();

    this.setScrollTextDirection();
    this.onLoaded();

    this.getParagraphWidth();
    this.getWords();
    this.splitedInLines({ wrapEl: 'span', wrapClass: 'line' });
    this.revealText();
  }

  setScrollTextDirection() {
    this.scrollText = document.querySelector('.work-section__title');

    window.addEventListener('wheel', (event) => {
      if (event.deltaY < 0) {
        this.scrollText.dataset.scrollSpeed = 5;
        this.scrollText.classList.remove('scroll-left');
        this.scrollText.classList.add('scroll-right');
      } else {
        this.scrollText.dataset.scrollSpeed = -5;
        this.scrollText.classList.add('scroll-left');
        this.scrollText.classList.remove('scroll-right');
      }
    });
  }

  addCursor() {
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

  onLoaded() {
    window.onload = this.addCursor();
  }

  // TEXT ANIMATION
  getParagraphWidth() {
    this.text = null;
    this.containerTextWidth = 0;

    this.text = document.querySelector('h1');
    this.containerTextWidth = this.text.getBoundingClientRect().width;
  }

  getWords() {
    this.words = [];

    this.words = this.text.innerText.split(/( )/g);
    this.text.innerHTML = this.words
      .map((word) => `<span>${word}</span>`)
      .join('');
  }

  splitedInLines({ wrapEl, wrapClass }) {
    this.lines = [];
    this.line = [];
    this.lineWidth = 0;
    this.lineHeight = 101;

    this.spans = this.text.querySelectorAll('span');
    this.spans.forEach((span) => {
      const spanWidth = span.getBoundingClientRect().width;
      if (this.lineWidth + spanWidth <= this.containerTextWidth) {
        this.line.push(span);
        this.lineWidth += spanWidth;
      } else {
        this.lines = [...this.lines, this.line];
        this.line = [];
        this.lineWidth = 0;
        this.line.push(span);
        this.lineWidth += spanWidth;
      }
    });
    if (this.line.length) this.lines = [...this.lines, this.line];
    const newLines = this.lines
      .map(
        (line, id) => `
          <div class="container-line${id}">
            <${wrapEl} class=${wrapClass + id}>
              ${line.map((span) => span.innerText).join('')}
            </${wrapEl}>
          </div>
        `,
      )
      .join('');
    this.text.innerHTML = newLines;
  }

  revealText() {
    const timeline = gsap.timeline({ delay: 0.5 });
    const linesContent = document.querySelectorAll('h1 div span');

    linesContent.forEach((lineContent) => {
      timeline.to(lineContent, {
        duration: 0.8,
        y: 0,
        ease: 'power3.out',
      }, '<5%');
    });
  }
}

new App();
