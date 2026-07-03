//Game constants
const GRAVITY = 0.5;
const JUMP_FORCE = -12;
const MOVE_SPEED = 2.5;
const ENEMY_SPEED = 1;

//Game state
let gameState = {
  score: 0,
  level: 1,
  lives: 3,
  gameRunning: true,
  keys: {},
};

//Player object
let player = {
  element: document.getElementById('mario'),
  x: 50,
  y: 340,
  width: 20,
  height: 20,
  velocityX: 0,
  velocityY: 0,
  grounded: false,
  big: false,
  bigTimer: 0,
};

//Game objects arrays
let gameObjects = {
  platforms: [],
  enemies: [],
  coins: [],
  surpriseBlocks: [],
  pipes: [],
};

//Levels
const levels = [
  //level 1
  {
    platforms: [
      { x: 0, y: 360, width: 400, height: 40, type: 'platform' },
      { x: 500, y: 360, width: 300, height: 40, type: 'platform' },
      { x: 200, y: 280, width: 60, height: 20, type: 'floating' },
      { x: 300, y: 240, width: 60, height: 20, type: 'floating' },
      { x: 600, y: 280, width: 80, height: 20, type: 'floating' },
    ],
    enemies: [
      { x: 250, y: 340, type: 'gumba' },
      { x: 550, y: 340, type: 'gumba' },
    ],
    coins: [
      { x: 220, y: 260 },
      { x: 320, y: 220 },
      { x: 620, y: 260 },
    ],
    surpriseBlocks: [{ x: 355, y: 235, type: 'mushroom' }],
    pipes: [{ x: 750, y: 320 }],
  },
  //level 2
  {
    platforms: [
      { x: 0, y: 360, width: 200, height: 40, type: 'blue' },
      { x: 300, y: 360, width: 200, height: 40, type: 'blue' },
      { x: 600, y: 360, width: 200, height: 40, type: 'blue' },
      { x: 150, y: 300, width: 40, height: 20, type: 'blue' },
      { x: 250, y: 280, width: 40, height: 20, type: 'blue' },
      { x: 350, y: 260, width: 40, height: 20, type: 'blue' },
      { x: 450, y: 240, width: 40, height: 20, type: 'blue' },
      { x: 550, y: 280, width: 60, height: 20, type: 'blue' },
    ],
    enemies: [
      { x: 350, y: 340, type: 'gumba' },
      { x: 650, y: 340, type: 'gumba' },
      { x: 570, y: 264, type: 'turtle' },
    ],
    coins: [
      { x: 170, y: 280 },
      { x: 270, y: 260 },
      { x: 370, y: 240 },
      { x: 470, y: 220 },
      { x: 570, y: 260 },
    ],
    surpriseBlocks: [
      { x: 200, y: 260, type: 'coin' },
      { x: 400, y: 220, type: 'mushroom' },
    ],
    pipes: [{ x: 750, y: 300 }],
  },
];

function initGame() {
  loadLevel(gameState.level - 1);
  gameLoop();
}

