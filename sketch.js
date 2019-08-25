const WIDTH = 400;
const HEIGHT = 600;
const TOTAL = 350;
let birds = [];
let savedBirds = [];
let pipes = [];
let slider;
let trainButton;
let playBestButton;
let playerPlayButton;
let playerPlayAIButton;
let counter = 0;
let train = true;
let playBest = false;
let playerPlay = false;
let playerPlayAI = false;
let brainJSON;
let generation = 0;

function setup() {
  createCanvas(WIDTH, HEIGHT);
  slider = createSlider(1, 50, 1);

  trainButton = createButton("Train");
  playBestButton = createButton("Play Best");
  playerPlayButton = createButton("Player Play");
  playerPlayAIButton = createButton("Player Play Against Best");

  trainButton.mousePressed(trainClick);
  playBestButton.mousePressed(playBestClick);
  playerPlayButton.mousePressed(playerPlayClick);
  playerPlayAIButton.mousePressed(playerPlayAIClick);

  if (train) {
    loadTrainBirds();
  } else if (playBest) {
    loadBestBird();
  } else if (playerPlay) {
    loadPlayer();
  } else if (playerPlayAI) {
    loadPlayerAI();
  }

  preload();
}

function trainClick() {
  train = true;
  playBest = false;
  playerPlay = false;
  playerPlayAI = false;
  birds = [];
  savedBirds = [];
  pipes = [];
  counter = 0;

  loadTrainBirds();
}

function playBestClick() {
  train = false;
  playBest = true;
  playerPlay = false;
  playerPlayAI = false;
  birds = [];
  pipes = [];
  counter = 0;

  loadBestBird();
}

function playerPlayClick() {
  train = false;
  playBest = false;
  playerPlay = true;
  playerPlayAI = false;

  birds = [];
  pipes = [];
  counter = 0;

  loadPlayer();
}

function playerPlayAIClick() {
  train = false;
  playBest = false;
  playerPlay = false;
  playerPlayAI = true;

  birds = [];
  pipes = [];
  counter = 0;

  loadPlayer();
  loadBestBird();
}

function draw() {
  background(0);
  for (let i = 0; i < slider.value(); i++) {
    if (counter % 100 === 0) {
      pipes.push(new Pipe());
    }

    for (let i = 0; i < birds.length; i++) {
      let bird = birds[i];
      bird.think(pipes);
      bird.update();
    }

    counter++;

    for (let i = 0; i < pipes.length; i++) {
      let pipe = pipes[i];
      pipe.update();

      if (pipe.offScreen()) {
        pipes.splice(i, 1);
        i--;
      }
    }

    for (let i = 0; i < pipes.length; i++) {
      for (let j = 0; j < birds.length; j++) {
        if (pipes[i].hit(birds[j]) || birds[j].offScreen()) {
          savedBirds.push(birds.splice(j, 1)[0]);
        }
      }
    }

    if (birds.length === 0 && train) {
      nextGeneration();
      pipes = [];
      counter = 0;
    } else if (birds.length === 0 && playBest) {
      pipes = [];
      loadBestBird();
      counter = 0;
    } else if (birds.length === 0 && playerPlay) {
      pipes = [];
      birds = [];
      loadPlayer();
      counter = 0;
    } else if (birds.length === 1 && playerPlayAI) {
      let bird = birds[0];
      if (!bird.playerControl) {
        pipes = [];
        birds = [];
        loadPlayer();
        loadBestBird();
        counter = 0;
      }
    } else if (birds.length === 0 && playerPlayAI) {
      pipes = [];
      loadPlayer();
      loadBestBird();
      counter = 0;
    }
  }

  for (let i = 0; i < birds.length; i++) {
    birds[i].show();
  }

  for (let i = 0; i < pipes.length; i++) {
    pipes[i].show();
  }

  let best = findBestBird();
  if (best) {
    fill(255);
    text(`Score ${best.score}`, WIDTH / 2.0, 60);
  }
  fill(255);
  text(`Generation ${generation}`, WIDTH / 2.0, 20);
  text(`Alive ${birds.length}`, WIDTH / 2.0, 40);
}

function keyPressed() {
  //option to save the best bird
  // if (key === "S") {
  //   let bird = findBestBird();
  //   saveJSON(bird.brain, "best_bird.json");
  // } else
  if (key === " ") {
    for (let bird of birds) {
      if (bird.playerControl) {
        bird.up();
      }
    }
  }
}

function findBestBird() {
  var bestBird;
  var bestScore = 0;
  for (let bird of birds) {
    if (bird.score > bestScore) {
      bestBird = bird;
      bestScore = bird.score;
    }
  }

  return bestBird;
}

function preload() {
  brainJSON = loadJSON("best_bird.json");
}

function loadBestBird() {
  birds.push(new Bird(NeuralNetwork.deserialize(brainJSON)));
}

function loadPlayer() {
  birds.push(new Bird(NeuralNetwork.deserialize(brainJSON), true));
}

function loadTrainBirds() {
  for (let i = 0; i < TOTAL; i++) {
    birds.push(new Bird());
  }
}
