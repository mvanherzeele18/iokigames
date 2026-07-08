// ===========================
// Kleur de Ster - Ioki Games
// ===========================

// Canvas
const canvas = document.getElementById("paintCanvas");
const ctx = canvas.getContext("2d");

// Grootte van het canvas
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

// Tekenen
let drawing = false;

// Huidige kleur
let currentColor = "#ff3b30";

// Alle kleurknoppen
const colorButtons = document.querySelectorAll(".color");

// Nederlandse namen
const colorNames = {
    "#ff3b30": "Rood",
    "#007aff": "Blauw",
    "#34c759": "Groen",
    "#ffcc00": "Geel",
    "#af52de": "Paars",
    "#ff9500": "Oranje"
};

// Kleur kiezen
colorButtons.forEach(button => {

    button.addEventListener("click", () => {

        // Oude selectie verwijderen
        colorButtons.forEach(btn => btn.classList.remove("selected"));

        // Nieuwe selectie
        button.classList.add("selected");

        currentColor = button.dataset.color;

        // Kleur uitspreken
        speak(colorNames[currentColor]);

    });

});

// Stem
function speak(text){

    if(!("speechSynthesis" in window)) return;

    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = "nl-NL";
    utterance.rate = 0.9;

    speechSynthesis.speak(utterance);

}

// Tekenstijl
ctx.lineWidth = 20;
ctx.lineCap = "round";
ctx.lineJoin = "round";

// Begin tekenen
function startDrawing(e){

    drawing = true;
    draw(e);

}

// Stop tekenen
function stopDrawing(){

    drawing = false;
    ctx.beginPath();

}

// Tekenen
function draw(e){

    if(!drawing) return;

    const rect = canvas.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.strokeStyle = currentColor;

    ctx.lineTo(x,y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x,y);

}

// Muis
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseleave", stopDrawing);
canvas.addEventListener("mousemove", draw);

// Touch
canvas.addEventListener("touchstart", e => {

    e.preventDefault();

    startDrawing(e.touches[0]);

});

canvas.addEventListener("touchmove", e => {

    e.preventDefault();

    draw(e.touches[0]);

});

canvas.addEventListener("touchend", stopDrawing);
