const canvas = document.getElementById("bird-canvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

// -------------------------------------
// Bird sprite
// -------------------------------------
const birdImg = new Image();
birdImg.src = "../assets/images/bird.png";

// -------------------------------------
// Bird
// -------------------------------------
let bird = {
    x: 80,
    y: 300,
    width: 60,
    height: 60,
    velocity: 0
};

// -------------------------------------
// Game settings
// -------------------------------------
let gravity = 0.12;       // zachter
let jumpForce = -4;       // minder sterke jump
let pipes = [];
let pipeGap = 260;        // veel grotere opening
let pipeSpeed = 2;
let score = 0;

let running = false;
let gameOverState = false;

// -------------------------------------
// Input
// -------------------------------------
window.addEventListener("mousedown", flap);
window.addEventListener("touchstart", flap);

function flap() {
    if (gameOverState) return;
    running = true;
    bird.velocity = jumpForce;
}

// -------------------------------------
// Pipes
// -------------------------------------
function spawnPipe() {
    const topHeight = Math.random() * (canvas.height - pipeGap - 150) + 60;

    pipes.push({
        x: canvas.width,
        top: topHeight,
        bottom: topHeight + pipeGap,
        counted: false
    });
}

setInterval(() => {
    if (running && !gameOverState) spawnPipe();
}, 2000);

// -------------------------------------
// Mooie buizen tekenen
// -------------------------------------
function drawPipe(pipe) {
    // Main pipe color
    ctx.fillStyle = "#4CAF50";

    // Top pipe
    ctx.fillRect(pipe.x, 0, 70, pipe.top);

    // Bottom pipe
    ctx.fillRect(pipe.x, pipe.bottom, 70, canvas.height - pipe.bottom);

    // Dark border
    ctx.strokeStyle = "#2E7D32";
    ctx.lineWidth = 4;
    ctx.strokeRect(pipe.x, 0, 70, pipe.top);
    ctx.strokeRect(pipe.x, pipe.bottom, 70, canvas.height - pipe.bottom);

    // Highlight
    ctx.fillStyle = "rgba(255,255,255,0.15)";
    ctx.fillRect(pipe.x + 10, 0, 10, pipe.top);
    ctx.fillRect(pipe.x + 10, pipe.bottom, 10, canvas.height - pipe.bottom);
}

// -------------------------------------
// Game loop
// -------------------------------------
function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!gameOverState) {
        // Bird physics
        if (running) {
            bird.velocity += gravity;
            bird.y += bird.velocity;
        }

        // Draw bird
        ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

        // Pipes
        pipes.forEach(pipe => {
            pipe.x -= pipeSpeed;

            drawPipe(pipe);

            // Collision
            if (
                bird.x < pipe.x + 70 &&
                bird.x + bird.width > pipe.x &&
                (bird.y < pipe.top || bird.y + bird.height > pipe.bottom)
            ) {
                showGameOver();
            }

            // Score
            if (!pipe.counted && pipe.x + 70 < bird.x) {
                score++;
                pipe.counted = true;
            }
        });

        // Ground / ceiling
        if (bird.y < 0 || bird.y > canvas.height) {
            showGameOver();
        }

        // Score text
        ctx.fillStyle = "white";
        ctx.font = "32px Arial";
        ctx.fillText(score, 20, 50);
    }

    // Game Over overlay (blijft zichtbaar)
    if (gameOverState) {
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "white";
        ctx.font = "40px Arial";
        ctx.fillText("Game Over", 100, 300);
    }

    requestAnimationFrame(loop);
}

loop();

// -------------------------------------
// Game over
// -------------------------------------
function showGameOver() {
    if (gameOverState) return;

    gameOverState = true;

    setTimeout(() => {
        resetGame();
    }, 3000);
}

// -------------------------------------
// Reset game
// -------------------------------------
function resetGame() {
    bird.x = 80;
    bird.y = 300;
    bird.velocity = 0;

    pipes = [];
    score = 0;

    running = false;
    gameOverState = false;
}
