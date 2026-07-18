const canvas = document.getElementById("penguinCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Wereld
const groundY = canvas.height * 0.8;

const penguin = {
    x: canvas.width * 0.2,
    y: groundY - 60,
    w: 60,
    h: 60,
    vx: 0
};

let fishes = [];
let snowballs = [];
let score = 0;

// Input: links/rechts
let left = false;
let right = false;

window.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") left = true;
    if (e.key === "ArrowRight") right = true;
});

window.addEventListener("keyup", e => {
    if (e.key === "ArrowLeft") left = false;
    if (e.key === "ArrowRight") right = false;
});

// Touch voor vijfjarigen
canvas.addEventListener("pointerdown", e => {
    const mx = e.clientX - canvas.getBoundingClientRect().left;
    if (mx < canvas.width / 2) {
        left = true;
        right = false;
    } else {
        right = true;
        left = false;
    }
});

canvas.addEventListener("pointerup", () => {
    left = false;
    right = false;
});

// Spawns
function spawnFish() {
    fishes.push({
        x: canvas.width + 50,
        y: groundY - 40 - Math.random() * 80,
        w: 40,
        h: 30,
        vx: -3
    });
}

function spawnSnowball() {
    snowballs.push({
        x: canvas.width + 50,
        y: groundY - 30,
        r: 20,
        vx: -4
    });
}

setInterval(spawnFish, 2000);
setInterval(spawnSnowball, 3000);

// Update
function update() {
    // Pinguïn beweging
    if (left) penguin.vx = -4;
    else if (right) penguin.vx = 4;
    else penguin.vx *= 0.8;

    penguin.x += penguin.vx;
    penguin.x = Math.max(20, Math.min(canvas.width - 80, penguin.x));

    // Fishes
    fishes.forEach(f => f.x += f.vx);
    fishes = fishes.filter(f => f.x > -60);

    // Snowballs
    snowballs.forEach(s => s.x += s.vx);
    snowballs = snowballs.filter(s => s.x > -60);

    // Collisions – heel vergevingsgezind
    fishes.forEach((f, i) => {
        if (Math.abs(f.x - penguin.x) < 40 && Math.abs(f.y - penguin.y) < 40) {
            score++;
            fishes.splice(i, 1);
        }
    });

    snowballs.forEach((s, i) => {
        if (Math.abs(s.x - penguin.x) < 40 && Math.abs(s.y - penguin.y) < 40) {
            penguin.x -= 40;
            snowballs.splice(i, 1);
        }
    });
}

// Draw
function drawGround() {
    ctx.fillStyle = "#b0e0e6";
    ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, groundY - 20, canvas.width, 20);
}

function drawPenguin() {
    ctx.save();
    ctx.translate(penguin.x, penguin.y);

    // Body
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.ellipse(0, 0, penguin.w * 0.4, penguin.h * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Belly
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.ellipse(0, 10, penguin.w * 0.25, penguin.h * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();

    // Beak
    ctx.fillStyle = "#ffa500";
    ctx.beginPath();
    ctx.moveTo(10, -5);
    ctx.lineTo(30, 0);
    ctx.lineTo(10, 5);
    ctx.closePath();
    ctx.fill();

    // Eyes
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(-10, -10, 6, 0, Math.PI * 2);
    ctx.arc(5, -10, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.arc(-10, -10, 3, 0, Math.PI * 2);
    ctx.arc(5, -10, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}

function drawFishes() {
    fishes.forEach(f => {
        ctx.save();
        ctx.translate(f.x, f.y);

        ctx.fillStyle = "#ff7f50";
        ctx.beginPath();
        ctx.ellipse(0, 0, f.w * 0.5, f.h * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(-f.w * 0.5, 0);
        ctx.lineTo(-f.w * 0.8, -10);
        ctx.lineTo(-f.w * 0.8, 10);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    });
}

function drawSnowballs() {
    snowballs.forEach(s => {
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
    });
}

function drawScore() {
    ctx.fillStyle = "#000000";
    ctx.font = "24px Arial";
    ctx.fillText("Visjes: " + score, 20, 40);
}

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGround();
    drawPenguin();
    drawFishes();
    drawSnowballs();
    drawScore();
    update();
    requestAnimationFrame(loop);
}

loop();
