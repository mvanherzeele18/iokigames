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

// Baan iets lager
const lane = {
    x: canvas.width * 0.1,
    width: canvas.width * 0.8,
    yOffset: canvas.height * 0.05,   // NIEUW: schuift alles naar beneden
    height: canvas.height
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height * 0.90,   // lager dan vorige versie
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

    const centerX = canvas.width / 2;

    // De driehoek moet omgekeerd → breedste rij bovenaan
    const startY = canvas.height * 0.18 + lane.yOffset;

    const rows = [
        [-3, -1, 1, 3],   // 4 pins bovenaan
        [-2, 0, 2],       // 3 pins
        [-1, 1],          // 2 pins
        [0]               // 1 pin onderaan
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

        // Startpositie opslaan voor richting
        ball.startX = ball.x;
        ball.startY = ball.y;
    }
});

canvas.addEventListener("pointermove", e => {
    if (!ball.dragging) return;

    const rect = canvas.getBoundingClientRect();
    ball.x = e.clientX - rect.left;
    ball.y = e.clientY - rect.top;

    // Grenzen
    ball.x = Math.max(lane.x + ball.radius, Math.min(lane.x + lane.width - ball.radius, ball.x));
    ball.y = Math.max(canvas.height * 0.60, Math.min(canvas.height * 0.95, ball.y));
});

canvas.addEventListener("pointerup", () => {
    if (!ball.dragging) return;
    ball.dragging = false;

    const pullY = ball.startY - ball.y;
    const pullX = ball.startX - ball.x;

    // Preventie: bal mag niet naar achter
    if (pullY < 0) {
        ball.vy = 0;
        ball.vx = 0;
        return;
    }

    const maxSpeed = 18;

    // Verticale snelheid
    ball.vy = -Math.min(maxSpeed, pullY * 0.25);

    // Horizontale snelheid (schuin gooien)
    ball.vx = -Math.min(maxSpeed * 0.6, pullX * 0.15);
});

// =========================
//  Physics
// =========================

function update() {
    if (!ball.dragging) {

        // Beweging
        ball.x += ball.vx;
        ball.y += ball.vy;

        // Wrijving voor beide richtingen
        ball.vx *= 0.985;
        ball.vy *= 0.985;

        // Botsing met pins
        pins.forEach(pin => {
            if (pin.falling) return;

            const dist = Math.hypot(ball.x - pin.x, ball.y - pin.y);
            if (dist < ball.radius + pinWidth * 0.45) {
                pin.falling = true;
                pin.rotation = (Math.random() * 0.8 + 0.4);
            }
        });

        // Reset wanneer bal voorbij de pins is
        if (ball.y < -80) {
            resetBall();
        }
    }
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height * 0.90;
    ball.vx = 0;
    ball.vy = 0;
    createPins();
}

// =========================
//  Draw
// =========================

function drawLane() {
    ctx.fillStyle = "#d9b67d";
    ctx.fillRect(lane.x, lane.yOffset, lane.width, lane.height);
}

function drawBall() {
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

        // Correcte pinvorm: smal boven, breed onder
        ctx.fillStyle = "white";
        ctx.strokeStyle = "#ccc";
        ctx.lineWidth = 2;

        ctx.beginPath();

        // Bovenkant (smal)
        ctx.moveTo(-pinWidth * 0.20, -pinHeight * 0.50);
        ctx.quadraticCurveTo(0, -pinHeight * 0.65, pinWidth * 0.20, -pinHeight * 0.50);

        // Middel (iets breder)
        ctx.quadraticCurveTo(pinWidth * 0.35, -pinHeight * 0.10, pinWidth * 0.45, pinHeight * 0.20);

        // Onderkant (breed)
        ctx.quadraticCurveTo(0, pinHeight * 0.60, -pinWidth * 0.45, pinHeight * 0.20);
        ctx.quadraticCurveTo(-pinWidth * 0.35, -pinHeight * 0.10, -pinWidth * 0.20, -pinHeight * 0.50);

        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Rode strepen bovenaan
        ctx.strokeStyle = "red";
        ctx.lineWidth = 3;

        ctx.beginPath();
        ctx.moveTo(-pinWidth * 0.30, -pinHeight * 0.30);
        ctx.lineTo(pinWidth * 0.30, -pinHeight * 0.30);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(-pinWidth * 0.28, -pinHeight * 0.38);
        ctx.lineTo(pinWidth * 0.28, -pinHeight * 0.38);
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
