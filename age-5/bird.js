const canvas = document.getElementById("bird-canvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

// -------------------------------------
// Bird sprite
// -------------------------------------
const birdImg = new Image();
birdImg.src = "../assets/images/bird.png"; // zorg dat dit pad klopt

// -------------------------------------
// Bird
// -------------------------------------
let bird = {
    x: 80,
    y: 300,
    width: 55,   // GROTER
    height: 55,  // GROTER
    velocity: 0
};

// -------------------------------------
// Game settings
// -------------------------------------
let gravity = 0.15;       // TRAGER
let jumpForce = -5;
let pipes = [];
let pipeGap = 200;        // GROTERE OPENING
let pipeSpeed = 2;
let score = 0;

let running = false;      // start pas na eerste klik
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
        counted: false // voor score
    });
}

setInterval(() => {
    if (running && !gameOverState) spawnPipe();
}, 2000);

// -------------------------------------
// Game loop
// -------------------------------------
function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Bird physics
    if (running && !gameOverState) {
        bird.velocity += gravity;
        bird.y += bird.velocity;
    }

    // Draw bird
    ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    // Pipes
    pipes.forEach(pipe => {
        pipe.x -= pipeSpeed;

        // Pipe style
        ctx.fillStyle = "#4CAF50";
        ctx.strokeStyle = "#2E7D32";
        ctx.lineWidth = 4;

        // Top pipe
        ctx.fillRect(pipe.x, 0, 70, pipe.top);
        ctx.strokeRect(pipe.x, 0, 70, pipe.top);

        // Bottom pipe
        ctx.fillRect(pipe.x, pipe.bottom, 70, canvas.height - pipe.bottom);
        ctx.strokeRect(pipe.x, pipe.bottom, 70, canvas.height - pipe.bottom);

        // Collision
        if (!gameOverState &&
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
    if (!gameOverState && (bird.y < 0 || bird.y > canvas.height)) {
        showGameOver();
    }

    // Score text
    ctx.fillStyle = "white";
    ctx.font = "32px Arial";
    ctx.fillText(score, 20, 50);

    requestAnimationFrame(loop);
}

loop();

// -------------------------------------
// Game over
// -------------------------------------
function showGameOver() {
    gameOverState = true;

    // Game Over overlay
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.fillText("Game Over", 100, 300);

    // Na 3 seconden opnieuw starten
    setTimeout(() => {
        resetGame();
    }, 3000);
}

function resetGame() {
    // Reset bird
    bird.x = 80;
    bird.y = 300;
    bird.velocity = 0;

    // Reset pipes
    pipes = [];

    // Reset score
    score = 0;

    // Reset states
    running = false;
    gameOverState = false;

    // Start opnieuw bij eerste klik
}

