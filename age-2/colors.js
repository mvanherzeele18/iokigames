// ==========================================
// Ioki Games - Kleur de Ster
// ==========================================

// Canvas
const maskCanvas = document.getElementById("maskCanvas");
const maskCtx = maskCanvas.getContext("2d");

const paintCanvas = document.getElementById("paintCanvas");
const paintCtx = paintCanvas.getContext("2d");

// Canvas grootte
function resizeCanvas() {
    maskCanvas.width = maskCanvas.offsetWidth;
    maskCanvas.height = maskCanvas.offsetHeight;

    paintCanvas.width = paintCanvas.offsetWidth;
    paintCanvas.height = paintCanvas.offsetHeight;

    drawMask();
}

window.addEventListener("resize", resizeCanvas);

// Variabelen
let drawing = false;
let currentColor = "#ff3b30";
let brushSize = 15;

// Kleuren
const colorButtons = document.querySelectorAll(".color");
const colorNames = {
    "#ff3b30":"Rood",
    "#007aff":"Blauw",
    "#34c759":"Groen",
    "#ffcc00":"Geel",
    "#af52de":"Paars",
    "#ff9500":"Oranje"
};

// Stem
function speak(text){
    if(!window.speechSynthesis) return;
    speechSynthesis.cancel();
    const voice = new SpeechSynthesisUtterance(text);
    voice.lang = "nl-NL";
    voice.rate = 0.85;
    speechSynthesis.speak(voice);
}

// Kleur kiezen
colorButtons.forEach(button=>{
    button.addEventListener("click",()=>{
        colorButtons.forEach(btn=>btn.classList.remove("selected"));
        button.classList.add("selected");
        currentColor = button.dataset.color;
        speak(colorNames[currentColor]);
    });
});

// Positie bepalen
function getPosition(event){
    const rect = paintCanvas.getBoundingClientRect();
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

// Tekenen starten
function startDrawing(event){
    drawing = true;
    const pos = getPosition(event);
    paintCtx.beginPath();
    paintCtx.moveTo(pos.x, pos.y);
}

// Stoppen
function stopDrawing(){
    drawing = false;
    paintCtx.beginPath();
}

// Tekenen
function draw(event){
    if(!drawing) return;
    event.preventDefault();
    const pos = getPosition(event);

    if (currentColor === "transparent") {
        paintCtx.clearRect(pos.x - brushSize/2, pos.y - brushSize/2, brushSize, brushSize);
    } else {
        paintCtx.lineCap = "round";
        paintCtx.lineJoin = "round";
        paintCtx.strokeStyle = currentColor;
        paintCtx.lineWidth = brushSize;

        paintCtx.lineTo(pos.x, pos.y);
        paintCtx.stroke();
        paintCtx.beginPath();
        paintCtx.moveTo(pos.x, pos.y);
    }

    applyMask();
}

// Muis events
paintCanvas.addEventListener("mousedown", startDrawing);
paintCanvas.addEventListener("mousemove", draw);
paintCanvas.addEventListener("mouseup", stopDrawing);
paintCanvas.addEventListener("mouseleave", stopDrawing);

// Touch events
paintCanvas.addEventListener("touchstart", startDrawing, {passive:false});
paintCanvas.addEventListener("touchmove", draw, {passive:false});
paintCanvas.addEventListener("touchend", stopDrawing);

// Eraser
const eraserButton = document.getElementById("eraser");
eraserButton.addEventListener("click", () => {
    colorButtons.forEach(btn=>btn.classList.remove("selected"));
    currentColor = "transparent";
    eraserButton.classList.add("selected");
});

// Clear
function clearCanvas(){
    paintCtx.clearRect(0, 0, paintCanvas.width, paintCanvas.height);
    applyMask();
}

const clearButton = document.getElementById("clear");
clearButton.addEventListener("click", clearCanvas);

// ⭐ Ster-mask laden
const maskImg = new Image();
maskImg.src = "../assets/images/star-background.png";

maskImg.onload = () => {
    resizeCanvas();
};

// ⭐ Mask tekenen
function drawMask() {
    maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
    maskCtx.drawImage(maskImg, 0, 0, maskCanvas.width, maskCanvas.height);
}

// ⭐ Mask toepassen
function applyMask() {
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = paintCanvas.width;
    tempCanvas.height = paintCanvas.height;

    const tempCtx = tempCanvas.getContext("2d");

    // teken de ster-background
    tempCtx.drawImage(maskCanvas, 0, 0);

    // gebruik de ster als masker
    tempCtx.globalCompositeOperation = "source-in";

    // teken de kleurlaag erin
    tempCtx.drawImage(paintCanvas, 0, 0);

    // zet het resultaat terug
    paintCtx.clearRect(0, 0, paintCanvas.width, paintCanvas.height);
    paintCtx.drawImage(tempCanvas, 0, 0);
}
