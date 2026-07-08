// =====================================
// Ioki Games - Bubbels
// =====================================

// Elementen
const bubble = document.getElementById("bubble");
const container = document.getElementById("bubble-container");

// Geluid
const popSound = new Audio("../assets/sounds/pop.mp3");

// Instellingen
const START_SIZE = 120;
const MAX_SIZE = 340;

let bubbleSize = START_SIZE;

// ---------------------------
// Nieuwe bubbel
// ---------------------------

function spawnBubble() {

    bubbleSize = START_SIZE;

    bubble.style.width = bubbleSize + "px";

    bubble.classList.remove("pop");

    bubble.style.opacity = "1";

    // Willekeurige positie rond het midden
    const offsetX = (Math.random() - 0.5) * 240;
    const offsetY = (Math.random() - 0.5) * 180;

    container.style.left = `calc(50% + ${offsetX}px)`;
    container.style.top = `calc(50% + ${offsetY}px)`;

}

// ---------------------------
// Kans om te poppen
// ---------------------------

function getPopChance() {

    if (bubbleSize < 140) return 0.05;
    if (bubbleSize < 180) return 0.10;
    if (bubbleSize < 220) return 0.18;
    if (bubbleSize < 260) return 0.28;
    if (bubbleSize < 300) return 0.40;
    if (bubbleSize < MAX_SIZE) return 0.60;

    return 1;

}

// ---------------------------
// Bubbel laten groeien
// ---------------------------

function growBubble() {

    bubbleSize += Math.floor(Math.random() * 21) + 10;

    if (bubbleSize > MAX_SIZE) {

        bubbleSize = MAX_SIZE;

    }

    bubble.style.width = bubbleSize + "px";

}

// ---------------------------
// Bubbel laten poppen
// ---------------------------

function popBubble() {

    popSound.currentTime = 0;
    popSound.play();

    bubble.classList.add("pop");

    setTimeout(() => {

        spawnBubble();

    }, 250);

}

// ---------------------------
// Klik
// ---------------------------

bubble.addEventListener("click", () => {

    if (bubbleSize >= MAX_SIZE) {

        popBubble();

        return;

    }

    if (Math.random() < getPopChance()) {

        popBubble();

    } else {

        growBubble();

    }

});

// ---------------------------
// Start
// ---------------------------

spawnBubble();