function loadLevel(levelIndex) {
  if (levelIndex >= levels.length) {
    showGameOver(true);
    return;
  }
  //clearing existing objects
  clearLevel();

  const level = levels[levelIndex];
  const gameArea = document.getElementById('game-area');

  //Reset player position
  player.x = 50;
  player.y = 340;
  player.velocityX = 0;
  player.velocityY = 0;
  player.big = false;
  player.bigTimer = 0;
  player.element.className = '';
  updateElementPosition(player.element, player.x, player.y);

  //Create platforms
  level.platforms.forEach((platformData, index) => {
    const platform = createElement('div', `platform ${platformData.type}`, {
      left: platformData.x + 'px',
      top: platformData.y + 'px',
      width: platformData.width + 'px',
      height: platformData.height + 'px',
    });
    gameArea.appendChild(platform);
    gameObjects.platforms.push({
      element: platform,
      ...platformData,
      id: 'platform-' + index,
    });
  });

  //Create enemies
  level.enemies.forEach((enemyData, index) => {
    const enemy = createElement('div', `enemy ${enemyData.type}`, {
      left: enemyData.x + 'px',
      top: enemyData.y + 'px',
    });
    gameArea.appendChild(enemy);
    gameObjects.enemies.push({
      element: enemy,
      ...enemyData,
      id: 'enemy-' + index,
      direction: -1,
      speed: ENEMY_SPEED,
      alaive: true,
    });
  });
  //Create coins
  level.coins.forEach((coinData, index) => {
    const coin = createElement('div', 'coin', {
      left: coinData.x + 'px',
      top: coinData.y + 'px',
    });
    gameArea.appendChild(coin);
    gameObjects.coins.push({
      element: coin,
      ...coinData,
      id: 'coin-' + index,
      collected: false,
    });
  });
  //Create surprise blocks
  level.surpriseBlocks.forEach((blockData, index) => {
    const block = createElement('div', 'surprise-block', {
      left: blockData.x + 'px',
      top: blockData.y + 'px',
    });
    gameArea.appendChild(block);
    gameObjects.surpriseBlocks.push({
      element: block,
      ...blockData,
      id: 'surprise-block-' + index,
      hit: false,
      type: blockData.type,
    });
  });
  //Create pipes
  level.pipes.forEach((pipeData, index) => {
    const pipe = createElement('div', 'pipe', {
      left: pipeData.x + 'px',
      top: pipeData.y + 'px',
    });
    gameArea.appendChild(pipe);
    gameObjects.pipes.push({
      element: pipe,
      ...pipeData,
      id: 'pipe-' + index,
    });
  });
}

function updateElementPosition(element, x, y) {
  element.style.top = y + 'px';
  element.style.left = x + 'px';
}

function createElement(type, className, styles = {}) {
  const element = document.createElement(type);
  element.className = className;
  Object.assign(element.style, styles);
  return element;
}
function showGameOver(won) {
  gameState.gameRunning = false;
  document.getElementById('game-over').textContent = won
    ? 'Congratulations! You won!'
    : 'Game over!';
  document.getElementById('final-score').textContent = gameState.score;
  document.getElementById('game').style.display = 'block';
}

function clearLevel() {
  //const gameArea = document.getElementById('game-area')
  Object.values(gameObjects)
    .flat()
    .forEach((obj) => {
      if (obj.element && obj.element.parentNode) {
        obj.element.remove();
      }
    });
  gameObjects = {
    platforms: [],
    enemies: [],
    coins: [],
    surpriseBlocks: [],
    pipes: [],
  };
}

//Input handling
document.addEventListener('keydown', (e) => {
  gameState.keys[e.code] = true;
  if (e.code === 'Space') {
    e.preventDefault();
  }
});
document.addEventListener('keyup', (e) => {
  gameState.keys[e.code] = false;
});

function gameLoop() {
  if (!gameState.gameRunning) return;
  update();
  requestAnimationFrame(gameLoop);
}

//Update game logic
function update() {
  console.log(gameState.keys);
  //Handle player movement
  if (gameState.keys['ArrowLeft'] || gameState.keys['KeyA']) {
    player.velocityX = -MOVE_SPEED;
  } else if (gameState.keys['ArrowRight'] || gameState.keys['KeyD']) {
    player.velocityX = MOVE_SPEED;
  } else {
    player.velocityX *= 0.8;
  }
  if (gameState.keys['Space'] && player.grounded) {
    player.velocityY = JUMP_FORCE;
    player.grounded = false;
  }
  if (!player.grounded) {
    player.velocityY += GRAVITY;
  }
  player.x += player.velocityX;
  player.y += player.velocityY;

  //platform collision detection
  player.grounded = false;
  for (let platform of gameObjects.platforms) {
    if (checkColision(player, platform)) {
      if (player.velocityY > 0) {
        player.y = platform.y - player.height;
        player.velocityY = 0;
        player.grounded = true;
      }
    }
  }
  updateElementPosition(player.element, player.x, player.y);
}

function checkColision(element1, element2) {
  // Implementation for collision detection
  return (
    element1.x < element2.x + element2.width &&
    element1.x + element1.width > element2.x &&
    element1.y < element2.y + element2.height &&
    element1.y + element1.height > element2.y
  );
}

//Start the game
initGame();
