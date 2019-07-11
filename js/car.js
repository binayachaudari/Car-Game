/**
 * CAR CLASS
 */
class Car {
  constructor(car) {
    this.lane = car.lane;
    this.x = (this.lane + 0.5) * LANE_WIDTH - (CAR_WIDTH / 2); //FORMULA FOR CAR POSITION;
    this.y = car.yPosition;
    this.color = car.color;
    this.speed = car.speed;
    this.src = car.imgSrc;
  }

  /**
   * DRAWS RECTANGLE FOR PLAYER AND ENEMY CAR
   */
  draw() {
    ctx.beginPath();
    ctx.drawImage(this.src, this.x, this.y);
  }

  /**
   * UPDATES POSTION OF CAR ON EACH FRAME
   */
  update() {
    this.x = (this.lane + 0.5) * LANE_WIDTH - (CAR_WIDTH / 2);
    this.y += this.speed;
  }
}