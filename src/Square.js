const width = document.body.clientWidth * 0.6;
const height = document.body.clientHeight;

import { listData } from './data.js';

export class Square {
  constructor(character) {
    this.x =
      character % 2 === 0
      ? Math.round(Math.random() * width)
      : Math.round((Math.random() + 0.35) * width);
    this.y = Math.round(Math.random() * height);
    this.size = Math.round(Math.random() * 2 / 5 + 0.8);
  }

  draw(scale) {
    const newSquare = document.createElement('div');
    newSquare.className = 'square';
    newSquare.style.transform = `scale(${ this.size })`;
    newSquare.style.right = `${ this.x }px`;
    newSquare.style.bottom = `${ this.y }px`;
    const index = Math.round(scale / 1000 + Math.random() * 3);
    newSquare.innerText = listData[index];
    document.querySelector('.container').appendChild(newSquare);
    setTimeout(() => {
      void document.querySelector('.container').removeChild(newSquare);
    }, 2500);
  }
}