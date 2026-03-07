// ==================== RALICEO - Mobile Game Hub ====================

// Game State
const gameState = {
    playerName: 'Player',
    currentGame: null,
    score: 0,
    isPlaying: false,
    gameLoop: null
};

// DOM Elements
const screens = {
    orientation: document.getElementById('orientation-warning'),
    loading: document.getElementById('loading-screen'),
    home: document.getElementById('home-screen'),
    name: document.getElementById('name-screen'),
    menu: document.getElementById('menu-screen'),
    game: document.getElementById('game-container'),
    gameover: document.getElementById('gameover-screen')
};

const elements = {
    enterBtn: document.getElementById('enter-btn'),
    continueBtn: document.getElementById('continue-btn'),
    playerNameInput: document.getElementById('player-name'),
    displayName: document.getElementById('display-name'),
    retryBtn: document.getElementById('retry-btn'),
    menuBtn: document.getElementById('menu-btn'),
    canvas: document.getElementById('game-canvas'),
    scoreDisplay: document.getElementById('score-display'),
    gameInfo: document.getElementById('game-info'),
    finalScore: document.getElementById('final-score'),
    gameCards: document.querySelectorAll('.game-card')
};

// Canvas Context
const ctx = elements.canvas.getContext('2d');

// ==================== INITIALIZATION ====================

function init() {
    setupCanvas();
    setupEventListeners();
    checkOrientation();
    showScreen('loading');
    
    // Create ambient particles for screens
    createAmbientParticles('home-particles');
    createAmbientParticles('menu-particles');
    
    // Simulate loading
    setTimeout(() => {
        showScreen('home');
    }, 2500);
}

function setupCanvas() {
    elements.canvas.width = window.innerWidth;
    elements.canvas.height = window.innerHeight;
    
    window.addEventListener('resize', () => {
        elements.canvas.width = window.innerWidth;
        elements.canvas.height = window.innerHeight;
        
        if (gameState.currentGame) {
            resetCurrentGame();
        }
    });
}

function setupEventListeners() {
    // Button clicks
    elements.enterBtn.addEventListener('click', () => {
        createParticles(event);
        playClickSound();
        showScreen('name');
    });

    elements.continueBtn.addEventListener('click', () => {
        const name = elements.playerNameInput.value.trim();
        gameState.playerName = name || 'Player';
        elements.displayName.textContent = gameState.playerName;
        createParticles(event);
        playClickSound();
        showScreen('menu');
    });

    elements.retryBtn.addEventListener('click', () => {
        createParticles(event);
        playClickSound();
        showScreen('game');
        resetCurrentGame();
        startCurrentGame();
    });

    elements.menuBtn.addEventListener('click', () => {
        createParticles(event);
        playClickSound();
        gameState.currentGame = null;
        gameState.score = 0;
        showScreen('menu');
    });

    // Game card clicks
    elements.gameCards.forEach(card => {
        card.addEventListener('click', () => {
            const game = card.dataset.game;
            createParticles(event);
            playClickSound();
            startGame(game);
        });
    });

    // Keyboard controls for games
    document.addEventListener('keydown', handleKeyDown);
    
    // Touch controls for mobile
    elements.canvas.addEventListener('touchstart', handleTouchStart);
    elements.canvas.addEventListener('touchend', handleTouchEnd);
}

// ==================== SCREEN NAVIGATION ====================

function showScreen(screenName) {
    Object.values(screens).forEach(screen => {
        screen.classList.add('hidden');
    });
    
    screens[screenName].classList.remove('hidden');
    screens[screenName].classList.add('screen-enter');
    
    setTimeout(() => {
        screens[screenName].classList.remove('screen-enter');
    }, 500);
}

// ==================== ORIENTATION DETECTION ====================

function checkOrientation() {
    if (window.innerHeight > window.innerWidth) {
        screens.orientation.style.display = 'flex';
    } else {
        screens.orientation.style.display = 'none';
    }
}

window.addEventListener('orientationchange', checkOrientation);
window.addEventListener('resize', checkOrientation);

// ==================== SOUND EFFECTS ====================

function playClickSound() {
    // Placeholder for click sound - can be added later
}

function playGameOverSound() {
    // Placeholder for game over sound - can be added later
}

// ==================== PARTICLE EFFECTS ====================

function createParticles(event) {
    const x = event.clientX || event.touches?.[0]?.clientX || window.innerWidth / 2;
    const y = event.clientY || event.touches?.[0]?.clientY || window.innerHeight / 2;
    
    for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = Math.random() * 10 + 5 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = `hsl(${Math.random() * 360}, 100%, 50%)`;
        particle.style.boxShadow = `0 0 10px ${particle.style.background}`;
        
        document.body.appendChild(particle);
        
        setTimeout(() => particle.remove(), 1000);
    }
}

