import { SlideNav } from "./slide.js";

const slide = new SlideNav(".slide", ".slider-wrapper");
slide.init();
// console.log(slide);
slide.addArrow(".previus", ".next");
