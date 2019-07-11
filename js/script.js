/**
 * CONSTANT VARIABLES
 */
const CANVAS_WIDTH = 450,
  CANVAS_HEIGHT = window.innerHeight,
  CAR_HEIGHT = 75,
  CAR_WIDTH = 75,
  OFFSET = 10,
  FIRST_LANE = 0,
  SECOND_LANE = 1,
  THIRD_LANE = 2,
  LEVEL_UP_SPEED = 0.25,
  LANE_WIDTH = CANVAS_WIDTH / 3;

let carSpeed = 2;

/**
 * RESET BODY MARGIN AND PADDING
 */
document.body.style.margin = `0px`;
document.body.style.padding = `0px`;

/**
 * ELEMENTS OF GAME
 */
const gameOverOverlay = document.querySelector('.game-over');
const restartBtn = document.querySelector('.game-over .restart-btn');
const gameStartOverlay = document.querySelector('.game-start');
const startBtn = document.querySelector('.game-start .start-btn');

gameStartOverlay.style.display = 'block';

const canvas = document.createElement('canvas');

/**
 * CANVAS Initiliaze
 */
let canvasInit = () => {
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  canvas.style.backgroundColor = 'black';
  canvas.style.display = 'block';
  canvas.style.border = '1px solid black'
  canvas.style.margin = '0 auto';
  document.body.appendChild(canvas);
}

let ctx = canvas.getContext('2d');

/**
 * CANVAS SETUP FOR SCORE
 */
let scoreCanvas = () => {
  ctx.font = '18px Montserrat';
  ctx.fillStyle = 'white';
  ctx.textAlign = "center";
  ctx.fillText(`Score : ${inGameScore}`, 50, 30);
}

/**
 * CANVAS SETUP FOR HIGHSCORE
 */
let highScoreCanvas = () => {
  ctx.font = '14px Montserrat';
  ctx.fillStyle = '#fde52c';
  ctx.fillText(`High Score : ${localStorage.getItem('highScore') || 0}`, CANVAS_WIDTH - 70, 30);
}

/**
 * [generates Random Number]
 * @param  {Number} min minimum Number
 * @param  {Number} max Maximum Number
 * @return {Number}     Random Number
 */
let generateRandomNumber = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}


/**
 * CAR CHANGES LANE ON KEYDOWN
 */
document.addEventListener('keydown', (e) => {
  if (e.keyCode == 65 || e.keyCode == 37) {
    if (playerCar.lane > 0) {
      playerCar.lane -= 1;
      playerCar.update();
      updateAll();
    }
  }

  if (e.keyCode == 68 || e.keyCode == 39) {
    if (playerCar.lane < 2) {
      playerCar.lane += 1;
      playerCar.update();
      updateAll()
    }
  }
})

/**
 * CLEAR CANVAS AND REDRAW
 */
let updateAll = () => {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  playerCar.draw();
  enemyCarList.forEach((enemyCar, index) => {
    enemyCar.draw();
  })
  firstLane.draw();
  secondLane.draw();
  scoreCanvas();
  highScoreCanvas();
}

/**
 * DETECTS COLLISION BETWEEN PLAYER CAR AND ENEMY CAR
 * @param  {Object} enemyCarInstance Instance of each enemy car
 */
let collisionDetection = (enemyCarInstance) => {
  if (playerCar.x < enemyCarInstance.x + CAR_WIDTH &&
    playerCar.x + CAR_WIDTH > enemyCarInstance.x &&
    playerCar.y < enemyCarInstance.y + CAR_HEIGHT &&
    playerCar.y + CAR_HEIGHT > enemyCarInstance.y) {
    stopGame();
    gameOverOverlay.style.display = 'block';
  }
}

/**
 * UPDATES SCORE
 * @param  {Object} enemyInstance Instance of each enemy car
 */
let updateScore = (enemyInstance) => {
  if (enemyInstance.y > CANVAS_HEIGHT) {
    inGameScore++;
    enemyCarList.splice(enemyCarList.indexOf(enemyInstance), 1);
  }
}

let carGeneration, //Variable Decleration for setInterval.
  carAnimation;

/**
 * STARTS GENERATING ENEMY CARS AND ANIMATES THEM
 */
let startGame = () => {
  carGeneration = setInterval(() => {
    enemy.speed = carSpeed;
    let enemyCar = new Car(enemy);
    enemyCar.lane = generateRandomNumber(0, 3);
    enemyCarList.push(enemyCar);

    if (carSpeed < 10) {
      carSpeed += LEVEL_UP_SPEED;
    }

  }, 2000);

  carAnimation = setInterval(() => {
    enemyCarList.forEach((eachEnemy, index) => {
      eachEnemy.draw();
      eachEnemy.update();
      collisionDetection(eachEnemy);
      updateScore(eachEnemy);
    })
    firstLane.update();
    updateAll();
  }, 1000 / 60);
}

/**
 * STOPS THE GAME [GAME-OVER!]
 */
let stopGame = () => {
  if (localStorage.getItem('highScore') < inGameScore) {
    localStorage.setItem('highScore', inGameScore);
  }
  clearInterval(carGeneration);
  clearInterval(carAnimation);
}

/**
 * RESTARTS GAME ON RESTART BUTTON CLICK
 */
restartBtn.addEventListener('click', (e) => {
  gameOverOverlay.style.display = 'block';
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  gameOverOverlay.style.display = 'none';
  reset();
  startGame()
})

/**
 * GLOBAL VARIABLES
 */
let firstLane,
  secondLane;

let playerCar;

let inGameScore;
let highScore;

let offset;

let enemyCarList;

let playerImage = new Image(),
  enemyImage = new Image();

playerImage.src = './images/player.png';

enemyImage.src = './images/enemy.png'

let player = {
  lane: SECOND_LANE,
  yPosition: CANVAS_HEIGHT - CAR_WIDTH - OFFSET,
  color: 'blue',
  speed: 0,
  imgSrc: playerImage
}

let enemy = {
  lane: FIRST_LANE,
  yPosition: 0,
  color: 'red',
  speed: carSpeed,
  imgSrc: enemyImage
}

/**
 * RESETS GAME
 */
let reset = () => {
  firstLane = new Lane(LANE_WIDTH);
  secondLane = new Lane(LANE_WIDTH * 2);
  firstLane.draw();
  secondLane.draw();

  playerCar = new Car(player);
  playerCar.draw();

  carSpeed = 2;

  enemyCarList = [];
  offset = 1;

  inGameScore = 0;
}

/**
 * INITILIAZE GAME
 */
let init = () => {
  canvasInit();
  reset();
  startGame();
  scoreCanvas();
  highScoreCanvas();
}

/**
 * STARTS GAME
 * @type {String}
 */
startBtn.addEventListener('click', (e) => {
  gameStartOverlay.style.display = 'none';
  init();
})
