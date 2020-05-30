import {
  lineData,
  color,
  doctor,
  worker,
  ordinary,
  volunteer,
  backgroundImage
} from './data.js';

import { Square } from './Square.js';

const img = {
  doctor,
  worker,
  ordinary,
  volunteer
};

// 标准化系数，规定到0-100之间
const NORMALIZED = 0.0074;
// 76个点，间隔
const padding = 5.26;
const MIN = 0;
const MAX = 3000;

const line = document.querySelector('.line');
const svg = document.querySelector('#svg');
const circle = document.querySelector('#circle');
const path = document.querySelector('#path');
const container = document.querySelector('.container');
const model = document.querySelector('.model');
const modelImg = document.querySelector('.model img');
const nextButton = document.querySelector('#nextButton');
const prevButton = document.querySelector('#prevButton');
const imageContainer = document.querySelector('.image-opa');

const characters = ['doctor', 'worker', 'volunteer', 'ordinary'];
let character = 0;
let scale = 0;

function drawLine() {
  const pathData = [];
  for (let i = 0; i < lineData.length; i++) {
    pathData.push(`${ padding * i },${ lineData[i] * NORMALIZED }`);
  }
  path.setAttribute('d', `M${ pathData.join(' ') }`);
  const lineLength = Math.ceil(path.getTotalLength()).toString();
  svg.style.setProperty('--stroke-length', lineLength);
  svg.classList.add('animate');
}

window.addEventListener('load', () => {
  prevButton.style.display = 'none';
  modelImg.setAttribute('src', img[characters[character]][0]);
  imageContainer.setAttribute('src', backgroundImage[characters[character]]);
  drawLine();
  container.addEventListener('wheel', onWheel);
  nextButton.addEventListener('click', handleNext);
  prevButton.addEventListener('click', handlePrev);
});

function changeColor() {
  const nextColor = ~~(scale * 2 / 3000);
  container.style.backgroundColor = color[characters[character]][nextColor];
}

function changeImg() {
  const nextImg = ~~(scale * 11 / 3000);
  modelImg.setAttribute('src', img[characters[character]][nextImg]);
}

function onWheel(e) {
  if (scale + e.deltaY > MAX) {
    scale = MAX;
  } else if (scale + e.deltaY < MIN) {
    scale = MIN;
  } else {
    scale += e.deltaY;
  }
  const cx = (scale / (MAX - MIN) * 400).toString();
  const cy = (lineData[~~((scale / (MAX - MIN)) * 76)] * NORMALIZED + 1).toString();
  circle.setAttribute('x', cx);
  circle.setAttribute('y', cy);
  changeColor();
  changeImg();
  const temp = new Square(character);
  temp.draw(scale);
}

function handleNext() {
  prevButton.style.display = 'block';
  character++;
  scale = 0;
  changeColor();
  backgroundImageFade();
  if (character === 3) {
    nextButton.style.display = 'none';
  }
  fadeAnimation();
}

function handlePrev() {
  nextButton.style.display = 'block';
  character--;
  scale = 0;
  changeColor();
  backgroundImageFade();
  if (character === 0) {
    prevButton.style.display = 'none';
  }
  fadeAnimation();
}

function fadeAnimation() {
  model.style.opacity = '0';
  character % 2 === 0 ? line.style.right = '30px' : line.style.right = '33vw';
  setTimeout(() => {
    changeImg();
    if (character % 2 === 0) {
      model.style.left = '0';
      model.style.right = 'auto';
    } else {
      model.style.left = 'auto';
      model.style.right = '0';
    }
    model.style.opacity = '1';
  }, 1800);
}

function backgroundImageFade() {
  imageContainer.style.opacity = '0';
  setTimeout(() => {
    imageContainer.setAttribute('src', backgroundImage[characters[character]]);
    imageContainer.style.opacity = '0.2';
  }, 1100);
}