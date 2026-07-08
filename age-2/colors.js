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

// Zet clipping path: we tekenen de ster met dezelfde transformatie als het display
function updateClippingPath() {
    // Maak een offscreen canvas voor de ster
    const maskCanvas = document.createElement("canvas");
    maskCanvas.width = canvas.width;
    maskCanvas.height = canvas.height;
    const maskCtx = maskCanvas.getContext("2d");
    
    // Zet achtergrond op zwart zodat we goed kunnen detecteren
    maskCtx.fillStyle = "black";
    maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
    
    // BELANGRIJK: teken de ster met object-fit: contain (dus gecentreerd, niet uitgerekt)
    // De star afbeelding heeft dezelfde grootte/positie als het HTML element
    // We gebruiken drawImage met dezelfde parameters als CSS zou doen
    
    // Bereken de schaal en offset (object-fit: contain)
    const starRect = star.getBoundingClientRect();
    const containerRect = star.parentElement.getBoundingClientRect();
    
    // De star is 100% van de container, dus dezelfde grootte als canvas
    // Teken it op dezelfde manier
    try {
        maskCtx.drawImage(star, 0, 0, canvas.width, canvas.height);
    } catch (e) {
        console.error("Failed to draw star mask:", e);
        return;
    }
    
    // Haal de pixels op
    const imageData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
    const data = imageData.data;
    
    // Creëer een set van geldige pixels
    window.validPixels = new Set();
    
    let coloredPixels = 0;
    
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];
        
        // Pixel is geldig als het NIET zwart is (zwart is achtergrond)
        // Dus alle pixels van de SVG (wit + zwart strokes + antialiasing) zijn OK
        const isBlack = r < 10 && g < 10 && b < 10 && a > 240;
        
        if (!isBlack) {
            window.validPixels.add(i / 4);
            coloredPixels++;
        }
    }
    
    console.log("Clipping path updated. Valid pixels:", coloredPixels);
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

    if (!window.validPixels || window.validPixels.size === 0) {
        console.log("validPixels not ready yet");
        return false;
    }

    const width = canvas.width;
    const height = canvas.height;

    x = Math.floor(x);
    y = Math.floor(y);

    if (x < 0 || x >= width || y < 0 || y >= height) return false;

    const index = y * width + x;
    const result = window.validPixels.has(index);
    
    return result;

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
