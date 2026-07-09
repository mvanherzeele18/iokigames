// =====================================
// Ioki Games - Schoonmaken
// =====================================

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

    ctx.globalCompositeOperation = "source-over";
    ctx.drawImage(dirtyImage, 0, 0, canvas.width, canvas.height);

}

dirtyImage.onload = resizeCanvas;

window.addEventListener("resize", resizeCanvas);

// ---------------------------
// Spons
// ---------------------------

let cleaning = false;

// ---------------------------
// Schoonmaken
// ---------------------------

function clean(x, y) {

    const rect = canvas.getBoundingClientRect();

    const cx = x - rect.left;
    const cy = y - rect.top;

    // Spons verplaatsen
    sponge.style.left = cx + "px";
    sponge.style.top = cy + "px";

    // Alleen poetsen binnen het raam
    if (
        cx < 0 ||
        cy < 0 ||
        cx > canvas.width ||
        cy > canvas.height
    ) {
        return;
    }

    // Transparant maken
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

    }, 10000);

}

// ---------------------------
// Muis
// ---------------------------

container.addEventListener("mousedown", () => {

    cleaning = true;

});

window.addEventListener("mouseup", () => {

    cleaning = false;

});

window.addEventListener("mousemove", (e) => {

    if (!cleaning) return;

    clean(e.clientX, e.clientY);

});

// ---------------------------
// Touch
// ---------------------------

container.addEventListener("touchstart", (e) => {

    cleaning = true;

    const touch = e.touches[0];

    clean(touch.clientX, touch.clientY);

});

window.addEventListener("touchend", () => {

    cleaning = false;

});

window.addEventListener("touchmove", (e) => {

    if (!cleaning) return;

    e.preventDefault();

    const touch = e.touches[0];

    clean(touch.clientX, touch.clientY);

}, { passive: false });