// Ambient particles for background atmosphere
function createAmbientParticles(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'ambient-particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (15 + Math.random() * 10) + 's';
        container.appendChild(particle);
    }
}

// ==================== GAME MANAGEMENT ====================

function startGame(gameName) {
    gameState.currentGame = gameName;
    gameState.score = 0;
    showScreen('game');
    
    resetCurrentGame();
    startCurrentGame();
}

function resetCurrentGame() {
    if (gameState.gameLoop) {
        cancelAnimationFrame(gameState.gameLoop);
    }
    
    ctx.clearRect(0, 0, elements.canvas.width, elements.canvas.height);
}

function startCurrentGame() {
    gameState.isPlaying = true;
    elements.scoreDisplay.classList.remove('hidden');
    elements.gameInfo.classList.add('hidden');
    
    switch (gameState.currentGame) {
        case 'chess':
            startChess();
            break;
        case 'dino':
            startDino();
            break;
        case 'mumario':
            startMumario();
            break;
        case 'flappybird':
            startFlappyBird();
            break;
        case 'snake':
            startSnake();
            break;
    }
}

function gameOver() {
    gameState.isPlaying = false;
    
    if (gameState.gameLoop) {
        cancelAnimationFrame(gameState.gameLoop);
    }
    
    playGameOverSound();
    elements.finalScore.textContent = `Score: ${gameState.score}`;
    showScreen('gameover');
}

// ==================== KEYBOARD & TOUCH HANDLERS ====================

function handleKeyDown(event) {
    if (!gameState.isPlaying) return;
    
    switch (gameState.currentGame) {
        case 'snake':
            handleSnakeKey(event);
            break;
        case 'dino':
            if (event.code === 'Space' || event.code === 'ArrowUp') {
                dinoJump();
            }
            break;
        case 'flappybird':
            if (event.code === 'Space' || event.code === 'ArrowUp' || event.code === 'Enter') {
                flappyFlap();
            }
            break;
        case 'mumario':
            handleMumarioKey(event);
            break;
    }
}

function handleTouchStart(event) {
    if (!gameState.isPlaying) return;
    event.preventDefault();
    
    switch (gameState.currentGame) {
        case 'dino':
            dinoJump();
            break;
        case 'flappybird':
            flappyFlap();
            break;
        case 'mumario':
            mumarioJump();
            break;
    }
}

function handleTouchEnd(event) {
    // Handle touch end if needed
}

// ==================== GAME 1: CHESS ====================

let chessBoard = [];
let chessSelectedPiece = null;
let chessCurrentPlayer = 'white';
let chessPieces = {
    'white': { king: '♔', queen: '♕', rook: '♖', bishop: '♗', knight: '♘', pawn: '♙' },
    'black': { king: '♚', queen: '♛', rook: '♜', bishop: '♝', knight: '♞', pawn: '♟' }
};

function startChess() {
    elements.scoreDisplay.classList.add('hidden');
    elements.gameInfo.classList.remove('hidden');
    elements.gameInfo.textContent = `${chessCurrentPlayer === 'white' ? 'White' : 'Black'}'s Turn`;
    
    // Initialize board
    chessBoard = [
        ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'],
        ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
        ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr']
    ];
    
    chessCurrentPlayer = 'white';
    chessSelectedPiece = null;
    
    drawChess();
    gameState.gameLoop = requestAnimationFrame(updateChess);
}

function updateChess() {
    if (!gameState.isPlaying || gameState.currentGame !== 'chess') return;
    drawChess();
    gameState.gameLoop = requestAnimationFrame(updateChess);
}

function drawChess() {
    const cellSize = Math.min(elements.canvas.width, elements.canvas.height) / 8;
    const offsetX = (elements.canvas.width - cellSize * 8) / 2;
    const offsetY = (elements.canvas.height - cellSize * 8) / 2;
    
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, elements.canvas.width, elements.canvas.height);
    
    // Draw board
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const x = offsetX + col * cellSize;
            const y = offsetY + row * cellSize;
            
            ctx.fillStyle = (row + col) % 2 === 0 ? '#4a4a6a' : '#2a2a4a';
            ctx.fillRect(x, y, cellSize, cellSize);
            
            // Draw piece
            const piece = chessBoard[row][col];
            if (piece) {
                const color = piece[0] === 'w' ? 'white' : 'black';
                const type = piece[1];
                const symbol = chessPieces[color][type];
                
                ctx.font = `${cellSize * 0.7}px Arial`;
                ctx.fillStyle = color === 'white' ? '#ffffff' : '#000000';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(symbol, x + cellSize / 2, y + cellSize / 2);
                
                // Highlight selected piece
                if (chessSelectedPiece && chessSelectedPiece.row === row && chessSelectedPiece.col === col) {
                    ctx.strokeStyle = '#00f5ff';
                    ctx.lineWidth = 3;
                    ctx.strokeRect(x + 2, y + 2, cellSize - 4, cellSize - 4);
                }
            }
        }
    }
    
    // Click handler for chess (using canvas click)
    elements.canvas.onclick = (e) => {
        const rect = elements.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const col = Math.floor((x - offsetX) / cellSize);
        const row = Math.floor((y - offsetY) / cellSize);
        
        if (row >= 0 && row < 8 && col >= 0 && col < 8) {
            handleChessClick(row, col);
        }
    };
}

