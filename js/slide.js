import debounce from "./debounce.js";
export default class Slide {
  constructor(slide, wrapper) {
    this.slide = document.querySelector(slide);
    this.wrapper = document.querySelector(wrapper);
    this.activeClass = "active";

    this.distancia = { finalPosition: 0, startX: 0, movement: 0 };
  }

  trasition(active) {
    this.slide.style.transition = active ? "transform .3s" : "";
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

    this.trasition(false);
  }

  onMove(event) {
    const finalPosition = this.updatePosition(event.clientX);
    this.moveSlide(finalPosition);
  }

  onEnd() {
    // const moveType = event.type === "mouseup" ? "mousemove" : "touchmove";
    this.wrapper.removeEventListener("mousemove", this.onMove);
    this.distancia.finalPosition = this.distancia.movePosition;
    this.trasition(true);
    this.changeSlideOnEnd();
  }

  changeSlideOnEnd() {
    //Mude o slide ao final
    if (this.distancia.movement > 120 && this.index.next !== undefined)
      this.activeNextSlide();
    else if (this.distancia.movement < -120 && this.index.previus !== undefined)
      this.activePrevSlide();
    else this.changeSlide(this.index.active);
    console.log(this.distancia.movement);
  }

  addSlideEvents() {
    this.wrapper.addEventListener("mousedown", this.onStart);
    this.wrapper.addEventListener("touchstart", this.onStart);
    this.wrapper.addEventListener("mouseup", this.onEnd);
    this.wrapper.addEventListener("touchend", this.onEnd);
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
    this.changeActiveClass();
  }

  changeActiveClass() {
    this.slideArray.forEach((item) =>
      item.element.classList.remove(this.activeClass)
    );
    this.slideArray[this.index.active].element.classList.add(this.activeClass);
  }

  activePrevSlide() {
    if (this.index.previus !== undefined) this.changeSlide(this.index.previus);
  }
  activeNextSlide() {
    if (this.index.next !== undefined) this.changeSlide(this.index.next);
  }

  slidesConfig() {
    this.slideArray = [...this.slide.children].map((element) => {
      const postion = this.slidePosition(element);
      return { postion, element };
    });
    console.log(this.slideArray);
  }

  onResize() {
    setTimeout(() => {
      this.slidesConfig();
      this.changeSlide(this.index.active);
    }, 1000);
  }

  addResizeEvent() {
    window.addEventListener("resize", this.onResize);
  }

  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.onResize = debounce(this.onResize.bind(this), 200);
  }

  init() {
    this.bindEvents();
    this.trasition(false);
    this.addSlideEvents();
    this.slidesConfig();
    this.addResizeEvent();
    return this;
  }
}
