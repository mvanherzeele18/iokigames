// ==========================================
// Ioki Games - Kleur de Ster
// ==========================================

// Canvas
const canvas = document.getElementById("paintCanvas");
const ctx = canvas.getContext("2d");

// Ster
const star = document.getElementById("star");

// Canvas grootte
function resizeCanvas() {

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Laad het sterplaatje en maak het clipping path
    loadStarMask();

}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);

// -------------------------------
// Ster Mask laden
// -------------------------------

function loadStarMask() {

    const img = new Image();
    
    img.onload = function() {

        // Maak een offscreen canvas voor het mask
        const maskCanvas = document.createElement("canvas");
        maskCanvas.width = canvas.width;
        maskCanvas.height = canvas.height;
        const maskCtx = maskCanvas.getContext("2d");

        // Teken de ster op het mask canvas
        maskCtx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Zet de ImageData
        const imageData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
        const data = imageData.data;

        // Creëer een lunArrMap van pixels die in de ster zitten
        window.starPixels = new Uint8ClampedArray(maskCanvas.width * maskCanvas.height);

        for (let i = 0; i < data.length; i += 4) {

            // Controleer of pixel niet transparant is (alpha > 127)
            if (data[i + 3] > 127) {

                window.starPixels[i / 4] = 1;

            }

        }

    };

    img.src = star.src;

}

// -------------------------------
// Variabelen
// -------------------------------

let drawing = false;

let currentColor = "#ff3b30";

let brushSize = 35;

// -------------------------------
// Kleuren
// -------------------------------

const colorButtons = document.querySelectorAll(".color");

const colorNames = {

    "#ff3b30":"Rood",
    "#007aff":"Blauw",
    "#34c759":"Groen",
    "#ffcc00":"Geel",
    "#af52de":"Paars",
    "#ff9500":"Oranje"

};

// -------------------------------
// Stem
// -------------------------------

function speak(text){

    if(!window.speechSynthesis) return;

    speechSynthesis.cancel();

    const voice = new SpeechSynthesisUtterance(text);

    voice.lang = "nl-NL";

    voice.rate = 0.85;

    speechSynthesis.speak(voice);

}

// -------------------------------
// Kleur kiezen
// -------------------------------

colorButtons.forEach(button=>{

    button.addEventListener("click",()=>{

        colorButtons.forEach(btn=>btn.classList.remove("selected"));

        button.classList.add("selected");

        currentColor = button.dataset.color;

        speak(colorNames[currentColor]);

    });

});

// -------------------------------
// Teken instellingen
// -------------------------------

ctx.lineCap = "round";
ctx.lineJoin = "round";

// -------------------------------
// Positie bepalen
// -------------------------------

function getPosition(event){

    const rect = canvas.getBoundingClientRect();

    if(event.touches){

        return{

            x:event.touches[0].clientX-rect.left,
            y:event.touches[0].clientY-rect.top

        };

    }

    return{

        x:event.clientX-rect.left,
        y:event.clientY-rect.top

    };

}

// -------------------------------
// Check of punt in ster zit
// -------------------------------

function isPointInStar(x, y) {

    if (!window.starPixels) return false;

    const width = canvas.width;
    const height = canvas.height;

    // Zorg dat x en y integers zijn
    x = Math.floor(x);
    y = Math.floor(y);

    // Controleer grenzen
    if (x < 0 || x >= width || y < 0 || y >= height) return false;

    // Controleer of pixel in ster zit
    const index = y * width + x;
    return window.starPixels[index] === 1;

}

// -------------------------------
// Tekenen starten
// -------------------------------

function startDrawing(event){

    const pos = getPosition(event);

    // Check of we in de ster starten
    if (!isPointInStar(pos.x, pos.y)) return;

    drawing = true;

    ctx.beginPath();

    ctx.moveTo(pos.x, pos.y);

}

// -------------------------------
// Stoppen
// -------------------------------

function stopDrawing(){

    drawing = false;

    ctx.beginPath();

}

// -------------------------------
// Tekenen
// -------------------------------

function draw(event){

    if(!drawing) return;

    event.preventDefault();

    const pos = getPosition(event);

    // Check of we in de ster zijn
    if (!isPointInStar(pos.x, pos.y)) {
        drawing = false;
        ctx.beginPath();
        return;
    }

    ctx.strokeStyle = currentColor;

    ctx.lineWidth = brushSize;

    ctx.lineTo(pos.x, pos.y);

    ctx.stroke();

    ctx.beginPath();

    ctx.moveTo(pos.x, pos.y);

}

// -------------------------------
// Muis
// -------------------------------

canvas.addEventListener("mousedown", startDrawing);

canvas.addEventListener("mousemove", draw);

canvas.addEventListener("mouseup", stopDrawing);

canvas.addEventListener("mouseleave", stopDrawing);

// -------------------------------
// Touch
// -------------------------------

canvas.addEventListener("touchstart", startDrawing, {passive:false});

canvas.addEventListener("touchmove", draw, {passive:false});

canvas.addEventListener("touchend", stopDrawing);

// -------------------------------
// Eraser
// -------------------------------

const eraserButton = document.getElementById("eraser");

eraserButton.addEventListener("click", () => {

    colorButtons.forEach(btn=>btn.classList.remove("selected"));

    currentColor = "transparent";

    speak("Gum");

    eraserButton.classList.add("selected");

});

// Als eraser gekozen is, gebruik clearRect
const originalDraw = draw;

canvas.addEventListener("mousemove", (event) => {

    if (!drawing) return;

    event.preventDefault();

    const pos = getPosition(event);

    // Check of we in de ster zijn
    if (!isPointInStar(pos.x, pos.y)) {
        drawing = false;
        ctx.beginPath();
        return;
    }

    if (currentColor === "transparent") {

        ctx.clearRect(pos.x - brushSize/2, pos.y - brushSize/2, brushSize, brushSize);

    } else {

        ctx.strokeStyle = currentColor;
        ctx.lineWidth = brushSize;
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);

    }

}, {passive: false});

// -------------------------------
// Wisfunctie
// -------------------------------

function clearCanvas(){

    ctx.clearRect(0, 0, canvas.width, canvas.height);

}

const clearButton = document.getElementById("clear");

clearButton.addEventListener("click", clearCanvas);