function handleChessClick(row, col) {
    const piece = chessBoard[row][col];
    const pieceColor = piece ? (piece[0] === 'w' ? 'white' : 'black') : null;
    
    if (chessSelectedPiece) {
        // Try to move
        if (isValidChessMove(chessSelectedPiece.row, chessSelectedPiece.col, row, col)) {
            chessBoard[row][col] = chessBoard[chessSelectedPiece.row][chessSelectedPiece.col];
            chessBoard[chessSelectedPiece.row][chessSelectedPiece.col] = '';
            chessCurrentPlayer = chessCurrentPlayer === 'white' ? 'black' : 'white';
            elements.gameInfo.textContent = `${chessCurrentPlayer === 'white' ? 'White' : 'Black'}'s Turn`;
        }
        chessSelectedPiece = null;
    } else if (piece && pieceColor === chessCurrentPlayer) {
        // Select piece
        chessSelectedPiece = { row, col };
    }
}

function isValidChessMove(fromRow, fromCol, toRow, toCol) {
    const piece = chessBoard[fromRow][fromCol];
    if (!piece) return false;
    
    const type = piece[1];
    const color = piece[0];
    const target = chessBoard[toRow][toCol];
    
    if (target && target[0] === color) return false;
    
    const rowDiff = toRow - fromRow;
    const colDiff = toCol - fromCol;
    
    switch (type) {
        case 'p': // Pawn
            const direction = color === 'w' ? -1 : 1;
            if (colDiff === 0 && !target) {
                if (rowDiff === direction) return true;
                if (rowDiff === 2 * direction && fromRow === (color === 'w' ? 6 : 1) && !chessBoard[fromRow + direction][fromCol]) return true;
            }
            if (Math.abs(colDiff) === 1 && rowDiff === direction && target) return true;
            return false;
        case 'r': // Rook
            return (rowDiff === 0 || colDiff === 0) && !isPathBlocked(fromRow, fromCol, toRow, toCol);
        case 'n': // Knight
            return (Math.abs(rowDiff) === 2 && Math.abs(colDiff) === 1) || (Math.abs(rowDiff) === 1 && Math.abs(colDiff) === 2);
        case 'b': // Bishop
            return Math.abs(rowDiff) === Math.abs(colDiff) && !isPathBlocked(fromRow, fromCol, toRow, toCol);
        case 'q': // Queen
            return (rowDiff === 0 || colDiff === 0 || Math.abs(rowDiff) === Math.abs(colDiff)) && !isPathBlocked(fromRow, fromCol, toRow, toCol);
        case 'k': // King
            return Math.abs(rowDiff) <= 1 && Math.abs(colDiff) <= 1;
        default:
            return false;
    }
}

function isPathBlocked(fromRow, fromCol, toRow, toCol) {
    const rowDir = Math.sign(toRow - fromRow);
    const colDir = Math.sign(toCol - fromCol);
    
    let r = fromRow + rowDir;
    let c = fromCol + colDir;
    
    while (r !== toRow || c !== toCol) {
        if (chessBoard[r][c]) return true;
        r += rowDir;
        c += colDir;
    }
    
    return false;
}

// ==================== GAME 2: CHROME DINO ====================

let dino = { x: 100, y: 0, width: 40, height: 50, velocityY: 0, isJumping: false };
let dinoObstacles = [];
let dinoScore = 0;
let dinoSpeed = 5;
let dinoGroundY = 0;

function startDino() {
    dinoGroundY = elements.canvas.height - 100;
    dino.y = dinoGroundY - dino.height;
    dinoObstacles = [];
    dinoScore = 0;
    dinoSpeed = 5;
    dino.velocityY = 0;
    dino.isJumping = false;
    
    updateDinoScore();
    gameState.gameLoop = requestAnimationFrame(updateDino);
}

