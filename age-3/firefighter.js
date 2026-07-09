// =====================================
// Ioki Games - Brandweer
// =====================================

// Elementen
const playArea = document.getElementById("play-area");
const firesContainer = document.getElementById("fires");
const water = document.getElementById("water");

// Instellingen
const FIRE_COUNT = 4;

// ---------------------------
// Nieuw vuurtje
// ---------------------------

function createFire() {

    const fire = document.createElement("div");

    fire.className = "fire";
    fire.textContent = "🔥";

    // Willekeurige positie
    const x = Math.random() * (window.innerWidth - 80);
    const y = 120 + Math.random() * (window.innerHeight - 220);

    fire.style.left = x + "px";
    fire.style.top = y + "px";

    firesContainer.appendChild(fire);

}

// ---------------------------
// Start
// ---------------------------

for (let i = 0; i < FIRE_COUNT; i++) {

    createFire();

}

// ---------------------------
// Water volgen
// ---------------------------

function moveWater(x, y) {

    water.style.display = "block";

    water.style.left = x + "px";
    water.style.top = y + "px";

    checkFireCollision();

}

// ---------------------------
// Botsing controleren
// ---------------------------

function checkFireCollision() {

    const waterRect = water.getBoundingClientRect();

    document.querySelectorAll(".fire").forEach(fire => {

        if (fire.classList.contains("out")) return;

        const fireRect = fire.getBoundingClientRect();

        const hit = !(
            waterRect.right < fireRect.left ||
            waterRect.left > fireRect.right ||
            waterRect.bottom < fireRect.top ||
            waterRect.top > fireRect.bottom
        );

        if (hit) {

            fire.classList.add("out");

            setTimeout(() => {

                fire.remove();

                createFire();

            }, 250);

        }

    });

}

// ---------------------------
// Muis
// ---------------------------

playArea.addEventListener("mousemove", (e) => {

    moveWater(e.clientX, e.clientY);

});

// ---------------------------
// Touch
// ---------------------------

playArea.addEventListener("touchstart", (e) => {

    const touch = e.touches[0];

    moveWater(touch.clientX, touch.clientY);

});

playArea.addEventListener("touchmove", (e) => {

    e.preventDefault();

    const touch = e.touches[0];

    moveWater(touch.clientX, touch.clientY);

}, { passive: false });

// ---------------------------
// Water verbergen
// ---------------------------

playArea.addEventListener("mouseleave", () => {

    water.style.display = "none";

});

playArea.addEventListener("touchend", () => {

    water.style.display = "none";

});

// ---------------------------
// Bij draaien scherm
// ---------------------------

window.addEventListener("resize", () => {

    document.querySelectorAll(".fire").forEach(fire => fire.remove());

    for (let i = 0; i < FIRE_COUNT; i++) {

        createFire();

    }

});
