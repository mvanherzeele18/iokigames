// bowling.js

const canvas = document.getElementById("bowlingCanvas");
const ctx = canvas.getContext("2d");

// Canvas goed schalen
function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// =========================
//  Game Objects
// =========================

const lane = {
    x: canvas.width * 0.1,
    width: canvas.width * 0.8,
    height: canvas.height,
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height * 0.85,
    radius: canvas.width * 0.04,
    vx: 0,
    vy: 0,
    dragging: false,
};

let pins = [];
const pinWidth = canvas.width * 0.04;
const pinHeight = canvas.height * 0.08;

// Pin positions (triangle)
function createPins() {
    pins = [];
    const startY = canvas.height * 0.15;
    const centerX = canvas.width / 2;

    const rows = [
        [0],
        [-1, 1],
        [-2, 0, 2],
        [-3, -1, 1, 3]
    ];

    rows.forEach((row, i) => {
        row.forEach(offset => {
            pins.push({
                x: centerX + offset * (pinWidth * 1.2),
                y: startY + i * (pinHeight * 1.3),
                hit: false
            });
        });
    });
}
createPins();

// =========================
//  Input
// =========================

canvas.addEventListener("pointerdown", e => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const dist = Math.hypot(mx - ball.x, my - ball.y);
    if (dist < ball.radius) {
        ball.dragging = true;
    }
});

canvas.addEventListener("pointermove", e => {
    if (!ball.dragging) return;

    const rect = canvas.getBoundingClientRect();
    ball.x = e.clientX - rect.left;
    ball.y = e.clientY - rect.top;

    // Grenzen
    ball.x = Math.max(lane.x + ball.radius, Math.min(lane.x + lane.width - ball.radius, ball.x));
    ball.y = Math.max(canvas.height * 0.5, Math.min(canvas.height * 0.95, ball.y));
});

canvas.addEventListener("pointerup", e => {
    if (!ball.dragging) return;
    ball.dragging = false;

    // Snelheid gebaseerd op hoe ver je de bal naar achter trok
    const power = (canvas.height * 0.85 - ball.y) * 0.25;
    ball.vy = -power;
});

// =========================
//  Physics
// =========================

function update() {
    if (!ball.dragging) {
        ball.x += ball.vx;
        ball.y += ball.vy;

        // Wrijving
        ball.vy *= 0.99;

        // Botsing met pins
        pins.forEach(pin => {
            if (pin.hit) return;

            const dist = Math.hypot(ball.x - pin.x, ball.y - pin.y);
            if (dist < ball.radius + pinWidth * 0.5) {
                pin.hit = true;
            }
        });

        // Reset als bal voorbij pins is
        if (ball.y < -50) {
            resetBall();
        }
    }
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height * 0.85;
    ball.vx = 0;
    ball.vy = 0;
    createPins();
}

// =========================
//  Draw
// =========================

function drawLane() {
    ctx.fillStyle = "#d9b67d";
    ctx.fillRect(lane.x, 0, lane.width, lane.height);
}

function drawBall() {
    ctx.fillStyle = "#333";
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
}

function drawPins() {
    pins.forEach(pin => {
        ctx.save();
        ctx.translate(pin.x, pin.y);

        if (pin.hit) {
            ctx.rotate(1.4); // omgevallen
        }

        ctx.fillStyle = pin.hit ? "#ccc" : "white";
        ctx.fillRect(-pinWidth / 2, -pinHeight / 2, pinWidth, pinHeight);

        ctx.restore();
    });
}

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    update();
    drawLane();
    drawPins();
    drawBall();

    requestAnimationFrame(loop);
}

loop();