function updateDino() {
    if (!gameState.isPlaying || gameState.currentGame !== 'dino') return;
    
    // Update dino
    if (dino.isJumping) {
        dino.velocityY += 0.8;
        dino.y += dino.velocityY;
        
        if (dino.y >= dinoGroundY - dino.height) {
            dino.y = dinoGroundY - dino.height;
            dino.isJumping = false;
            dino.velocityY = 0;
        }
    }
    
    // Spawn obstacles
    if (Math.random() < 0.02) {
        const height = 40 + Math.random() * 30;
        dinoObstacles.push({
            x: elements.canvas.width,
            y: dinoGroundY - height,
            width: 25,
            height: height
        });
    }
    
    // Update obstacles
    for (let i = dinoObstacles.length - 1; i >= 0; i--) {
        dinoObstacles[i].x -= dinoSpeed;
        
        // Collision detection
        if (dino.x < dinoObstacles[i].x + dinoObstacles[i].width &&
            dino.x + dino.width > dinoObstacles[i].x &&
            dino.y < dinoObstacles[i].y + dinoObstacles[i].height &&
            dino.y + dino.height > dinoObstacles[i].y) {
            gameOver();
            return;
        }
        
        if (dinoObstacles[i].x < -50) {
            dinoObstacles.splice(i, 1);
            dinoScore++;
            gameState.score = dinoScore;
            updateDinoScore();
            
            if (dinoScore % 5 === 0) {
                dinoSpeed += 0.5;
            }
        }
    }
    
    // Draw
    drawDino();
    gameState.gameLoop = requestAnimationFrame(updateDino);
}

function drawDino() {
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, elements.canvas.width, elements.canvas.height);
    
    // Ground
    ctx.strokeStyle = '#00f5ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, dinoGroundY);
    ctx.lineTo(elements.canvas.width, dinoGroundY);
    ctx.stroke();
    
    // Dino
    ctx.fillStyle = '#39ff14';
    ctx.fillRect(dino.x, dino.y, dino.width, dino.height);
    
    // Eye
    ctx.fillStyle = '#000';
    ctx.fillRect(dino.x + dino.width - 12, dino.y + 8, 6, 6);
    
    // Obstacles
    ctx.fillStyle = '#ff3131';
    dinoObstacles.forEach(obs => {
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    });
    
    // Clouds (decorative)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(elements.canvas.width - i * 200 - (dinoScore * 2) % 200, 80, 30, 0, Math.PI * 2);
        ctx.fill();
    }
}

function dinoJump() {
    if (!dino.isJumping) {
        dino.isJumping = true;
        dino.velocityY = -15;
    }
}

function updateDinoScore() {
    elements.scoreDisplay.textContent = `Score: ${dinoScore}`;
}

// ==================== GAME 3: MUMARIO ====================

let mumario = { x: 100, y: 0, width: 30, height: 40, velocityX: 0, velocityY: 0, isJumping: false, isOnGround: true };
let mumarioPlatforms = [];
let mumarioCoins = [];
let mumarioEnemies = [];
let mumarioCameraX = 0;
let mumarioLevelWidth = 3000;

function startMumario() {
    const groundY = elements.canvas.height - 80;
    mumario.y = groundY - mumario.height;
    mumario.x = 100;
    mumario.velocityX = 0;
    mumario.velocityY = 0;
    mumario.isJumping = false;
    mumarioCameraX = 0;
    
    // Create platforms
    mumarioPlatforms = [
        { x: 0, y: groundY, width: 500, height: 80 },
        { x: 600, y: groundY - 100, width: 200, height: 20 },
        { x: 900, y: groundY - 200, width: 150, height: 20 },
        { x: 1200, y: groundY - 100, width: 200, height: 20 },
        { x: 1500, y: groundY - 150, width: 150, height: 20 },
        { x: 1800, y: groundY - 250, width: 200, height: 20 },
        { x: 2100, y: groundY - 100, width: 300, height: 20 },
        { x: 2500, y: groundY, width: 600, height: 80 }
    ];
    
    // Create coins
    mumarioCoins = [];
    for (let i = 0; i < 15; i++) {
        mumarioCoins.push({
            x: 300 + i * 180 + Math.random() * 50,
            y: groundY - 100 - Math.random() * 150,
            collected: false
        });
    }
    
    // Create enemies
    mumarioEnemies = [
        { x: 700, y: groundY - 30, width: 30, height: 30, direction: 1, speed: 2 },
        { x: 1300, y: groundY - 30, width: 30, height: 30, direction: 1, speed: 3 },
        { x: 2200, y: groundY - 30, width: 30, height: 30, direction: -1, speed: 2 }
    ];
    
    gameState.score = 0;
    updateMumarioScore();
    
    // Input state
    window.mumarioKeys = { left: false, right: false };
    
    document.addEventListener('keydown', (e) => {
        if (e.code === 'ArrowLeft' || e.code === 'KeyA') window.mumarioKeys.left = true;
        if (e.code === 'ArrowRight' || e.code === 'KeyD') window.mumarioKeys.right = true;
    });
    
    document.addEventListener('keyup', (e) => {
        if (e.code === 'ArrowLeft' || e.code === 'KeyA') window.mumarioKeys.left = false;
        if (e.code === 'ArrowRight' || e.code === 'KeyD') window.mumarioKeys.right = false;
    });
    
    gameState.gameLoop = requestAnimationFrame(updateMumario);
}

