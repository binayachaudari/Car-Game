/**
 * CLASS LANE
 */
class Lane {
  constructor(xCoordinate) {
    this.x = xCoordinate;
  }

  /**
   * DRAWS LANE
   */
  draw() {
    ctx.beginPath();
    ctx.moveTo(this.x, 0);
    ctx.lineTo(this.x, CANVAS_HEIGHT);
    ctx.setLineDash([40, 55]);
    ctx.lineDashOffset = -offset;
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#fff';
    ctx.stroke();
  }

  /**
   * ANIMATE LANE
   */
  update() {
    offset += carSpeed;
  }
}