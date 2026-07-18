const dino = document.getElementById("dino");
const obstaclesContainer = document.getElementById("obstacles");
const jumpButton = document.getElementById("jumpButton");
const scoreSpan = document.getElementById("score");

let isJumping = false;
let score = 0;
let gameRunning = true;

// Dino springen
function jump() {
    if (!gameRunning || isJumping) return;

    isJumping = true;
    dino.style.bottom = "140px";

    setTimeout(() => {
        dino.style.bottom = "70px";
        isJumping = false;
    }, 450);
}

jumpButton.addEventListener("click", jump);

// Keyboard voor oudere kids
window.addEventListener("keydown", e => {
    if (e.key === " " || e.key === "ArrowUp") {
        jump();
    }
});

// Obstakels maken
function createObstacle() {
    if (!gameRunning) return;

    const obstacle = document.createElement("div");
    obstacle.className = "obstacle";
    obstacle.textContent = "🪨";

    obstaclesContainer.appendChild(obstacle);

    let pos = obstaclesContainer.clientWidth + 80;

    const speed = 4 + Math.random() * 2;

    const moveInterval = setInterval(() => {
        if (!gameRunning) {
            clearInterval(moveInterval);
            obstacle.remove();
            return;
        }

        pos -= speed;
        obstacle.style.right = pos + "px";

        // Collision check
        const dinoRect = dino.getBoundingClientRect();
        const obsRect = obstacle.getBoundingClientRect();

        const overlap =
            dinoRect.left < obsRect.right &&
            dinoRect.right > obsRect.left &&
            dinoRect.bottom > obsRect.top &&
            dinoRect.top < obsRect.bottom;

        const dinoIsLow = parseInt(getComputedStyle(dino).bottom) <= 90;

        if (overlap && dinoIsLow) {
            // "Botsing" → zachte reset
            gameRunning = false;
            dino.style.bottom = "70px";
            obstacle.style.background = "#c0392b";
            obstacle.textContent = "💥";

            setTimeout(() => {
                resetGame();
            }, 900);
        }

        // Obstakel voorbij
        if (pos < -100) {
            clearInterval(moveInterval);
            obstacle.remove();
            score++;
            scoreSpan.textContent = score;
        }
    }, 20);
}

// Obstakels interval
let obstacleTimer = null;

function startObstacles() {
    obstacleTimer = setInterval(() => {
        createObstacle();
    }, 1600);
}

function stopObstacles() {
    if (obstacleTimer) clearInterval(obstacleTimer);
}

// Game reset
function resetGame() {
    // Obstakels weg
    obstaclesContainer.innerHTML = "";
    stopObstacles();

    // Kleine pauze
    setTimeout(() => {
        gameRunning = true;
        startObstacles();
    }, 600);
}

// Start
startObstacles();