function updateMumario() {
    if (!gameState.isPlaying || gameState.currentGame !== 'mumario') return;
    
    // Horizontal movement
    if (window.mumarioKeys.left) {
        mumario.velocityX = -5;
    } else if (window.mumarioKeys.right) {
        mumario.velocityX = 5;
    } else {
        mumario.velocityX *= 0.8;
    }
    
    mumario.x += mumario.velocityX;
    
    // Camera follow
    const targetCameraX = mumario.x - elements.canvas.width / 3;
    mumarioCameraX = Math.max(0, Math.min(targetCameraX, mumarioLevelWidth - elements.canvas.width));
    
    // Gravity
    mumario.velocityY += 0.5;
    mumario.y += mumario.velocityY;
    
    // Platform collision
    mumario.isOnGround = false;
    mumarioPlatforms.forEach(plat => {
        if (mumario.x + mumario.width > plat.x &&
            mumario.x < plat.x + plat.width &&
            mumario.y + mumario.height > plat.y &&
            mumario.y + mumario.height < plat.y + plat.height + 20 &&
            mumario.velocityY > 0) {
            mumario.y = plat.y - mumario.height;
            mumario.velocityY = 0;
            mumario.isOnGround = true;
            mumario.isJumping = false;
        }
    });
    
    // Ground collision
    const groundY = elements.canvas.height - 80;
    if (mumario.y >= groundY - mumario.height) {
        mumario.y = groundY - mumario.height;
        mumario.velocityY = 0;
        mumario.isOnGround = true;
        mumario.isJumping = false;
    }
    
    // Wall boundaries
    if (mumario.x < 0) mumario.x = 0;
    if (mumario.x > mumarioLevelWidth - mumario.width) {
        // Level complete!
        gameState.score += 500;
        gameOver();
        return;
    }
    
    // Coin collection
    mumarioCoins.forEach(coin => {
        if (!coin.collected &&
            mumario.x < coin.x + 20 &&
            mumario.x + mumario.width > coin.x &&
            mumario.y < coin.y + 20 &&
            mumario.y + mumario.height > coin.y) {
            coin.collected = true;
            gameState.score += 10;
            updateMumarioScore();
        }
    });
    
    // Enemy movement and collision
    mumarioEnemies.forEach(enemy => {
        enemy.x += enemy.speed * enemy.direction;
        
        // Bounce off platforms
        const plat = mumarioPlatforms.find(p => 
            enemy.x + enemy.width > p.x && 
            enemy.x < p.x + p.width && 
            Math.abs(enemy.y + enemy.height - p.y) < 10
        );
        
        if (enemy.x <= 0 || enemy.x >= mumarioLevelWidth - enemy.width || plat) {
            enemy.direction *= -1;
        }
        
        // Collision with player
        if (mumario.x < enemy.x + enemy.width &&
            mumario.x + mumario.width > enemy.x &&
            mumario.y < enemy.y + enemy.height &&
            mumario.y + mumario.height > enemy.y) {
            // Mario dies if falling from above, otherwise jumps on head
            if (mumario.velocityY > 0 && mumario.y + mumario.height < enemy.y + enemy.height / 2) {
                // Kill enemy
                enemy.y = -1000;
                gameState.score += 50;
                updateMumarioScore();
                mumario.velocityY = -10; // Bounce
            } else {
                gameOver();
                return;
            }
        }
    });
    
    // Fall off screen
    if (mumario.y > elements.canvas.height) {
        gameOver();
        return;
    }
    
    drawMumario();
    gameState.gameLoop = requestAnimationFrame(updateMumario);
}

