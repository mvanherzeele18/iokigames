// =====================================
// Ioki Games - Schoonmaken
// =====================================

const game = document.getElementById("game");

const canvas = document.getElementById("dirty-window");
const ctx = canvas.getContext("2d");

const sponge = document.getElementById("sponge");
const container = document.getElementById("window-container");

const dirtyImage = new Image();
dirtyImage.src = "../assets/images/window-dirty.png";

// ---------------------------
// Canvas instellen
// ---------------------------

function resizeCanvas() {

    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.globalCompositeOperation = "source-over";

    ctx.drawImage(
        dirtyImage,
        0,
        0,
        canvas.width,
        canvas.height
    );

}

dirtyImage.onload = resizeCanvas;

window.addEventListener("resize", resizeCanvas);

// ---------------------------
// Spons verplaatsen
// ---------------------------

function moveSponge(x, y) {

    const gameRect = game.getBoundingClientRect();

    const spongeWidth = sponge.offsetWidth;
    const spongeHeight = sponge.offsetHeight;

    sponge.style.left = (x - gameRect.left - spongeWidth / 2) + "px";
    sponge.style.top = (y - gameRect.top - spongeHeight / 2) + "px";

}

// ---------------------------
// Schoonmaken
// ---------------------------

function clean(x, y) {

    const rect = canvas.getBoundingClientRect();

    const cx = x - rect.left;
    const cy = y - rect.top;

    // Alleen binnen het raam poetsen
    if (
        cx < 0 ||
        cy < 0 ||
        cx > canvas.width ||
        cy > canvas.height
    ) {
        return;
    }

    // Maak schoon
    ctx.globalCompositeOperation = "destination-out";

    ctx.beginPath();
    ctx.arc(cx, cy, 45, 0, Math.PI * 2);
    ctx.fill();

    // Na 10 seconden opnieuw vuil
    setTimeout(() => {

        ctx.globalCompositeOperation = "source-over";

        ctx.save();

        ctx.beginPath();
        ctx.arc(cx, cy, 45, 0, Math.PI * 2);
        ctx.clip();

        ctx.drawImage(
            dirtyImage,
            0,
            0,
            canvas.width,
            canvas.height
        );

        ctx.restore();

    }, 5000);

}

// ---------------------------
// Muis
// ---------------------------

window.addEventListener("mousemove", (e) => {

    moveSponge(e.clientX, e.clientY);

    clean(e.clientX, e.clientY);

});

// ---------------------------
// Touch
// ---------------------------

window.addEventListener("touchstart", (e) => {

    const touch = e.touches[0];

    moveSponge(touch.clientX, touch.clientY);

    clean(touch.clientX, touch.clientY);

});

window.addEventListener("touchmove", (e) => {

    e.preventDefault();

    const touch = e.touches[0];

    moveSponge(touch.clientX, touch.clientY);

    clean(touch.clientX, touch.clientY);

}, { passive: false });
