// =====================================
// Ioki Games - Opruimen
// =====================================

const toysContainer = document.getElementById("toys");
const toyBox = document.getElementById("toy-box");

// ---------------------------
// Speelgoed
// ---------------------------

const toyImages = [

    "teddy.png",
    "car.png",
    "ball.png",
    "blocks.png",
    "duck.png",
    "train.png",
    "robot.png",
    "dinosaur.png"

];

const TOY_SIZE = 80;

// ---------------------------
// Nieuw speeltje
// ---------------------------

function createToy() {

    const toy = document.createElement("img");

    toy.className = "toy";

    toy.src = "../assets/images/cleanup/" +
        toyImages[Math.floor(Math.random() * toyImages.length)];

    toy.draggable = false;

    toy.style.left =
        Math.random() * (toysContainer.clientWidth - TOY_SIZE) + "px";

    toy.style.top =
        Math.random() * (toysContainer.clientHeight - TOY_SIZE - 120) + "px";

    toysContainer.appendChild(toy);

    makeDraggable(toy);

}

// ---------------------------
// Slepen
// ---------------------------

function makeDraggable(toy) {

    let dragging = false;
    let offsetX = 0;
    let offsetY = 0;

    function start(x, y) {

        dragging = true;

        toy.style.zIndex = 100;

        const rect = toy.getBoundingClientRect();

        offsetX = x - rect.left;
        offsetY = y - rect.top;

    }

    function move(x, y) {

        if (!dragging) return;

        const room = toysContainer.getBoundingClientRect();

        toy.style.left = (x - room.left - offsetX) + "px";
        toy.style.top = (y - room.top - offsetY) + "px";

    }

    function end() {

        if (!dragging) return;

        dragging = false;

        toy.style.zIndex = "";

        const toyRect = toy.getBoundingClientRect();
        const boxRect = toyBox.getBoundingClientRect();

        if (

            toyRect.left < boxRect.right &&
            toyRect.right > boxRect.left &&
            toyRect.top < boxRect.bottom &&
            toyRect.bottom > boxRect.top

        ) {

            new Audio("../assets/sounds/pop.mp3").play();

            toy.remove();

            setTimeout(createToy, 2000);

        }

    }

    // -----------------------
    // Muis
    // -----------------------

    toy.addEventListener("mousedown", (e) => {

        start(e.clientX, e.clientY);

    });

    window.addEventListener("mousemove", (e) => {

        move(e.clientX, e.clientY);

    });

    window.addEventListener("mouseup", end);

    // -----------------------
    // Touch
    // -----------------------

    toy.addEventListener("touchstart", (e) => {

        const touch = e.touches[0];

        start(touch.clientX, touch.clientY);

    });

    window.addEventListener("touchmove", (e) => {

        if (!dragging) return;

        e.preventDefault();

        const touch = e.touches[0];

        move(touch.clientX, touch.clientY);

    }, { passive: false });

    window.addEventListener("touchend", end);

}

// ---------------------------
// Start
// ---------------------------

for (let i = 0; i < 6; i++) {

    createToy();

}
