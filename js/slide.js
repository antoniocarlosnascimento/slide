export default class Slide {
  constructor(slide, wrapper) {
    this.slide = document.querySelector(slide);
    this.wrapper = document.querySelector(wrapper);

    this.distancia = { finalPosition: 0, startX: 0, movement: 0 };
  }

  moveSlide(distanciaX) {
    this.distancia.movePosition = distanciaX;
    this.slide.style.transform = `translate3d(${distanciaX}px, 0, 0)`;
  }

  updatePosition(clientX) {
    this.distancia.movement = (this.distancia.startX - clientX) * 1.6;
    return this.distancia.finalPosition - this.distancia.movement;
  }

  onStart(event) {
    event.preventDefault();
    this.distancia.startX = event.clientX;
    this.wrapper.addEventListener("mousemove", this.onMove);
  }

  onMove(event) {
    const finalPosition = this.updatePosition(event.clientX);
    this.moveSlide(finalPosition);
  }

  onEnd() {
    this.wrapper.removeEventListener("mousemove", this.onMove);
    this.distancia.finalPosition = this.distancia.movePosition;
  }

  addSlideEvents() {
    this.wrapper.addEventListener("mousedown", this.onStart);
    this.wrapper.addEventListener("touchstart", this.onStart);
    this.wrapper.addEventListener("mouseup", this.onEnd);
    this.wrapper.addEventListener("touchend", this.onEnd);
  }

  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
  }

  // Slides config
  slidePosition(slide) {
    const margin = (this.wrapper.offsetWidth - slide.offsetWidth) / 2;

    return -(slide.offsetLeft - margin);
  }

  slidesIndexNav(index) {
    const last = this.slideArray.length - 1;
    this.index = {
      previus: index ? index - 1 : undefined,
      active: index,
      next: index === last ? undefined : index + 1,
    };
  }

  changeSlide(index) {
    const activeSlide = this.slideArray[index];
    this.moveSlide(this.slideArray[index].postion);
    this.slidesIndexNav(index);

    this.distancia.finalPosition = activeSlide.postion;
  }

  slidesConfig() {
    this.slideArray = [...this.slide.children].map((element) => {
      const postion = this.slidePosition(element);
      return { postion, element };
    });
    console.log(this.slideArray);
  }

  init() {
    this.bindEvents();
    this.addSlideEvents();
    this.slidesConfig();

    return this;
  }
}
