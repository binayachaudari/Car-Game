const CANVAS_WIDTH = 450,
  CANVAS_HEIGHT = window.innerHeight,
  CAR_HEIGHT = 75,
  CAR_WIDTH = 75,
  ENEMY_CAR_SPEED = 5,
  OFFSET = 10,
  FIRST_LANE = 0,
  SECOND_LANE = 1,
  THIRD_LANE = 2,
  LANE_WIDTH = CANVAS_WIDTH / 3;

document.body.style.margin = `0px`;
document.body.style.padding = `0px`;
const canvas = document.createElement('canvas');

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
canvas.style.backgroundColor = 'black';
canvas.style.display = 'block';
canvas.style.border = '1px solid black'
canvas.style.margin = '0 auto';
document.body.appendChild(canvas);

let ctx = canvas.getContext('2d');


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


class Car {
  constructor(car) {
    this.lane = car.lane;
    this.x = (this.lane + 0.5) * LANE_WIDTH - (CAR_WIDTH / 2);
    this.y = car.yPosition;
    this.color = car.color;
    this.speed = car.speed;
  }

  draw() {
    ctx.beginPath();
    ctx.rect(this.x, this.y, CAR_WIDTH, CAR_HEIGHT);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update() {
    this.x = (this.lane + 0.5) * LANE_WIDTH - (CAR_WIDTH / 2);
    this.y += this.speed;
  }
}

let offset = 0;
class Lane {
  constructor(xCoordinate) {
    this.x = xCoordinate;
  }

  draw() {
    ctx.beginPath();
    ctx.moveTo(this.x, 0);
    ctx.lineTo(this.x, CANVAS_HEIGHT);
    ctx.setLineDash([20, 15]);
    ctx.lineDashOffset = -offset;
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#fff';
    ctx.stroke();
  }

  update() {
    offset += ENEMY_CAR_SPEED;
  }
}

let firstLane = new Lane(LANE_WIDTH);
let secondLane = new Lane(LANE_WIDTH * 2);
firstLane.draw();
secondLane.draw();


let player = {
  lane: SECOND_LANE,
  yPosition: CANVAS_HEIGHT - CAR_WIDTH - OFFSET,
  color: 'blue',
  speed: 0
}

let enemy = {
  lane: FIRST_LANE,
  yPosition: 0,
  color: 'red',
  speed: ENEMY_CAR_SPEED
}

let enemyCarList = [];

let playerCar = new Car(player);
playerCar.draw();

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

let updateAll = () => {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  playerCar.draw();
  enemyCarList.forEach((enemyCar, index) => {
    enemyCar.draw();
  })
  firstLane.draw();
  secondLane.draw();
}

var carGeneration = setInterval(() => {
  let enemyCar = new Car(enemy);
  enemyCar.lane = generateRandomNumber(0, 3);
  enemyCarList.push(enemyCar);

  if (enemyCarList.length > 10) {
    enemyCarList.splice(0, 5);
  }
}, 2000);


setInterval(() => {
  enemyCarList.forEach((eachEnemy, index) => {
    eachEnemy.draw();
    eachEnemy.update();
    updateAll();
  })
  firstLane.update();
}, 50)
