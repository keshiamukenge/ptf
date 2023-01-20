export default class DuplicateText {
  constructor({ parentElement, element, wrapElement }) {
    this.parentElement = parentElement;
    this.element = element;
    this.textContent = this.element.innerText;

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 10; i++) {
      const duplicateElement = document.createElement(wrapElement);
      duplicateElement.innerText = this.textContent;
      duplicateElement.classList.add('slide-item');
      this.parentElement.appendChild(duplicateElement);
    }
  }
}
