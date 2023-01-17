export default class TextAnimation {
  constructor({
    target, wrapEl, wrapClass,
  }) {
    this.getTargetWidth(target);
    this.getWords();
    this.splitedInLines({ wrapEl, wrapClass });

    // this.onResize({ wrapEl, wrapClass });
  }

  getTargetWidth(target) {
    this.text = null;
    this.containerTextWidth = 0;

    this.text = target;
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

  onResize({ wrapEl, wrapClass }) {
    window.addEventListener('resize', () => {
      this.getWords();
      this.splitedInLines({ wrapEl, wrapClass });
    });
  }
}
