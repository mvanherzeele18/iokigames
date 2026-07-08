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
    updateClippingPath();

}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);

// Wacht tot SVG geladen is
star.addEventListener("load", updateClippingPath);
if (star.complete) {
    setTimeout(updateClippingPath, 50);
}

// -------------------------------
// Variabelen
// -------------------------------

let drawing = false;

let currentColor = "#ff3b30";

let brushSize = 15;

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

// Zet clipping path: we tekenen de ster onzichtbaar en gebruiken dat als clipping path
function updateClippingPath() {
    // Maak een offscreen canvas voor de ster
    const maskCanvas = document.createElement("canvas");
    maskCanvas.width = canvas.width;
    maskCanvas.height = canvas.height;
    const maskCtx = maskCanvas.getContext("2d");
    
    // Zet achtergrond op zwart (om goed te kunnen detecteren)
    maskCtx.fillStyle = "black";
    maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
    
    // Teken de ster afbeelding (die heeft witte vulling + zwarte stroke)
    maskCtx.drawImage(star, 0, 0, canvas.width, canvas.height);
    
    // Haal de pixels op
    const imageData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
    const data = imageData.data;
    
    // Creëer een set van geldige pixels
    window.validPixels = new Set();
    
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];
        
        // Pixel is geldig als het WIT is (de vulling van de ster) of ZWART (de stroke/rand)
        // WIT = R>240 EN G>240 EN B>240
        // ZWART = R<15 EN G<15 EN B<15
        const isWhite = r > 240 && g > 240 && b > 240;
        const isBlack = r < 15 && g < 15 && b < 15;
        
        if ((isWhite || isBlack) && a > 200) {
            window.validPixels.add(i / 4);
        }
    }
    
    console.log("Clipping path updated. Valid pixels:", window.validPixels.size);
}

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

    if (!window.validPixels) {
        return false;
    }

    const width = canvas.width;
    const height = canvas.height;

    x = Math.floor(x);
    y = Math.floor(y);

    if (x < 0 || x >= width || y < 0 || y >= height) return false;

    const index = y * width + x;
    return window.validPixels.has(index);

}

// -------------------------------
// Tekenen starten
// -------------------------------

function startDrawing(event){

    const pos = getPosition(event);

    if (!isPointInStar(pos.x, pos.y)) {
        return;
    }

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

// -------------------------------
// Wisfunctie
// -------------------------------

function clearCanvas(){

    ctx.clearRect(0, 0, canvas.width, canvas.height);

}

const clearButton = document.getElementById("clear");

clearButton.addEventListener("click", clearCanvas);