function drawMumario() {
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, elements.canvas.width, elements.canvas.height);
    
    ctx.save();
    ctx.translate(-mumarioCameraX, 0);
    
    // Platforms
    ctx.fillStyle = '#8B4513';
    mumarioPlatforms.forEach(plat => {
        ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
        // Grass on top
        ctx.fillStyle = '#39ff14';
        ctx.fillRect(plat.x, plat.y, plat.width, 5);
        ctx.fillStyle = '#8B4513';
    });
    
    // Coins
    ctx.fillStyle = '#FFD700';
    mumarioCoins.forEach(coin => {
        if (!coin.collected) {
            ctx.beginPath();
            ctx.arc(coin.x + 10, coin.y + 10, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#FFA500';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    });
    
    // Enemies
    ctx.fillStyle = '#ff3131';
    mumarioEnemies.forEach(enemy => {
        if (enemy.y > -100) {
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
            // Eyes
            ctx.fillStyle = '#fff';
            ctx.fillRect(enemy.x + 5, enemy.y + 5, 8, 8);
            ctx.fillRect(enemy.x + 18, enemy.y + 5, 8, 8);
            ctx.fillStyle = '#000';
            ctx.fillRect(enemy.x + 7, enemy.y + 7, 4, 4);
            ctx.fillRect(enemy.x + 20, enemy.y + 7, 4, 4);
            ctx.fillStyle = '#ff3131';
        }
    });
    
    // Player (Mario-style)
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(mumario.x, mumario.y, mumario.width, mumario.height);
    // Hat
    ctx.fillStyle = '#ff3131';
    ctx.fillRect(mumario.x - 5, mumario.y, mumario.width + 10, 10);
    // Face
    ctx.fillStyle = '#FFDAB9';
    ctx.fillRect(mumario.x + 5, mumario.y + 5, 20, 15);
    // Eye
    ctx.fillStyle = '#000';
    ctx.fillRect(mumario.x + 18, mumario.y + 8, 5, 5);
    
    ctx.restore();
    
    // Ground line
    ctx.strokeStyle = '#39ff14';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, elements.canvas.height - 80);
    ctx.lineTo(elements.canvas.width, elements.canvas.height - 80);
    ctx.stroke();
}

function mumarioJump() {
    if (mumario.isOnGround) {
        mumario.isJumping = true;
        mumario.velocityY = -12;
        mumario.isOnGround = false;
    }
}

function handleMumarioKey(event) {
    if (event.code === 'Space' || event.code === 'ArrowUp' || event.code === 'KeyW') {
        mumarioJump();
    }
}

function updateMumarioScore() {
    elements.scoreDisplay.textContent = `Score: ${gameState.score}`;
}

// ==================== GAME 4: FLAPPY BIRD ====================

let flappyBird = { x: 0, y: 0, velocity: 0, radius: 15 };
let flappyPipes = [];
let flappyPassedPipes = 0;
let flappySpeed = 3;
let flappyGravity = 0.25;

function startFlappyBird() {
    flappyBird.x = elements.canvas.width / 3;
    flappyBird.y = elements.canvas.height / 2;
    flappyBird.velocity = 0;
    flappyPipes = [];
    flappyPassedPipes = 0;
    flappySpeed = 3;
    gameState.score = 0;
    
    updateFlappyScore();
    gameState.gameLoop = requestAnimationFrame(updateFlappyBird);
}

function updateFlappyBird() {
    if (!gameState.isPlaying || gameState.currentGame !== 'flappybird') return;
    
    // Apply gravity
    flappyBird.velocity += flappyGravity;
    flappyBird.y += flappyBird.velocity;
    
    // Spawn pipes
    if (flappyPipes.length === 0 || elements.canvas.width - flappyPipes[flappyPipes.length - 1].x > 250) {
        const gap = 150;
        const pipeHeight = 100 + Math.random() * (elements.canvas.height - 300);
        
        flappyPipes.push({
            x: elements.canvas.width,
            topHeight: pipeHeight,
            bottomY: pipeHeight + gap,
            passed: false
        });
    }
    
    // Update pipes
    for (let i = flappyPipes.length - 1; i >= 0; i--) {
        flappyPipes[i].x -= flappySpeed;
        
        // Check if passed
        if (!flappyPipes[i].passed && flappyPipes[i].x + 60 < flappyBird.x) {
            flappyPipes[i].passed = true;
            flappyPassedPipes++;
            gameState.score = flappyPassedPipes;
            updateFlappyScore();
            
            if (flappyPassedPipes % 5 === 0) {
                flappySpeed += 0.3;
            }
        }
        
        // Collision detection
        const pipe = flappyPipes[i];
        if (flappyBird.x + flappyBird.radius > pipe.x &&
            flappyBird.x - flappyBird.radius < pipe.x + 60) {
            if (flappyBird.y - flappyBird.radius < pipe.topHeight ||
                flappyBird.y + flappyBird.radius > pipe.bottomY) {
                gameOver();
                return;
            }
        }
        
        // Remove off-screen pipes
        if (pipe.x < -70) {
            flappyPipes.splice(i, 1);
        }
    }
    
    // Ground/ceiling collision
    if (flappyBird.y + flappyBird.radius > elements.canvas.height - 50 ||
        flappyBird.y - flappyBird.radius < 0) {
        gameOver();
        return;
    }
    
    drawFlappyBird();
    gameState.gameLoop = requestAnimationFrame(updateFlappyBird);
}

function drawFlappyBird() {
    ctx.fillStyle = '#70c5ce';
    ctx.fillRect(0, 0, elements.canvas.width, elements.canvas.height);
    
    // Ground
    ctx.fillStyle = '#ded895';
    ctx.fillRect(0, elements.canvas.height - 50, elements.canvas.width, 50);
    ctx.fillStyle = '#73bf2e';
    ctx.fillRect(0, elements.canvas.height - 50, elements.canvas.width, 10);
    
    // Pipes
    ctx.fillStyle = '#73bf2e';
    flappyPipes.forEach(pipe => {
        // Top pipe
        ctx.fillRect(pipe.x, 0, 60, pipe.topHeight);
        ctx.fillStyle = '#558c22';
        ctx.fillRect(pipe.x + 5, 0, 50, pipe.topHeight - 10);
        ctx.fillStyle = '#73bf2e';
        
        // Bottom pipe
        ctx.fillRect(pipe.x, pipe.bottomY, 60, elements.canvas.height - pipe.bottomY - 50);
        ctx.fillStyle = '#558c22';
        ctx.fillRect(pipe.x + 5, pipe.bottomY + 10, 50, elements.canvas.height - pipe.bottomY - 60);
        ctx.fillStyle = '#73bf2e';
    });
    
    // Bird
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(flappyBird.x, flappyBird.y, flappyBird.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Eye
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(flappyBird.x + 5, flappyBird.y - 5, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(flappyBird.x + 7, flappyBird.y - 5, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Beak
    ctx.fillStyle = '#ff6600';
    ctx.beginPath();
    ctx.moveTo(flappyBird.x + 10, flappyBird.y);
    ctx.lineTo(flappyBird.x + 20, flappyBird.y + 3);
    ctx.lineTo(flappyBird.x + 10, flappyBird.y + 6);
    ctx.fill();
    
    // Wing
    ctx.fillStyle = '#ffaa00';
    ctx.beginPath();
    ctx.ellipse(flappyBird.x - 5, flappyBird.y + 3, 8, 5, 0, 0, Math.PI * 2);
    ctx.fill();
}

function flappyFlap() {
    flappyBird.velocity = -6;
}

function updateFlappyScore() {
    elements.scoreDisplay.textContent = `Score: ${gameState.score}`;
}

// ==================== GAME 5: SNAKE ====================

let snake = [];
let snakeDirection = { x: 1, y: 0 };
let snakeFood = { x: 0, y: 0 };
let snakeGridSize = 20;
let snakeLastMoveTime = 0;
let snakeMoveInterval = 150;

function startSnake() {
    const gridWidth = Math.floor(elements.canvas.width / snakeGridSize);
    const gridHeight = Math.floor(elements.canvas.height / snakeGridSize);
    
    snake = [
        { x: Math.floor(gridWidth / 2), y: Math.floor(gridHeight / 2) },
        { x: Math.floor(gridWidth / 2) - 1, y: Math.floor(gridHeight / 2) },
        { x: Math.floor(gridWidth / 2) - 2, y: Math.floor(gridHeight / 2) }
    ];
    
    snakeDirection = { x: 1, y: 0 };
    spawnSnakeFood();
    gameState.score = 0;
    snakeMoveInterval = 150;
    
    updateSnakeScore();
    gameState.gameLoop = requestAnimationFrame(updateSnake);
}

function updateSnake(timestamp) {
    if (!gameState.isPlaying || gameState.currentGame !== 'snake') return;
    
    if (timestamp - snakeLastMoveTime > snakeMoveInterval) {
        snakeLastMoveTime = timestamp;
        
        // Move snake
        const head = { x: snake[0].x + snakeDirection.x, y: snake[0].y + snakeDirection.y };
        
        // Check collision with walls
        const gridWidth = Math.floor(elements.canvas.width / snakeGridSize);
        const gridHeight = Math.floor(elements.canvas.height / snakeGridSize);
        
        if (head.x < 0 || head.x >= gridWidth || head.y < 0 || head.y >= gridHeight) {
            gameOver();
            return;
        }
        
        // Check collision with self
        for (let segment of snake) {
            if (head.x === segment.x && head.y === segment.y) {
                gameOver();
                return;
            }
        }
        
        snake.unshift(head);
        
        // Check food
        if (head.x === snakeFood.x && head.y === snakeFood.y) {
            gameState.score += 10;
            updateSnakeScore();
            spawnSnakeFood();
            
            // Speed up
            if (gameState.score % 50 === 0 && snakeMoveInterval > 80) {
                snakeMoveInterval -= 10;
            }
        } else {
            snake.pop();
        }
    }
    
    drawSnake();
    gameState.gameLoop = requestAnimationFrame(updateSnake);
}

function drawSnake() {
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, elements.canvas.width, elements.canvas.height);
    
    // Grid lines (subtle)
    ctx.strokeStyle = 'rgba(0, 245, 255, 0.1)';
    ctx.lineWidth = 1;
    
    const gridWidth = Math.floor(elements.canvas.width / snakeGridSize);
    const gridHeight = Math.floor(elements.canvas.height / snakeGridSize);
    
    for (let i = 0; i <= gridWidth; i++) {
        ctx.beginPath();
        ctx.moveTo(i * snakeGridSize, 0);
        ctx.lineTo(i * snakeGridSize, elements.canvas.height);
        ctx.stroke();
    }
    
    for (let i = 0; i <= gridHeight; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * snakeGridSize);
        ctx.lineTo(elements.canvas.width, i * snakeGridSize);
        ctx.stroke();
    }
    
    // Food
    ctx.fillStyle = '#ff3131';
    ctx.shadowColor = '#ff3131';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(
        snakeFood.x * snakeGridSize + snakeGridSize / 2,
        snakeFood.y * snakeGridSize + snakeGridSize / 2,
        snakeGridSize / 2 - 2,
        0,
        Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // Snake
    snake.forEach((segment, index) => {
        const gradient = ctx.createRadialGradient(
            segment.x * snakeGridSize + snakeGridSize / 2,
            segment.y * snakeGridSize + snakeGridSize / 2,
            0,
            segment.x * snakeGridSize + snakeGridSize / 2,
            segment.y * snakeGridSize + snakeGridSize / 2,
            snakeGridSize / 2
        );
        
        if (index === 0) {
            gradient.addColorStop(0, '#00f5ff');
            gradient.addColorStop(1, '#0088aa');
        } else {
            gradient.addColorStop(0, '#39ff14');
            gradient.addColorStop(1, '#228b22');
        }
        
        ctx.fillStyle = gradient;
        ctx.fillRect(
            segment.x * snakeGridSize + 1,
            segment.y * snakeGridSize + 1,
            snakeGridSize - 2,
            snakeGridSize - 2
        );
    });
    
    // Eyes on head
    ctx.fillStyle = '#fff';
    const head = snake[0];
    ctx.fillRect(head.x * snakeGridSize + 3, head.y * snakeGridSize + 4, 5, 5);
    ctx.fillRect(head.x * snakeGridSize + 12, head.y * snakeGridSize + 4, 5, 5);
    ctx.fillStyle = '#000';
    ctx.fillRect(head.x * snakeGridSize + 5, head.y * snakeGridSize + 6, 2, 2);
    ctx.fillRect(head.x * snakeGridSize + 14, head.y * snakeGridSize + 6, 2, 2);
}

function spawnSnakeFood() {
    const gridWidth = Math.floor(elements.canvas.width / snakeGridSize);
    const gridHeight = Math.floor(elements.canvas.height / snakeGridSize);
    
    let validPosition = false;
    while (!validPosition) {
        snakeFood = {
            x: Math.floor(Math.random() * gridWidth),
            y: Math.floor(Math.random() * gridHeight)
        };
        
        validPosition = !snake.some(segment => 
            segment.x === snakeFood.x && segment.y === snakeFood.y
        );
    }
}

function handleSnakeKey(event) {
    const currentDir = snakeDirection;
    
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            if (currentDir.y !== 1) {
                snakeDirection = { x: 0, y: -1 };
            }
            break;
        case 'ArrowDown':
        case 'KeyS':
            if (currentDir.y !== -1) {
                snakeDirection = { x: 0, y: 1 };
            }
            break;
        case 'ArrowLeft':
        case 'KeyA':
            if (currentDir.x !== 1) {
                snakeDirection = { x: -1, y: 0 };
            }
            break;
        case 'ArrowRight':
        case 'KeyD':
            if (currentDir.x !== -1) {
                snakeDirection = { x: 1, y: 0 };
            }
            break;
    }
}

function updateSnakeScore() {
    elements.scoreDisplay.textContent = `Score: ${gameState.score}`;
}

// ==================== START THE APP ====================

window.addEventListener('load', init);

