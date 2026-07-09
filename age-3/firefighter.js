// =====================================
// Ioki Games - Brandweer
// =====================================

// Elementen
const cloud = document.getElementById("rain-cloud");
const rain = document.getElementById("rain");
const fires = document.getElementById("fires");

// Instellingen
const FIRE_COUNT = 4;

let cloudX = window.innerWidth / 2;
let dragging = false;

// ---------------------------
// Nieuw vuurtje
// ---------------------------

function createFire() {

    const fire = document.createElement("div");

    fire.className = "fire";
    fire.textContent = "🔥";

    // Alleen op het gras
    const x = 20 + Math.random() * (window.innerWidth - 90);
    const y = window.innerHeight * 0.74 + Math.random() * (window.innerHeight * 0.20);

    fire.style.left = x + "px";
    fire.style.top = y + "px";

    fires.appendChild(fire);

}

// ---------------------------
// Start
// ---------------------------

for(let i = 0; i < FIRE_COUNT; i++){

    createFire();

}

// ---------------------------
// Wolk verplaatsen
// ---------------------------

function moveCloud(x){

    const width = cloud.offsetWidth;

    cloudX = Math.max(width / 2, Math.min(window.innerWidth - width / 2, x));

    cloud.style.left = cloudX + "px";

}

// Muis

cloud.addEventListener("mousedown", () => {

    dragging = true;

});

window.addEventListener("mouseup", () => {

    dragging = false;

});

window.addEventListener("mousemove", (e) => {

    if(dragging){

        moveCloud(e.clientX);

    }

});

// Touch

cloud.addEventListener("touchstart", () => {

    dragging = true;

});

window.addEventListener("touchend", () => {

    dragging = false;

});

window.addEventListener("touchmove", (e) => {

    if(!dragging) return;

    e.preventDefault();

    moveCloud(e.touches[0].clientX);

}, { passive:false });

// ---------------------------
// Regendruppel
// ---------------------------

function createDrop(){

    const drop = document.createElement("div");

    drop.className = "raindrop";

    const x = cloud.offsetLeft + cloud.offsetWidth / 2 + (Math.random() * 60 - 30);
    const y = cloud.offsetTop + cloud.offsetHeight - 10;

    drop.style.left = x + "px";
    drop.style.top = y + "px";

    rain.appendChild(drop);

    const interval = setInterval(() => {

        const dropRect = drop.getBoundingClientRect();

        document.querySelectorAll(".fire").forEach(fire => {

            if(fire.classList.contains("out")) return;

            const fireRect = fire.getBoundingClientRect();

            const hit = !(
                dropRect.right < fireRect.left ||
                dropRect.left > fireRect.right ||
                dropRect.bottom < fireRect.top ||
                dropRect.top > fireRect.bottom
            );

            if(hit){

                fire.classList.add("out");

                setTimeout(() => {

                    fire.remove();
                    createFire();

                },200);

                drop.remove();

                clearInterval(interval);

            }

        });

    },20);

    setTimeout(() => {

        clearInterval(interval);

        drop.remove();

    },800);

}

// ---------------------------
// Regen
// ---------------------------

setInterval(createDrop, 80);
