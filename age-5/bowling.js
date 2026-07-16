// bowling.js

const canvas = document.getElementById("bowlingCanvas");
const ctx = canvas.getContext("2d");

// Canvas schalen
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
    height: canvas.height
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height * 0.85,
    radius: canvas.width * 0.045,
    vx: 0,
    vy: 0,
    dragging: false,
    lastY: null
};

let pins = [];
const pinWidth = canvas.width * 0.035;
const pinHeight = canvas.height * 0.11;

// Pin layout
function createPins() {
    pins = [];
    const startY = canvas.height * 0.18;
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
                x: centerX + offset * (pinWidth * 1.3),
                y: startY + i * (pinHeight * 1.35),
                rotation: 0,
                falling: false
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
        ball.lastY = ball.y;
    }
});

canvas.addEventListener("pointermove", e => {
    if (!ball.dragging) return;

    const rect = canvas.getBoundingClientRect();
    ball.x = e.clientX - rect.left;
    ball.y = e.clientY - rect.top;

    // Grenzen
    ball.x = Math.max(lane.x + ball.radius, Math.min(lane.x + lane.width - ball.radius, ball.x));
    ball.y = Math.max(canvas.height * 0.55, Math.min(canvas.height * 0.95, ball.y));
});

canvas.addEventListener("pointerup", () => {
    if (!ball.dragging) return;
    ball.dragging = false;

    // Snelheid gebaseerd op hoe ver je naar ACHTER hebt getrokken
    const pullDistance = ball.lastY - ball.y;

    // Preventie: bal mag NOOIT naar achter
    if (pullDistance < 0) {
        ball.vy = 0;
        return;
    }

    // Realistische snelheid
    const maxSpeed = 18; // veel trager dan vorige versie
    ball.vy = -Math.min(maxSpeed, pullDistance * 0.25);
});

// =========================
//  Physics
// =========================

function update() {
    if (!ball.dragging) {
        ball.x += ball.vx;
        ball.y += ball.vy;

        // Wrijving
        ball.vy *= 0.985;

        // Botsing met pins
        pins.forEach(pin => {
            if (pin.falling) return;

            const dist = Math.hypot(ball.x - pin.x, ball.y - pin.y);
            if (dist < ball.radius + pinWidth * 0.45) {
                pin.falling = true;
                pin.rotation = (Math.random() * 0.8 + 0.4); // realistische valhoek
            }
        });

        // Reset als bal voorbij pins is
        if (ball.y < -80) {
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
    // Realistische bowlingbal
    const gradient = ctx.createRadialGradient(
        ball.x - ball.radius * 0.4,
        ball.y - ball.radius * 0.4,
        ball.radius * 0.2,
        ball.x,
        ball.y,
        ball.radius
    );
    gradient.addColorStop(0, "#555");
    gradient.addColorStop(1, "#222");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();

    // Glans
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.beginPath();
    ctx.arc(ball.x - ball.radius * 0.4, ball.y - ball.radius * 0.4, ball.radius * 0.25, 0, Math.PI * 2);
    ctx.fill();
}

function drawPins() {
    pins.forEach(pin => {
        ctx.save();
        ctx.translate(pin.x, pin.y);

        if (pin.falling) {
            ctx.rotate(pin.rotation);
        }

        // Realistische pin vorm
        ctx.fillStyle = "white";
        ctx.strokeStyle = "#ccc";
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(-pinWidth * 0.4, pinHeight * 0.5);
        ctx.lineTo(-pinWidth * 0.6, -pinHeight * 0.2);
        ctx.quadraticCurveTo(0, -pinHeight * 0.55, pinWidth * 0.6, -pinHeight * 0.2);
        ctx.lineTo(pinWidth * 0.4, pinHeight * 0.5);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Rode strepen
        ctx.strokeStyle = "red";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-pinWidth * 0.5, -pinHeight * 0.1);
        ctx.lineTo(pinWidth * 0.5, -pinHeight * 0.1);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(-pinWidth * 0.45, -pinHeight * 0.2);
        ctx.lineTo(pinWidth * 0.45, -pinHeight * 0.2);
        ctx.stroke();

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
