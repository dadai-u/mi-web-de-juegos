window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  const bird = {
    x: 80,
    y: 300,
    width: 24,
    height: 34,
    gravity: 0.6,
    lift: -12,
    velocity: 0
  };

  const pipeWidth = 60;
  const minGap = 180;
  const maxGap = 500;
  const pipeGap = Math.floor(Math.random() * (maxGap - minGap + 1)) + minGap;

  const pipeSpeed = 2;
  let pipes = [];

  let score = 0;
  let highScore = localStorage.getItem('flappyHighScore') || 0;

  let gameOver = false;
  let animationId;

  const gameOverDiv = document.getElementById('gameOver');
  const finalScoreDisplay = document.getElementById('finalScore');
  const recordScoreEndDisplay = document.getElementById('recordScoreEnd');
  const restartBtn = document.getElementById('restartBtn');

  function createPipe() {
    const minGap = 200;
    const maxGap = 400;
    const pipeGap = Math.floor(Math.random() * (maxGap - minGap + 1)) + minGap;

    const minHeight = 50;
    const maxHeight = canvas.height - pipeGap - minHeight;
    const heightTop = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;

    pipes.push({
      x: canvas.width,
      y: 0,
      width: pipeWidth,
      height: heightTop,
      passed: false
    });

    pipes.push({
      x: canvas.width,
      y: heightTop + pipeGap,
      width: pipeWidth,
      height: canvas.height - heightTop - pipeGap,
      passed: false
    });
  }


  window.addEventListener('keydown', e => {
    if (e.code === 'Space' || e.key === ' ') {
      if (!gameOver) {
        bird.velocity = bird.lift;
      }
    }
  });

  function resetGame() {
    bird.y = 300;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    gameOver = false;
    createPipe();
    gameOverDiv.style.display = 'none';
    loop();
  }

  const birdImage = new Image();
  birdImage.src = 'assets/hongito.png';

  birdImage.onload = () => {
    resetGame(); // Iniciar el juego solo cuando la imagen esté cargada
  };


  //function drawBird() {
 //ctx.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
  //}
  function drawBird() {
    if (birdImage.complete && birdImage.naturalWidth !== 0) {
      ctx.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
    } 
    else {
      // Si la imagen no está lista o no se carga, dibuja un rectángulo
      ctx.fillStyle = '#ff0';
      ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
    }
  }

  function drawPipes() {
    ctx.fillStyle = '#0f0';
    pipes.forEach(pipe => {
      ctx.fillRect(pipe.x, pipe.y, pipe.width, pipe.height);
    });
  }

  function update() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.height > canvas.height || bird.y < 0) {
      gameOver = true;
    }

    for (let i = pipes.length - 1; i >= 0; i--) {
      pipes[i].x -= pipeSpeed;

      if (!pipes[i].passed && pipes[i].x + pipeWidth < bird.x && i % 2 === 0) {
        score++;
        pipes[i].passed = true;
      }

      if (pipes[i].x + pipeWidth < 0) {
        pipes.splice(i, 1);
      }
    }

    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
      createPipe();
    }

    for (let pipe of pipes) {
      if (
        bird.x < pipe.x + pipe.width &&
        bird.x + bird.width > pipe.x &&
        bird.y < pipe.y + pipe.height &&
        bird.y + bird.height > pipe.y
      ) {
        gameOver = true;
      }
    }

    if (gameOver) {
      endGame();
    }
  }

  function endGame() {
    cancelAnimationFrame(animationId);
    if (score > highScore) {
      highScore = score;
      localStorage.setItem('flappyHighScore', highScore);
    }
    finalScoreDisplay.textContent = score;
    recordScoreEndDisplay.textContent = highScore;
    gameOverDiv.style.display = 'block';
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBird();
    drawPipes();
  }

  function loop() {
    update();
    draw();
    if (!gameOver) {
      animationId = requestAnimationFrame(loop);
    }
  }

  restartBtn.addEventListener('click', resetGame);  

  const homeBtn = document.getElementById('homeBtn');
  homeBtn.addEventListener('click', () => {
    window.location.href = '../index.html'; // Ajusta si tu index.html está en juegos/
  });

});

