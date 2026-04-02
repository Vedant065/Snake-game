const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const grid = 20;
let snake, direction, nextDirection, food;
let score, highScore, gameInterval;
let isPaused = false;
let gameSpeed = 120;

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
  gameInterval = setInterval(update, gameSpeed);
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

// 🎨 DRAW (WITH FACE 👀)
function draw() {
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  snake.forEach((s, i) => {
    if (i === 0) {
      // Head
      ctx.fillStyle = "#00ff88";
      ctx.beginPath();
      ctx.arc(s.x + 10, s.y + 10, 10, 0, Math.PI * 2);
      ctx.fill();

      // Eyes
      ctx.fillStyle = "black";

      let offsetX = 0, offsetY = 0;
      if (direction.x === grid) offsetX = 4;
      if (direction.x === -grid) offsetX = -4;
      if (direction.y === grid) offsetY = 4;
      if (direction.y === -grid) offsetY = -4;

      ctx.beginPath();
      ctx.arc(s.x + 6 + offsetX, s.y + 6 + offsetY, 2, 0, Math.PI * 2);
      ctx.arc(s.x + 14 + offsetX, s.y + 6 + offsetY, 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = "#00cc66";
      ctx.beginPath();
      ctx.arc(s.x + 10, s.y + 10, 9, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // Food
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(food.x + 10, food.y + 10, 8, 0, Math.PI * 2);
  ctx.fill();
}

// 🎮 KEYBOARD
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

// 📱 TOUCH
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

// 📱 BUTTONS
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
    gameInterval = setInterval(update, gameSpeed);
    isPaused = false;
  } else {
    clearInterval(gameInterval);
    isPaused = true;
  }
}

const speedButtons = document.querySelectorAll(".speed-btn");

speedButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    // Remove active from all
    speedButtons.forEach(b => b.classList.remove("active"));

    // Add active to clicked
    btn.classList.add("active");

    // Set speed
    gameSpeed = parseInt(btn.dataset.speed);

    // Restart interval
    clearInterval(gameInterval);
    gameInterval = setInterval(update, gameSpeed);
  });
});
