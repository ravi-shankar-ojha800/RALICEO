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
        
        // Remove any existing error class
        elements.playerNameInput.classList.remove('error');
        
        // Validate name is not empty
        if (!name) {
            elements.playerNameInput.classList.add('error');
            elements.playerNameInput.focus();
            // Remove error class after animation
            setTimeout(() => {
                elements.playerNameInput.classList.remove('error');
            }, 500);
            return;
        }
        
        gameState.playerName = name;
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
        case 'mumario':
            startMumario();
            break;
        case 'flappybird':
            startFlappyBird();
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

// ==================== GAME 3: MUMARIO (IMPROVED) ====================

let mumario = { x: 100, y: 0, width: 30, height: 40, velocityX: 0, velocityY: 0, isJumping: false, isOnGround: true };
let mumarioPlatforms = [];
let mumarioCoins = [];
let mumarioEnemies = [];
let mumarioCameraX = 0;
let mumarioLevelWidth = 4000;
let mumarioParticles = [];

function startMumario() {
    const groundY = elements.canvas.height - 80;
    mumario.y = groundY - mumario.height;
    mumario.x = 100;
    mumario.velocityX = 0;
    mumario.velocityY = 0;
    mumario.isJumping = false;
    mumarioCameraX = 0;
    mumarioParticles = [];
    
    // Create platforms with better design
    mumarioPlatforms = [
        { x: 0, y: groundY, width: 600, height: 80, type: 'ground' },
        { x: 700, y: groundY - 80, width: 150, height: 20, type: 'brick' },
        { x: 950, y: groundY - 160, width: 120, height: 20, type: 'brick' },
        { x: 1200, y: groundY - 80, width: 180, height: 20, type: 'brick' },
        { x: 1500, y: groundY - 200, width: 150, height: 20, type: 'brick' },
        { x: 1750, y: groundY - 120, width: 120, height: 20, type: 'brick' },
        { x: 2000, y: groundY - 180, width: 200, height: 20, type: 'brick' },
        { x: 2300, y: groundY - 100, width: 150, height: 20, type: 'brick' },
        { x: 2550, y: groundY - 220, width: 180, height: 20, type: 'brick' },
        { x: 2850, y: groundY - 140, width: 150, height: 20, type: 'brick' },
        { x: 3100, y: groundY - 80, width: 200, height: 20, type: 'brick' },
        { x: 3400, y: groundY - 160, width: 150, height: 20, type: 'brick' },
        { x: 3650, y: groundY, width: 500, height: 80, type: 'ground' }
    ];
    
    // Create more coins with better placement
    mumarioCoins = [];
    const coinPositions = [
        { x: 750, y: groundY - 150 },
        { x: 850, y: groundY - 150 },
        { x: 1000, y: groundY - 230 },
        { x: 1100, y: groundY - 150 },
        { x: 1250, y: groundY - 150 },
        { x: 1400, y: groundY - 80 },
        { x: 1550, y: groundY - 270 },
        { x: 1650, y: groundY - 200 },
        { x: 1800, y: groundY - 250 },
        { x: 1950, y: groundY - 180 },
        { x: 2100, y: groundY - 250 },
        { x: 2250, y: groundY - 170 },
        { x: 2350, y: groundY - 170 },
        { x: 2600, y: groundY - 290 },
        { x: 2750, y: groundY - 210 },
        { x: 2900, y: groundY - 150 },
        { x: 3050, y: groundY - 150 },
        { x: 3150, y: groundY - 150 },
        { x: 3450, y: groundY - 230 },
        { x: 3600, y: groundY - 80 }
    ];
    
    coinPositions.forEach(pos => {
        mumarioCoins.push({ x: pos.x, y: pos.y, collected: false, animOffset: Math.random() * Math.PI * 2 });
    });
    
    // Create enemies
    mumarioEnemies = [
        { x: 800, y: groundY - 35, width: 30, height: 30, direction: 1, speed: 2, alive: true },
        { x: 1300, y: groundY - 35, width: 30, height: 30, direction: 1, speed: 2.5, alive: true },
        { x: 2100, y: groundY - 35, width: 30, height: 30, direction: -1, speed: 3, alive: true },
        { x: 2600, y: groundY - 35, width: 30, height: 30, direction: 1, speed: 2, alive: true },
        { x: 3200, y: groundY - 35, width: 30, height: 30, direction: -1, speed: 2.5, alive: true }
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
    
    // Horizontal movement with acceleration
    if (window.mumarioKeys.left) {
        mumario.velocityX = Math.max(mumario.velocityX - 0.5, -6);
    } else if (window.mumarioKeys.right) {
        mumario.velocityX = Math.min(mumario.velocityX + 0.5, 6);
    } else {
        mumario.velocityX *= 0.85;
    }
    
    mumario.x += mumario.velocityX;
    
    // Camera follow with smooth lerp
    const targetCameraX = mumario.x - elements.canvas.width / 3;
    mumarioCameraX += (Math.max(0, Math.min(targetCameraX, mumarioLevelWidth - elements.canvas.width)) - mumarioCameraX) * 0.1;
    
    // Gravity
    mumario.velocityY += 0.6;
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
        gameState.score += 1000;
        gameOver();
        return;
    }
    
    // Coin collection with particle effect
    mumarioCoins.forEach(coin => {
        if (!coin.collected &&
            mumario.x < coin.x + 20 &&
            mumario.x + mumario.width > coin.x &&
            mumario.y < coin.y + 20 &&
            mumario.y + mumario.height > coin.y) {
            coin.collected = true;
            gameState.score += 25;
            updateMumarioScore();
            // Create particles
            for (let i = 0; i < 8; i++) {
                mumarioParticles.push({
                    x: coin.x + 10,
                    y: coin.y + 10,
                    vx: (Math.random() - 0.5) * 8,
                    vy: (Math.random() - 0.5) * 8 - 3,
                    life: 1,
                    color: '#FFD700'
                });
            }
        }
    });
    
    // Update particles
    mumarioParticles = mumarioParticles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.3;
        p.life -= 0.03;
        return p.life > 0;
    });
    
    // Enemy movement and collision
    mumarioEnemies.forEach(enemy => {
        if (!enemy.alive) return;
        
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
            if (mumario.velocityY > 0 && mumario.y + mumario.height < enemy.y + enemy.height / 2) {
                // Kill enemy
                enemy.alive = false;
                gameState.score += 100;
                updateMumarioScore();
                mumario.velocityY = -12;
                // Enemy death particles
                for (let i = 0; i < 10; i++) {
                    mumarioParticles.push({
                        x: enemy.x + enemy.width / 2,
                        y: enemy.y + enemy.height / 2,
                        vx: (Math.random() - 0.5) * 10,
                        vy: (Math.random() - 0.5) * 10,
                        life: 1,
                        color: '#ff3131'
                    });
                }
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
    // Sky gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, elements.canvas.height);
    gradient.addColorStop(0, '#1a1a4e');
    gradient.addColorStop(0.5, '#2d2d6e');
    gradient.addColorStop(1, '#1a1a3e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, elements.canvas.width, elements.canvas.height);
    
    // Draw stars
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 50; i++) {
        const starX = (i * 137 + mumarioCameraX * 0.1) % elements.canvas.width;
        const starY = (i * 89) % (elements.canvas.height - 100);
        const size = (i % 3) + 1;
        ctx.globalAlpha = 0.3 + (i % 5) * 0.1;
        ctx.beginPath();
        ctx.arc(starX, starY, size, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1;
    
    ctx.save();
    ctx.translate(-mumarioCameraX, 0);
    
    // Platforms with better visuals
    mumarioPlatforms.forEach(plat => {
        if (plat.type === 'ground') {
            // Ground with grass
            ctx.fillStyle = '#2d5a27';
            ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
            ctx.fillStyle = '#4a9f3d';
            ctx.fillRect(plat.x, plat.y, plat.width, 8);
        } else {
            // Brick platforms
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
            ctx.fillStyle = '#A0522D';
            ctx.fillRect(plat.x + 2, plat.y + 2, plat.width - 4, 4);
            // Brick pattern
            ctx.strokeStyle = '#5D3A1A';
            ctx.lineWidth = 1;
            for (let bx = plat.x + 20; bx < plat.x + plat.width - 10; bx += 30) {
                ctx.beginPath();
                ctx.moveTo(bx, plat.y);
                ctx.lineTo(bx, plat.y + plat.height);
                ctx.stroke();
            }
        }
    });
    
    // Coins with animation
    const time = Date.now() / 200;
    mumarioCoins.forEach(coin => {
        if (!coin.collected) {
            const bobY = Math.sin(time + coin.animOffset) * 5;
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(coin.x + 10, coin.y + 10 + bobY, 10, 0, Math.PI * 2);
            ctx.fill();
            // Shine
            ctx.fillStyle = '#FFEC8B';
            ctx.beginPath();
            ctx.arc(coin.x + 7, coin.y + 7 + bobY, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#DAA520';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(coin.x + 10, coin.y + 10 + bobY, 10, 0, Math.PI * 2);
            ctx.stroke();
        }
    });
    
    // Enemies (Goomba-style)
    mumarioEnemies.forEach(enemy => {
        if (enemy.alive && enemy.y > -100) {
            // Body
            ctx.fillStyle = '#8B4513';
            ctx.beginPath();
            ctx.ellipse(enemy.x + enemy.width/2, enemy.y + enemy.height/2 + 5, enemy.width/2 + 3, enemy.height/2 - 2, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#A0522D';
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height - 5);
            // Eyes
            ctx.fillStyle = '#fff';
            ctx.fillRect(enemy.x + 4, enemy.y + 5, 8, 10);
            ctx.fillRect(enemy.x + 18, enemy.y + 5, 8, 10);
            ctx.fillStyle = '#000';
            ctx.fillRect(enemy.x + 6, enemy.y + 8, 4, 5);
            ctx.fillRect(enemy.x + 20, enemy.y + 8, 4, 5);
            // Feet animation
            const footOffset = Math.sin(Date.now() / 100) * 3;
            ctx.fillStyle = '#5D3A1A';
            ctx.fillRect(enemy.x + 2 + footOffset, enemy.y + enemy.height - 5, 8, 6);
            ctx.fillRect(enemy.x + 20 - footOffset, enemy.y + enemy.height - 5, 8, 6);
        }
    });
    
    // Player (Improved Mario-style)
    // Body
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(mumario.x + 2, mumario.y + 12, 26, 22);
    // Hat
    ctx.fillStyle = '#cc0000';
    ctx.fillRect(mumario.x - 3, mumario.y, mumario.width + 6, 14);
    // Face
    ctx.fillStyle = '#FFDAB9';
    ctx.fillRect(mumario.x + 8, mumario.y + 10, 18, 12);
    // Eye
    ctx.fillStyle = '#000';
    ctx.fillRect(mumario.x + 20, mumario.y + 12, 5, 5);
    // Mustache
    ctx.fillStyle = '#4a3020';
    ctx.fillRect(mumario.x + 18, mumario.y + 20, 10, 3);
    // Overalls
    ctx.fillStyle = '#0066cc';
    ctx.fillRect(mumario.x + 4, mumario.y + 20, 22, 14);
    ctx.fillStyle = '#0055aa';
    ctx.fillRect(mumario.x + 2, mumario.y + 22, 6, 12);
    ctx.fillRect(mumario.x + 22, mumario.y + 22, 6, 12);
    // Shoes
    ctx.fillStyle = '#4a3020';
    ctx.fillRect(mumario.x - 2, mumario.y + 34, 12, 8);
    ctx.fillRect(mumario.x + 20, mumario.y + 34, 12, 8);
    
    // Particles
    mumarioParticles.forEach(p => {
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.globalAlpha = 1;
    
    ctx.restore();
    
    // Ground line with glow
    ctx.shadowColor = '#39ff14';
    ctx.shadowBlur = 10;
    ctx.strokeStyle = '#39ff14';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, elements.canvas.height - 80);
    ctx.lineTo(elements.canvas.width, elements.canvas.height - 80);
    ctx.stroke();
    ctx.shadowBlur = 0;
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

// ==================== GAME 4: FLAPPY BIRD (IMPROVED) ====================

let flappyBird = { x: 0, y: 0, velocity: 0, radius: 18 };
let flappyPipes = [];
let flappyPassedPipes = 0;
let flappySpeed = 3;
let flappyGravity = 0.25;
let flappyParticles = [];
let flappyClouds = [];
let flappyBonusRings = [];

function startFlappyBird() {
    flappyBird.x = elements.canvas.width / 3;
    flappyBird.y = elements.canvas.height / 2;
    flappyBird.velocity = 0;
    flappyPipes = [];
    flappyPassedPipes = 0;
    flappySpeed = 3;
    flappyParticles = [];
    flappyBonusRings = [];
    
    // Create clouds
    flappyClouds = [];
    for (let i = 0; i < 8; i++) {
        flappyClouds.push({
            x: Math.random() * elements.canvas.width * 2,
            y: 30 + Math.random() * 150,
            width: 60 + Math.random() * 40,
            speed: 0.5 + Math.random() * 0.5
        });
    }
    
    gameState.score = 0;
    updateFlappyScore();
    gameState.gameLoop = requestAnimationFrame(updateFlappyBird);
}

function updateFlappyBird() {
    if (!gameState.isPlaying || gameState.currentGame !== 'flappybird') return;
    
    // Apply gravity
    flappyBird.velocity += flappyGravity;
    flappyBird.y += flappyBird.velocity;
    
    // Update clouds
    flappyClouds.forEach(cloud => {
        cloud.x -= cloud.speed;
        if (cloud.x + cloud.width < 0) {
            cloud.x = elements.canvas.width + Math.random() * 200;
            cloud.y = 30 + Math.random() * 150;
        }
    });
    
    // Spawn pipes
    if (flappyPipes.length === 0 || elements.canvas.width - flappyPipes[flappyPipes.length - 1].x > 220) {
        const gap = 130 + Math.random() * 30;
        const minHeight = 80;
        const maxHeight = elements.canvas.height - 150 - gap;
        const pipeHeight = minHeight + Math.random() * (maxHeight - minHeight);
        
        flappyPipes.push({
            x: elements.canvas.width,
            topHeight: pipeHeight,
            bottomY: pipeHeight + gap,
            passed: false,
            hasBonus: Math.random() > 0.7,
            bonusCollected: false
        });
    }
    
    // Update pipes
    for (let i = flappyPipes.length - 1; i >= 0; i--) {
        flappyPipes[i].x -= flappySpeed;
        
        // Check if passed
        if (!flappyPipes[i].passed && flappyPipes[i].x + 60 < flappyBird.x) {
            flappyPipes[i].passed = true;
            flappyPassedPipes++;
            gameState.score += 1;
            updateFlappyScore();
            
            if (flappyPassedPipes % 5 === 0) {
                flappySpeed += 0.2;
            }
        }
        
        // Collision detection with pipes
        const pipe = flappyPipes[i];
        if (flappyBird.x + flappyBird.radius > pipe.x &&
            flappyBird.x - flappyBird.radius < pipe.x + 60) {
            if (flappyBird.y - flappyBird.radius < pipe.topHeight ||
                flappyBird.y + flappyBird.radius > pipe.bottomY) {
                gameOver();
                return;
            }
        }
        
        // Bonus ring collision
        if (pipe.hasBonus && !pipe.bonusCollected) {
            const ringX = pipe.x + 30;
            const ringY = (pipe.topHeight + pipe.bottomY) / 2;
            const dist = Math.sqrt(Math.pow(flappyBird.x - ringX, 2) + Math.pow(flappyBird.y - ringY, 2));
            if (dist < flappyBird.radius + 15) {
                pipe.bonusCollected = true;
                gameState.score += 3;
                updateFlappyScore();
                // Create bonus particles
                for (let j = 0; j < 12; j++) {
                    flappyParticles.push({
                        x: ringX,
                        y: ringY,
                        vx: (Math.random() - 0.5) * 8,
                        vy: (Math.random() - 0.5) * 8,
                        life: 1,
                        color: '#00ffff'
                    });
                }
            }
        }
        
        // Remove off-screen pipes
        if (pipe.x < -70) {
            flappyPipes.splice(i, 1);
        }
    }
    
    // Update particles
    flappyParticles = flappyParticles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.03;
        return p.life > 0;
    });
    
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
    // Sky gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, elements.canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(0.5, '#E0F6FF');
    gradient.addColorStop(1, '#87CEEB');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, elements.canvas.width, elements.canvas.height);
    
    // Draw clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    flappyClouds.forEach(cloud => {
        ctx.beginPath();
        ctx.ellipse(cloud.x, cloud.y, cloud.width / 2, cloud.width / 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(cloud.x - cloud.width / 4, cloud.y + 10, cloud.width / 3, cloud.width / 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(cloud.x + cloud.width / 4, cloud.y + 5, cloud.width / 3, cloud.width / 5, 0, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // Draw distant hills
    ctx.fillStyle = '#7CB342';
    ctx.beginPath();
    ctx.moveTo(0, elements.canvas.height - 50);
    for (let x = 0; x <= elements.canvas.width; x += 50) {
        ctx.lineTo(x, elements.canvas.height - 80 - Math.sin(x / 100) * 30);
    }
    ctx.lineTo(elements.canvas.width, elements.canvas.height - 50);
    ctx.fill();
    
    // Ground
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, elements.canvas.height - 50, elements.canvas.width, 50);
    ctx.fillStyle = '#A0522D';
    ctx.fillRect(0, elements.canvas.height - 50, elements.canvas.width, 8);
    // Ground pattern
    ctx.fillStyle = '#654321';
    for (let x = 0; x < elements.canvas.width; x += 30) {
        ctx.fillRect(x, elements.canvas.height - 40, 20, 4);
    }
    
    // Pipes with improved visuals
    flappyPipes.forEach(pipe => {
        // Top pipe
        ctx.fillStyle = '#228B22';
        ctx.fillRect(pipe.x, 0, 60, pipe.topHeight);
        ctx.fillStyle = '#32CD32';
        ctx.fillRect(pipe.x + 5, 0, 50, pipe.topHeight - 15);
        // Pipe cap
        ctx.fillStyle = '#1B5E20';
        ctx.fillRect(pipe.x - 5, pipe.topHeight - 20, 70, 25);
        
        // Bottom pipe
        ctx.fillStyle = '#228B22';
        ctx.fillRect(pipe.x, pipe.bottomY, 60, elements.canvas.height - pipe.bottomY - 50);
        ctx.fillStyle = '#32CD32';
        ctx.fillRect(pipe.x + 5, pipe.bottomY + 15, 50, elements.canvas.height - pipe.bottomY - 60);
        // Pipe cap
        ctx.fillStyle = '#1B5E20';
        ctx.fillRect(pipe.x - 5, pipe.bottomY - 5, 70, 25);
        
        // Bonus ring
        if (pipe.hasBonus && !pipe.bonusCollected) {
            const ringY = (pipe.topHeight + pipe.bottomY) / 2;
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(pipe.x + 30, ringY, 15, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = 'rgba(0, 255, 255, 0.3)';
            ctx.beginPath();
            ctx.arc(pipe.x + 30, ringY, 15, 0, Math.PI * 2);
            ctx.fill();
        }
    });
    
    // Draw particles
    flappyParticles.forEach(p => {
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.globalAlpha = 1;
    
    // Bird with improved visuals
    const wingFlap = Math.sin(Date.now() / 50) * 0.3;
    
    // Body
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(flappyBird.x, flappyBird.y, flappyBird.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Wing (animated)
    ctx.fillStyle = '#FFA500';
    ctx.beginPath();
    ctx.ellipse(flappyBird.x - 5, flappyBird.y + 5 + wingFlap * 10, 10, 6, wingFlap, 0, Math.PI * 2);
    ctx.fill();
    
    // Eye white
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(flappyBird.x + 6, flappyBird.y - 5, 7, 0, Math.PI * 2);
    ctx.fill();
    
    // Eye pupil
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(flappyBird.x + 8, flappyBird.y - 5, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Eye highlight
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(flappyBird.x + 7, flappyBird.y - 7, 1.5, 0, Math.PI * 2);
    ctx.fill();
    
    // Beak
    ctx.fillStyle = '#FF6600';
    ctx.beginPath();
    ctx.moveTo(flappyBird.x + 12, flappyBird.y);
    ctx.lineTo(flappyBird.x + 25, flappyBird.y + 4);
    ctx.lineTo(flappyBird.x + 12, flappyBird.y + 8);
    ctx.fill();
    
    // Beak highlight
    ctx.fillStyle = '#FFA500';
    ctx.beginPath();
    ctx.moveTo(flappyBird.x + 12, flappyBird.y + 1);
    ctx.lineTo(flappyBird.x + 20, flappyBird.y + 3);
    ctx.lineTo(flappyBird.x + 12, flappyBird.y + 5);
    ctx.fill();
    
    // Tail
    ctx.fillStyle = '#FFA500';
    ctx.beginPath();
    ctx.moveTo(flappyBird.x - 15, flappyBird.y);
    ctx.lineTo(flappyBird.x - 25, flappyBird.y - 8);
    ctx.lineTo(flappyBird.x - 22, flappyBird.y);
    ctx.lineTo(flappyBird.x - 25, flappyBird.y + 8);
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
