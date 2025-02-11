const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.body.appendChild(canvas);
canvas.width = 400;
canvas.height = 400;

const gridSize = 20;
let snake = [{ x: 200, y: 200 }];
let direction = { x: gridSize, y: 0 };
let food = { x: 100, y: 100 };
let score = 0;
let gameOver = false;

function randomFood() {
  food = {
    x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
    y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize,
  };
}

function isSafeMove(x, y) {
  return (
    x >= 0 &&
    x < canvas.width &&
    y >= 0 &&
    y < canvas.height &&
    !snake.some((segment) => segment.x === x && segment.y === y)
  );
}

function greedyMove() {
  let dx = food.x - snake[0].x;
  let dy = food.y - snake[0].y;
  let possibleMoves = [];

  if (dx > 0 && isSafeMove(snake[0].x + gridSize, snake[0].y)) {
    possibleMoves.push({ x: gridSize, y: 0 });
  } else if (dx < 0 && isSafeMove(snake[0].x - gridSize, snake[0].y)) {
    possibleMoves.push({ x: -gridSize, y: 0 });
  }

  if (dy > 0 && isSafeMove(snake[0].x, snake[0].y + gridSize)) {
    possibleMoves.push({ x: 0, y: gridSize });
  } else if (dy < 0 && isSafeMove(snake[0].x, snake[0].y - gridSize)) {
    possibleMoves.push({ x: 0, y: -gridSize });
  }

  if (possibleMoves.length > 0) {
    direction = possibleMoves[0];
  } else {
    let safeDirections = [
      { x: gridSize, y: 0 },
      { x: -gridSize, y: 0 },
      { x: 0, y: gridSize },
      { x: 0, y: -gridSize },
    ].filter((move) => isSafeMove(snake[0].x + move.x, snake[0].y + move.y));
    if (safeDirections.length > 0) {
      direction = safeDirections[0];
    }
  }
}

function update() {
  if (gameOver) return;
  greedyMove();
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  if (!isSafeMove(head.x, head.y)) {
    gameOver = true;
    alert(`Game Over! Your score: ${score}`);
    return;
  }

  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) {
    score++;
    randomFood();
  } else {
    snake.pop();
  }
}

function draw() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, gridSize, gridSize);

  ctx.fillStyle = "green";
  snake.forEach((segment) => ctx.fillRect(segment.x, segment.y, gridSize, gridSize));

  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 10, 20);
}

function gameLoop() {
  update();
  draw();
  if (!gameOver) {
    setTimeout(gameLoop, 100);
  }
}

gameLoop();
