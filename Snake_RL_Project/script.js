const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const grid = 20;
let snake, direction, nextDirection, food;
let score, highScore, gameInterval;
let isPaused = false;

// Load High Score
highScore = localStorage.getItem("highScore") || 0;
document.getElementById("highScore").innerText = highScore;

// 🎮 START GAME
function startGame() {
  document.getElementById("overlay").style.display = "none";

  snake = [{ x: 200, y: 200 }];
  direction = { x: grid, y: 0 };
  nextDirection = { x: grid, y: 0 };

  food = randomFood();
  score = 0;
  document.getElementById("score").innerText = score;

  isPaused = false;

  clearInterval(gameInterval);
  gameInterval = setInterval(update, 120);
}

// 🍎 FOOD
function randomFood() {
  while (true) {
    let f = {
      x: Math.floor(Math.random() * 20) * grid,
      y: Math.floor(Math.random() * 20) * grid
    };

    if (!snake.some(s => s.x === f.x && s.y === f.y)) return f;
  }
}

// 🔁 UPDATE
function update() {
  if (isPaused) return;

  direction = nextDirection;

  let head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y
  };

  snake.unshift(head);

  // Collision
  if (
    head.x < 0 || head.y < 0 ||
    head.x >= canvas.width || head.y >= canvas.height ||
    snake.slice(1).some(s => s.x === head.x && s.y === head.y)
  ) {
    clearInterval(gameInterval);

    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
    }

    document.getElementById("highScore").innerText = highScore;

    document.getElementById("overlayText").innerText =
      "Game Over! Score: " + score;

    document.getElementById("startBtn").innerText = "Restart";
    document.getElementById("overlay").style.display = "flex";
    return;
  }

  // Food
  if (head.x === food.x && head.y === food.y) {
    score++;
    document.getElementById("score").innerText = score;
    food = randomFood();
  } else {
    snake.pop();
  }

  draw();
}

// 🎨 DRAW
function draw() {
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  snake.forEach((segment, index) => {
    const x = segment.x;
    const y = segment.y;

    // 🐍 HEAD
    if (index === 0) {
      // Head shape
      ctx.fillStyle = "#00ff88";
      ctx.beginPath();
      ctx.arc(x + 10, y + 10, 10, 0, Math.PI * 2);
      ctx.fill();

      // 👀 Eyes based on direction
      ctx.fillStyle = "black";

      let eyeOffsetX = 0;
      let eyeOffsetY = 0;

      if (direction.x === grid) eyeOffsetX = 4;       // Right
      if (direction.x === -grid) eyeOffsetX = -4;     // Left
      if (direction.y === grid) eyeOffsetY = 4;       // Down
      if (direction.y === -grid) eyeOffsetY = -4;     // Up

      // Left eye
      ctx.beginPath();
      ctx.arc(x + 6 + eyeOffsetX, y + 6 + eyeOffsetY, 2, 0, Math.PI * 2);

      // Right eye
      ctx.arc(x + 14 + eyeOffsetX, y + 6 + eyeOffsetY, 2, 0, Math.PI * 2);

      ctx.fill();
    }

    // 🐍 BODY
    else {
      ctx.fillStyle = "#00cc66";
      ctx.beginPath();
      ctx.arc(x + 10, y + 10, 9, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // 🍎 FOOD
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(food.x + 10, food.y + 10, 8, 0, Math.PI * 2);
  ctx.fill();
}

// 🎮 KEYBOARD (PC)
document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp" && direction.y === 0)
    nextDirection = { x: 0, y: -grid };

  if (e.key === "ArrowDown" && direction.y === 0)
    nextDirection = { x: 0, y: grid };

  if (e.key === "ArrowLeft" && direction.x === 0)
    nextDirection = { x: -grid, y: 0 };

  if (e.key === "ArrowRight" && direction.x === 0)
    nextDirection = { x: grid, y: 0 };
});

// 📱 TOUCH SWIPE (Mobile)
let startX, startY;

document.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
});

document.addEventListener("touchend", e => {
  let dx = e.changedTouches[0].clientX - startX;
  let dy = e.changedTouches[0].clientY - startY;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0 && direction.x === 0)
      nextDirection = { x: grid, y: 0 };
    else if (dx < 0 && direction.x === 0)
      nextDirection = { x: -grid, y: 0 };
  } else {
    if (dy > 0 && direction.y === 0)
      nextDirection = { x: 0, y: grid };
    else if (dy < 0 && direction.y === 0)
      nextDirection = { x: 0, y: -grid };
  }
});

// 📱 BUTTON CONTROLS
function setDirection(dir) {
  if (dir === "UP" && direction.y === 0)
    nextDirection = { x: 0, y: -grid };

  if (dir === "DOWN" && direction.y === 0)
    nextDirection = { x: 0, y: grid };

  if (dir === "LEFT" && direction.x === 0)
    nextDirection = { x: -grid, y: 0 };

  if (dir === "RIGHT" && direction.x === 0)
    nextDirection = { x: grid, y: 0 };
}

// ⏸ Pause
function togglePause() {
  if (isPaused) {
    gameInterval = setInterval(update, 120);
    isPaused = false;
  } else {
    clearInterval(gameInterval);
    isPaused = true;
  }
}