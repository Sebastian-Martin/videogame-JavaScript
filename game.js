const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDowm = document.querySelector('#down');
const btnRestart = document.querySelector('#restart');
const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#time');
const spanRecord = document.querySelector('#record');
const pResult = document.querySelector('#result');

let canvasSize;
let elementsSize;
let level = 0;
let lives = 3;

let timeStart;
let timePlayer;
let timeInterval;

const playerPosition = {
  x: undefined,
  y: undefined
};
const giftPosition = {
  x: undefined,
  y: undefined
};
let enemyPosition = [];

window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);

function setCanvasSize() {
  if (window.innerHeight > window.innerWidth) {
    canvasSize = window.innerWidth * 0.7;
  } else {
    canvasSize = window.innerHeight * 0.7;
  }

  canvasSize = Number(canvasSize.toFixed(0));

  canvas.setAttribute('width', canvasSize);
  canvas.setAttribute('height', canvasSize);

  elementsSize = canvasSize / 10;

  playerPosition.x = undefined;
  playerPosition.y = undefined;
  startGame();
}

function startGame() {
  console.log({canvasSize, elementsSize});

  game.font = elementsSize + 'px Verdana';
  game.textAlign = 'end';

  const map = maps[level];

  if(!map) {
    gameWin();
    return;
  }

  if(!timeStart) {
    timeStart = Date.now();
    timeInterval = setInterval(showTime, 100);
    showRecord();
  }

  const mapRows = map.trim().split('\n');
  const mapRowCols = mapRows.map(row => row.trim().split(''));
  console.log({map, mapRows, mapRowCols});

  showLives();

  enemyPosition = [];
  game.clearRect(0,0, canvasSize, canvasSize);

  mapRowCols.forEach((row, rowI) => {
    row.forEach((col, colI) => {
      const emoji = emojis[col];
      const posX = (elementsSize * (colI + 1)) + 5;
      const posY = (elementsSize * (rowI + 1)) - 5;

      if(col == 'O') {
        if(!playerPosition.x && !playerPosition.y) {
          playerPosition.x = posX;
          playerPosition.y = posY;
          // console.log({playerPosition});
        }
      } else if(col == 'I') {
        giftPosition.x = posX;
        giftPosition.y = posY;
      } else if(col == 'X') {
        enemyPosition.push({
          x: posX,
          y: posY
        })
      }

      game.fillText(emoji, posX, posY);
    });
  });

  movePlayer();
}

function movePlayer() {
  const giftCollisionX = playerPosition.x.toFixed(2) == giftPosition.x.toFixed(2);
  const giftCollisionY = playerPosition.y.toFixed(2) == giftPosition.y.toFixed(2);
  const giftCollision = giftCollisionX && giftCollisionY;

  if(giftCollision) {
    levelWin();
  }

  const enemyCollision = enemyPosition.find(enemy => {
    const enemyCollisionX = enemy.x.toFixed(2) == playerPosition.x.toFixed(2);
    const enemyCollisionY = enemy.y.toFixed(2) == playerPosition.y.toFixed(2);
    return enemyCollisionX && enemyCollisionY;
  });

  if(enemyCollision) {
    levelFail();
  }

  game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
}

function levelWin() {
  console.log('Subiste de nivel');
  level++;
  startGame();
}

function levelFail() {
  console.log('Chocaste con una bomba');
  lives--;

  if(lives <= 0){
    level = 0;
    lives = 3;
    timeStart = undefined;
  }

  playerPosition.x = undefined;
  playerPosition.y = undefined;
  startGame();
}

function gameWin() {
  console.log('Terminaste el juego');
  clearInterval(timeInterval);

  const recordTime = localStorage.getItem('record_time');
  // const playerTime = Date.now() - timeStart;

  if(recordTime) {
    if(recordTime >= timePlayer) {
      localStorage.setItem('record_time', timePlayer);
      pResult.innerHTML = 'Felicidades. Superaste el record!';
    } else {
      pResult.innerHTML = 'No superaste el record :(';
    }
  } else {
    localStorage.setItem('record_time', timePlayer);
    pResult.innerHTML = 'Primera vez? Muy bien, intenta superar tu record :)';
  }
  console.log({recordTime, timePlayer});
}

function showLives() {
  // spanLives.innerHTML = emojis["HEART"].repeat(lives);
  const heartsArray = Array(lives).fill(emojis['HEART']);
  
  spanLives.innerHTML = "";
  heartsArray.forEach(heart => spanLives.append(heart));
}

function showTime() {
  timePlayer = Date.now() - timeStart;
  spanTime.innerHTML = timePlayer;
}

function showRecord() {
  spanRecord.innerHTML = localStorage.getItem('record_time');
}

window.addEventListener('keydown', moveByKeys);
btnUp.addEventListener('click', moveUp);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);
btnDowm.addEventListener('click', moveDown);
btnRestart.addEventListener('click', restartGame);

function moveByKeys(event) {
  if(event.key == 'ArrowUp') moveUp();
  else if(event.key == 'ArrowLeft') moveLeft();
  else if(event.key == 'ArrowRight') moveRight();
  else if(event.key == 'ArrowDown') moveDown();
}
function moveUp() {
  console.log('Arriba');
  if((playerPosition.y - elementsSize) < 0) {
    console.log('OUT');
  }else {
    playerPosition.y -= elementsSize;
    startGame();
  }
}
function moveLeft() {
  console.log('Izquierda');
  if((playerPosition.x - elementsSize) < elementsSize) {
    console.log('OUT');
  }else {
    playerPosition.x -= elementsSize;
    startGame();
  }
}
function moveRight() {
  console.log('Derecha');
  if((playerPosition.x + elementsSize) > (canvasSize + 5)) {
    console.log('OUT');
  }else {
    playerPosition.x += elementsSize;
    startGame();
  }
}
function moveDown() {
  console.log('Abajo');
  if((playerPosition.y + elementsSize) > canvasSize) {
    console.log('OUT');
  }else {
    playerPosition.y += elementsSize;
    startGame();
  }
}
function restartGame() {
  location.reload();
}