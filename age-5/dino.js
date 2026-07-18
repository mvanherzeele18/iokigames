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

    dino.style.bottom = "240px";   // hoge sprong

    setTimeout(() => {
        dino.style.bottom = "70px"; // terug naar grond
    }, 550); // tijd omhoog

    setTimeout(() => {
        isJumping = false;          // sprong volledig klaar
    }, 650); // totale sprongduur
}


jumpButton.addEventListener("click", jump);

// Keyboard (optioneel)
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

    const img = document.createElement("img");
    img.src = "../assets/images/cactus.png"; // vervang door jouw PNG-pad
    img.className = "obstacleImg";
    img.alt = "Obstacle";

    obstacle.appendChild(img);
    obstaclesContainer.appendChild(obstacle);

    let pos = obstaclesContainer.clientWidth + 80;
    obstacle.style.left = pos + "px";

    const speed = 5;

    const moveInterval = setInterval(() => {
        if (!gameRunning) {
            clearInterval(moveInterval);
            obstacle.remove();
            return;
        }

        pos -= speed;
        obstacle.style.left = pos + "px";

        const dinoRect = dino.getBoundingClientRect();
        const obsRect = obstacle.getBoundingClientRect();

        const overlap =
            dinoRect.left < obsRect.right &&
            dinoRect.right > obsRect.left &&
            dinoRect.bottom > obsRect.top &&
            dinoRect.top < obsRect.bottom;

        const dinoIsLow = parseInt(getComputedStyle(dino).bottom) <= 90;

        if (overlap && dinoIsLow) {
            clearInterval(moveInterval);
            obstacle.remove();
            gameRunning = false;
            resetGame();
        }

        if (pos < -100) {
            clearInterval(moveInterval);
            obstacle.remove();
            score++;
            scoreSpan.textContent = score;
        }
    }, 20);
}

// Obstakels interval (makkelijker tempo)
let obstacleTimer = setInterval(() => {
    if (gameRunning) createObstacle();
}, 2200);

// Reset game
function resetGame() {
    obstaclesContainer.innerHTML = "";
    setTimeout(() => {
        gameRunning = true;
    }, 600);
}
