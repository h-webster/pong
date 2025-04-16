const WIDTH = 950;
const HEIGHT = 450;
const SPEEDUP = 1.08;
const SPEED = 7;
const START_SPEED = -8;


let winner;
let score = 0;

class Block {
  constructor(type, x, y, w, h) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.h = h;
    this.w = w;
  }
  Render() {
    rect(this.x, this.y, this.w, this.h);
  }
  Move(d) {
    this.y += d;
    if (this.y < 0) {
      this.y = 0;
    }
    if (this.y + this.h > HEIGHT) {
      this.y = HEIGHT - this.h;
    }
  }
}

class Ball {
  constructor(x, y, r, vx, vy) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.vx = vx;
    this.vy = vy;
  }
  Render() {
    fill(255, 0, 0);
    circle(this.x, this.y, this.r);
    fill(255, 255, 255);
  }
  Simulate() {
    this.x += this.vx;
    this.y += this.vy;
    
    if (this.x < 0) {
      this.vx = abs(this.vx);
    }
    if (this.x > WIDTH) {
      this.vx = -abs(this.vx);
    }
    if (this.y < 0) {
      this.vy = abs(this.vy);
    }
    if (this.y > HEIGHT) {
      this.vy = -abs(this.vy);
    }
  }
}

function ballTouchRect(b, r) {
  let closestX = constrain(b.x, r.x, r.w + r.x);
  let closestY = constrain(b.y, r.y, r.h + r.y);
  
  let distance = dist(b.x, b.y, closestX, closestY);
  
  return distance <= b.r;
}

let player1, player2, ball;
let status = "notready";

function setup() {
  createCanvas(WIDTH, HEIGHT);
  player1 = new Block("player", WIDTH * 0.1, HEIGHT / 2 - 60, 25, 120);
  player2 = new Block("player", WIDTH * 0.9 - 25, HEIGHT / 2 - 60, 25, 120);
  ball = new Ball(WIDTH / 2, HEIGHT / 2, 10, START_SPEED, 0);
}

function draw() {
  background(220);
  
  DoStatus();
  
  
  player1.Render();
  player2.Render();
  ball.Render();
}

function DoStatus() {
  if (status == "gameOver") {
    let winnerText;
    if (winner == "l") {
      winnerText = "Player 1 Won!";
    } else {
      winnerText = "Player 2 Won!";
    }
    text(winnerText, WIDTH / 2, HEIGHT / 4);
    text("Press space to play again!", WIDTH / 2, HEIGHT / 4 + 70);
    score = 0;
  }
  if (status == "notready") {
    textAlign(CENTER);
    textSize(20);
    text("Space to start!", WIDTH / 2, HEIGHT / 4);
    score = 0;
  }
  if (status == "playing") {
    text(score, WIDTH / 2, HEIGHT / 4);
    if (keyIsDown(87)) { // 87 - w
        player1.Move(-SPEED);
    }
    if (keyIsDown(83)) { // 83 - s
        player1.Move(SPEED);
    }
    if (keyIsDown(UP_ARROW)) {
      player2.Move(-SPEED);
    }
    if (keyIsDown(DOWN_ARROW)) {
      player2.Move(SPEED);
    }
    ball.Simulate();
    if (gameOver(ball, player1, player2)) {
      status = "gameOver";
      return;
    }
    if (ballTouchRect(ball, player1)) {
      let bounce = differBounce(abs(ball.vx), abs(ball.vy), ball.y, player1.y, player1.y+player1.h);
      ball.vx = bounce[0] * SPEEDUP;
      ball.vy = bounce[1];
      score += 1;
    }
    if (ballTouchRect(ball, player2)) {
      let bounce = differBounce(abs(ball.vx), abs(ball.vy), ball.y, player2.y, player2.y+player2.h);
      ball.vx = -bounce[0] * SPEEDUP;
      ball.vy = bounce[1];
      score += 1;
    }
  }
}

function keyPressed() {
  if (keyCode == 32 && status == "notready") {
    status = "playing";
  }
  if (keyCode == 32 && status == "gameOver") {
    status = "playing";
    ball.x = WIDTH / 2;
    ball.y = HEIGHT / 2;
    ball.vx = START_SPEED;
    ball.vy = 0;
    player1.y = HEIGHT / 2 - 60;
    player2.y = HEIGHT / 2 - 60;
  }
}


function differBounce(vx, vy, by, top, bottom) {
  // top is min because top of screen y=0
  let angle = mapToRange(by, top, bottom, 0, 180);
  
  if (angle > 90) {
    angle = 180 - angle;
    angle = -abs(angle);
    angle = -abs(90 + angle);
  } else {
    angle = 90 - angle;
  }
  // curb so not really steep
  if (angle < -75) {
    angle = -75;
  }
  if (angle > 75) {
    angle = 75;
  }
  console.log(angle);
  let hyp = sqrt(vx*vx + vy*vy);
  angleMode(DEGREES);
  let nx = hyp * cos(angle);
  let ny = hyp * sin(angle);
  return [nx, ny];
} 

function mapToRange(x, xmin, xmax, newMin, newMax) {
  return ((x-xmin) / (xmax-xmin)) * (newMax - newMin) + newMin;
}

function gameOver(ball, pL, pR) {
  if (ball.x < pL.x) {
    winner = "r";
    return true;
  }
  if (ball.x > pR.x + pR.w) {
    winner = "l";
    return true;
  }
  return false;
}
