window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const gameOverMsg = document.getElementById("gameOverMsg");

  const gridSize = 10;
  let snake = [{ x: 50, y: 50 }];
  let direction = "RIGHT";
  let food = { x: 80, y: 80 };
  let score = 0;
  let isGameOver = false;

  let highScore = localStorage.getItem("snakeHighScore") || 0;

  const scoreDisplay = document.getElementById("score");
  const highScoreDisplay = document.getElementById("highScore");

  function updateScoreDisplay() {
    scoreDisplay.textContent = "Puntaje: " + score;
    highScoreDisplay.textContent = "Récord: " + highScore;
  }

  function drawSnake() {
    ctx.fillStyle = "#00ff00";
    snake.forEach(segment => {
      ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    });
  }

  function drawFood() {
    ctx.fillStyle = "#ff0000";
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
  }

  function isCollidingWithSelf() {
    for (let i = 1; i < snake.length; i++) {
      if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
        return true;
      }
    }
    return false;
  }

  function generateFood() {
    const x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
    const y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
    return { x, y };
  }

  function resetGame() {
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("snakeHighScore", highScore);
    }

    snake = [{ x: 50, y: 50 }];
    direction = "RIGHT";
    score = 0;
    food = generateFood();
    isGameOver = false;
    gameOverMsg.classList.add("hidden");
    updateScoreDisplay();
  }

  function updateSnake() {
    const newHead = { ...snake[0] };

    if (direction === "RIGHT") newHead.x += gridSize;
    if (direction === "LEFT") newHead.x -= gridSize;
    if (direction === "UP") newHead.y -= gridSize;
    if (direction === "DOWN") newHead.y += gridSize;

    if (newHead.x === food.x && newHead.y === food.y) {
      score += 10;
      food = generateFood();
      updateScoreDisplay();
    } else {
      snake.pop();
    }

    snake.unshift(newHead);

    if (
      newHead.x < 0 ||
      newHead.x >= canvas.width ||
      newHead.y < 0 ||
      newHead.y >= canvas.height ||
      isCollidingWithSelf()
    ) {
      isGameOver = true;
      gameOverMsg.classList.remove("hidden");
    }
  }

  function updateGame() {
    if (isGameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood();
    updateSnake();
  }

  document.addEventListener("keydown", event => {
    if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
    if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";

    if (isGameOver && event.key === " ") {
      resetGame();
    }
  });

  // Reinicio con toque en pantallas móviles
  document.addEventListener("touchstart", () => {
    if (isGameOver) {
      resetGame();
    }
  });

  document.getElementById("restartBtn").addEventListener("click", () => {
    resetGame();
  });

  document.getElementById("backBtn").addEventListener("click", () => {
    window.location.href = "../index.html";
  });

  updateScoreDisplay();
  setInterval(updateGame, 100);
});
