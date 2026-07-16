const canvas = document.getElementById("bird-canvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

// -------------------------------------
// Bird
// -------------------------------------
let bird = {
    x: 80,
    y: 300,
    width: 30,
    height: 30,
    velocity: 0
};

let gravity = 0.3;
let jumpForce = -6;

// -------------------------------------
// Pipes
// -------------------------------------
let pipes = [];
let pipeGap = 180;
let pipeSpeed = 2;

// -------------------------------------
// Game
// -------------------------------------
let score = 0;
let running = true;

// -------------------------------------
// Input
// -------------------------------------
window.addEventListener("mousedown", flap);
window.addEventListener("touchstart", flap);

function flap() {
    if (!running) return;
    bird.velocity = jumpForce;
}

// -------------------------------------
// Spawn pipes
// -------------------------------------
function spawnPipe() {
    const topHeight = Math.random() * (canvas.height - pipeGap - 100) + 50;

    pipes.push({
        x: canvas.width,
        top: topHeight,
        bottom: topHeight + pipeGap
    });
}

setInterval(() => {
    if (running) spawnPipe();
}, 2000);

// -------------------------------------
// Game loop
// -------------------------------------
function loop() {
    if (!running) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Bird physics
    bird.velocity += gravity;
    bird.y += bird.velocity;

    // Draw bird
    ctx.fillStyle = "yellow";
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

    // Pipes
    pipes.forEach(pipe => {
        pipe.x -= pipeSpeed;

        ctx.fillStyle = "green";
        ctx.fillRect(pipe.x, 0, 60, pipe.top);
        ctx.fillRect(pipe.x, pipe.bottom, 60, canvas.height - pipe.bottom);

        // Collision
        if (
            bird.x < pipe.x + 60 &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.top || bird.y + bird.height > pipe.bottom)
        ) {
            gameOver();
        }

        // Score
        if (pipe.x + 60 === bird.x) {
            score++;
        }
    });

    // Ground / ceiling
    if (bird.y < 0 || bird.y > canvas.height) {
        gameOver();
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
function gameOver() {
    running = false;

    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.fillText("Game Over", 100, 300);

    setTimeout(() => {
        window.location.reload();
    }, 1500);
}
