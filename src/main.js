import { lineData, color, doctor, worker, ordinary, volunteer, backgroundImage } from './data.js';

import { Square } from './Square.js';

import { throttle } from './utils.js';

const img = {
  doctor,
  worker,
  ordinary,
  volunteer,
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

const FLAG_DECREASE = 0;
const FLAG_ADD = 1;

function autoPlay(flag) {
  requestAnimationFrame(() => onAnimationFrame(flag));
}

function onAnimationFrame(flag) {
  if (flag === FLAG_ADD) {
    scale += 1;
  } else {
    scale -= 1;
  }
  console.log(scale);
  if (scale >= MAX) {
    scale = MAX;
    flag = FLAG_DECREASE;
  } else if (scale <= MIN) {
    scale = MIN;
    flag = FLAG_ADD;
  }
  handleImage();
  handlePointer();
  autoPlay(flag);
}

function drawLine() {
  const pathData = [];
  for (let i = 0; i < lineData.length; i++) {
    pathData.push(`${padding * i},${lineData[i] * NORMALIZED}`);
  }
  path.setAttribute('d', `M${pathData.join(' ')}`);
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
  autoPlay(FLAG_ADD);
});

function changeColor() {
  const nextColor = ~~((scale * 2) / 3000);
  container.style.backgroundColor = color[characters[character]][nextColor];
}

function changeImg() {
  const nextImg = ~~((scale * 11) / 3000);
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
  handlePointer();
  handleImage();
}

function handlePointer() {
  const cx = ((scale / (MAX - MIN)) * 400).toString();
  const cy = (lineData[~~((scale / (MAX - MIN)) * 76)] * NORMALIZED + 1).toString();
  circle.setAttribute('x', cx);
  circle.setAttribute('y', cy);
}

const handleImage = throttle(() => {
  changeColor();
  changeImg();
  const temp = new Square(character);
  temp.draw(scale);
  model.style.transform = `scale(${scaleImageSize(scale).toFixed(2)})`;
}, 200);

function scaleImageSize(scale) {
  const oldMin = 0;
  const oldMax = 3000;
  const newMin = 1;
  const newMax = 1.3;

  const newValue = ((scale - oldMin) / (oldMax - oldMin)) * (newMax - newMin) + newMin;
  return newValue;
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
  character % 2 === 0 ? (line.style.right = '30px') : (line.style.right = '33vw');
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
