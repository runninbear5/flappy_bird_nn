class Bird {
  constructor(brain, playerControl = false) {
    this.x = 64;
    this.y = HEIGHT / 2;

    this.vel = 0;
    this.lift = -12;
    this.gravity = 0.8;
    this.score = 0;
    this.fitness = 0;

    if (brain) {
      this.brain = brain.copy();
    } else {
      this.brain = new NeuralNetwork(5, 8, 2);
    }

    this.playerControl = playerControl;
  }

  show() {
    if (this.playerControl) {
      stroke(255, 0, 0);
    } else {
      stroke(255);
    }
    fill(255, 50);
    ellipse(this.x, this.y, 20, 20);
  }

  offScreen() {
    if (this.y > height) {
      return true;
    }

    if (this.y < 0) {
      return true;
    }

    return false;
  }

  think(pipes) {
    if (!this.playerControl) {
      let inputs = [];

      let closest = null;
      let closestD = Infinity;

      for (let i = 0; i < pipes.length; i++) {
        let pipe = pipes[i];
        let d = pipe.x + pipe.w - this.x;

        if (d < closestD && d > 0) {
          closest = pipe;
          closestD = d;
        }
      }

      inputs[0] = this.vel / 10;
      inputs[1] = this.y / HEIGHT;
      inputs[2] = closest.top / HEIGHT;
      inputs[3] = closest.bottom / HEIGHT;
      inputs[4] = closest.x / WIDTH;

      let outputs = this.brain.predict(inputs);

      if (outputs[0] > outputs[1]) {
        this.up();
      }
    }
  }

  update() {
    this.vel += this.gravity;
    // this.vel *= 0.9;
    this.y += this.vel;
    this.score++;
  }

  up() {
    this.vel += this.lift;
  }
}
