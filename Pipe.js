class Pipe {
  constructor() {
    this.spacing = 125;
    this.w = 20;
    this.speed = 3;
    this.x = WIDTH - this.w;
    this.y = random(HEIGHT - this.spacing);
    this.top = this.y;
    this.bottom = this.y + this.spacing;

    if (this.y > HEIGHT - this.spacing) {
      this.y = this.spacing;
    }
  }

  show() {
    fill(255);

    rect(this.x, 0, this.w, this.top);
    rect(this.x, this.bottom, this.w, HEIGHT);
  }

  update() {
    this.x -= this.speed;
  }

  offScreen() {
    return this.x < -this.w;
  }

  hit(bird) {
    if ((bird.y >= 0 && bird.y <= this.y) || (bird.y >= this.y + this.spacing && bird.y <= HEIGHT)) {
      if (bird.x >= this.x && bird.x <= this.x + this.w) {
        return true;
      }
    }
    return false;
  }
}
