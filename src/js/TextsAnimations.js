import SplitInLines from 'lines-split';
import gsap, { Expo } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default class TextsAnimations {
  constructor() {
    gsap.registerPlugin(ScrollTrigger);

    this.addStyle();
    this.upProjectText();
    this.upProjectInfos();
  }

  async addStyle() {
    try {
      await new SplitInLines('#hero p');

      this.heroTextLines = document.querySelectorAll('#hero p > span > span');
      this.heroTextLines.forEach((line) => {
        line.style.transform = 'translateY(100%)';
      });
    } catch (error) {
      console.log(error);
    }
  }

  upProjectText() {
    this.projectsTitles = document.querySelectorAll('#container-section-project .container-title');
    this.projectsTitles.forEach((title) => {
      title.style.transform = 'translateY(35%)';
      title.style.opacity = 0;

      gsap.to(title, {
        scrollTrigger: {
          trigger: title,
          start: 'top 80%',
        },
        duration: 1.8,
        ease: Expo.easeOut,
        opacity: 1,
        y: 0,
      });
    });
  }

  upProjectInfos() {
    this.projectInfos = document.querySelectorAll('#container-section-project .projects-section__item-infos');
    this.projectInfos.forEach((projectInfo, id) => {
      projectInfo.style.transform = 'translateY(20%)';
      projectInfo.style.opacity = 0;

      gsap.to(projectInfo, {
        scrollTrigger: {
          trigger: this.projectsTitles[id],
          start: 'top 80%',
        },
        duration: 1.8,
        ease: Expo.easeOut,
        opacity: 1,
        y: 0,
      });
    });
  }
}
