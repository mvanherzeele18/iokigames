// ==========================================
// Ioki Games - Kleur de Ster
// ==========================================

// Canvas
const canvas = document.getElementById("paintCanvas");
const ctx = canvas.getContext("2d");

// Canvas grootte
function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Ster-mask opnieuw tekenen
    if (starMask.complete) {
        applyMask();
    }
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

// Teken instellingen
ctx.lineCap = "round";
ctx.lineJoin = "round";

// Positie bepalen
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

// Tekenen starten
function startDrawing(event){
    drawing = true;
    const pos = getPosition(event);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
}

// Stoppen
function stopDrawing(){
    drawing = false;
    ctx.beginPath();
}

// Tekenen
function draw(event){
    if(!drawing) return;
    event.preventDefault();
    const pos = getPosition(event);

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

// Muis events
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseleave", stopDrawing);

// Touch events
canvas.addEventListener("touchstart", startDrawing, {passive:false});
canvas.addEventListener("touchmove", draw, {passive:false});
canvas.addEventListener("touchend", stopDrawing);

// Eraser
const eraserButton = document.getElementById("eraser");
eraserButton.addEventListener("click", () => {
    colorButtons.forEach(btn=>btn.classList.remove("selected"));
    currentColor = "transparent";
    speak("Gum");
    eraserButton.classList.add("selected");
});

// Clear
function clearCanvas(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    applyMask();
}

const clearButton = document.getElementById("clear");
clearButton.addEventListener("click", clearCanvas);

// ⭐ Ster-mask laden
const starMask = new Image();
starMask.src = "../assets/images/star-background.png";

starMask.onload = () => {
    resizeCanvas();
};

// ⭐ Clipmask toepassen
function applyMask() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Teken de ster-background
    ctx.globalCompositeOperation = "source-over";
    ctx.drawImage(starMask, 0, 0, canvas.width, canvas.height);

    // Alles wat daarna getekend wordt, blijft binnen de ster
    ctx.globalCompositeOperation = "source-in";
}
