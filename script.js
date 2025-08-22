let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");

let players = 1;
let game = false;
let score = 0;
let score1 = 0;
let score2 = 0;
let score3 = 0;

let player1MovingUp = false;
let player1MovingDown = false;
let player2MovingUp = false;
let player2MovingDown = false;

let bounceCount = 0;
let canvasWidth = canvas.width;
let canvasHeight = canvas.height;

let block = null;

function getRandomBlock() {
  const width = Math.random() * 40 + 20;   // от 20 до 60 px
  const height = Math.random() * 40 + 20;  // от 20 до 60 px
  const x = Math.random() * (canvasWidth - width);
  const y = Math.random() * (canvasHeight - height);
  return { x, y, width, height };
}

let ball = {
  x: canvasWidth / 2 - 7.5,
  y: canvasHeight / 2 - 7.5,
  size: 15,
  speed: 2,
  dx: 2,
  dy: 1
};

let player1 = {
  x: 25,
  y: 150,
  width: 5,
  height: 75,
  speed: 5
};
let player2 = {
  x: canvasWidth - 30,
  y: 150,
  width: 5,
  height: 75,
  speed: 5
};

let keys = {};

document.getElementById('ButtonPlayer1').addEventListener('click', function () {
  players = 1;
  document.getElementById('ButtonPlayer1').style.background = 'green';
  document.getElementById('ButtonPlayer2').style.background = 'red';
  score = 1;
});
document.getElementById('ButtonPlayer2').addEventListener('click', function () {
  players = 2;
  document.getElementById('ButtonPlayer2').style.background = 'green';
  document.getElementById('ButtonPlayer1').style.background = 'red';
  score = 2;
});
document.getElementById('closeModal').addEventListener('click', function () {
  document.getElementById('modal').style.display = 'none';
  game = true;
});
document.getElementById('ButtonEnd').addEventListener('click', function () {
  resetBall();
  player1.y = 150;
  player2.y = 150;
  player1.speed = 5;
  player2.speed = 5;
  bounceCount = 0;
  score1 = 0;
  score2 = 0;
  score3 = 0;
  document.getElementById('score1').textContent = 0;
  document.getElementById('score2').textContent = 0;
  document.getElementById('score3').textContent = 0;
});

document.addEventListener("keydown", e => {
  keys[e.key] = true;
});
document.addEventListener("keyup", e => {
  keys[e.key] = false;
});

function update() {
  if (game) {
    if (players === 1) {
      if (keys["ArrowUp"]) player1.y -= player1.speed;
      if (keys["ArrowDown"]) player1.y += player1.speed;
    }
    if (players === 2) {
      if (keys["w"]) player1.y -= player1.speed;
      if (keys["s"]) player1.y += player1.speed;
    }
    if (keys["ArrowUp"]) player2.y -= player2.speed;
    if (keys["ArrowDown"]) player2.y += player2.speed;

    // Paddle wrap-around
    [player1, player2].forEach(player => {
      if (player.y + player.height < 0) player.y = canvasHeight;
      else if (player.y > canvasHeight) player.y = -player.height;
    });

    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.y <= 0 || ball.y + ball.size >= canvasHeight) {
      ball.dy *= -1;
    }

    checkPaddleCollision();
    checkBlockCollision();

    if (score === 1) {
      document.getElementById('score1').style.display = 'none';
      document.getElementById('score2').style.display = 'none';
      if (ball.x < 0 || ball.x > canvasWidth) {
        score3++;
        document.getElementById('score3').textContent = score3;
      }
    }
    if (score === 2) {
      document.getElementById('score3').style.display = 'none';
      if (ball.x < 0) {
        score2++;
        document.getElementById('score2').textContent = score2;
      }
      if (ball.x > canvasWidth) {
        score1++;
        document.getElementById('score1').textContent = score1;
      }
    }

    if (ball.x < 0 || ball.x > canvasWidth) {
      resetBall();
    }
  }
}

function checkPaddleCollision() {
  if (
    ball.x <= player1.x + player1.width &&
    ball.x >= player1.x &&
    ball.y + ball.size >= player1.y &&
    ball.y <= player1.y + player1.height
  ) {
    ball.dx = Math.abs(ball.dx);
    ball.x = player1.x + player1.width;
    onBallBounce();
  }

  if (
    ball.x + ball.size >= player2.x &&
    ball.x + ball.size <= player2.x + player2.width &&
    ball.y + ball.size >= player2.y &&
    ball.y <= player2.y + player2.height
  ) {
    ball.dx = -Math.abs(ball.dx);
    ball.x = player2.x - ball.size;
    onBallBounce();
  }
}

function checkBlockCollision() {
  if (!block) return;

  if (
    ball.x + ball.size > block.x &&
    ball.x < block.x + block.width &&
    ball.y + ball.size > block.y &&
    ball.y < block.y + block.height
  ) {
    ball.dx *= -1;
    ball.dy *= -1;
    onBallBounce();
  }
}


function onBallBounce() {
  bounceCount++;
  increaseBallSpeed();

  if (bounceCount % 3 === 0) {
    player1.speed += 0.5;
    player2.speed += 0.5;
  }

  // Каждые 5 отскоков — создать новый блок
  if (bounceCount % 3 === 0) {
    block = getRandomBlock();
  }

  ball.dy += (Math.random() - 0.5) * 0.5;
}


function increaseBallSpeed() {
  ball.dx += ball.dx > 0 ? 0.3 : -0.3;
  ball.dy += ball.dy > 0 ? 0.3 : -0.3;
}

function resetBall() {
  ball.x = canvasWidth / 2 - ball.size / 2;
  ball.y = canvasHeight / 2 - ball.size / 2;
  ball.dx = (Math.random() < 0.5 ? -1 : 1) * 2;
  ball.dy = (Math.random() < 0.5 ? -1 : 1) * 2;
  bounceCount = 0;
  player1.speed = 5;
  player2.speed = 5;
  block = null; // блок удаляется при сбросе
}


function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Игрок 1
  ctx.shadowOffsetX = -3;
  ctx.shadowOffsetY = 0;
  ctx.shadowBlur = 15;
  ctx.shadowColor = "rgba(255, 0, 0, 1)";
  ctx.fillStyle = "red";
  ctx.fillRect(player1.x, player1.y, player1.width, player1.height);

  // Мяч
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.shadowBlur = 15;
  ctx.shadowColor = "white";
  ctx.fillStyle = "white";
  ctx.fillRect(ball.x, ball.y, ball.size, ball.size);

  // Игрок 2
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 0;
  ctx.shadowBlur = 15;
  ctx.shadowColor = "rgba(0, 0, 255, 1)";
  ctx.fillStyle = "blue";
  ctx.fillRect(player2.x, player2.y, player2.width, player2.height);

  // Блок (если он есть)
  if (block) {
    ctx.shadowBlur = 0;
    ctx.shadowColor = "transparent";
    ctx.fillStyle = "yellow";
    ctx.fillRect(block.x, block.y, block.width, block.height);
  }
}


function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
