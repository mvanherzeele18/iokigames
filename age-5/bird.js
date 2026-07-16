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
    width: 40,
    height: 40,
    velocity: 0
};

// -------------------------------------
// Game settings
// -------------------------------------
let gravity = 0.18;       // veel trager
let jumpForce = -5;       // zachter
let pipes = [];
let pipeGap = 190;        // grote opening
let pipeSpeed = 1.8;      // trager
let score = 0;

let running = false;      // begint pas na eerste klik

// -------------------------------------
// Input
// -------------------------------------
window.addEventListener("mousedown", flap);
window.addEventListener("touchstart", flap);

function flap() {
    if (!running) {
        running = true;   // start game pas bij eerste klik
    }
    bird.velocity = jumpForce;
}

// -------------------------------------
// Pipes
// -------------------------------------
function spawnPipe() {
    const topHeight = Math.random() * (canvas.height - pipeGap - 120) + 60;

    pipes.push({
        x: canvas.width,
        top: topHeight,
        bottom: topHeight + pipeGap
    });
}

setInterval(() => {
    if (running) spawnPipe();
}, 2200);

// -------------------------------------
// Game loop
// -------------------------------------
function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (running) {
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
        ctx.beginPath();
        ctx.roundRect(pipe.x, 0, 70, pipe.top, 12);
        ctx.fill();
        ctx.stroke();

        // Bottom pipe
        ctx.beginPath();
        ctx.roundRect(pipe.x, pipe.bottom, 70, canvas.height - pipe.bottom, 12);
        ctx.fill();
        ctx.stroke();

        // Collision
        if (
            bird.x < pipe.x + 70 &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.top || bird.y + bird.height > pipe.bottom)
        ) {
            gameOver();
        }

        // Score
        if (pipe.x + 70 === bird.x) {
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
