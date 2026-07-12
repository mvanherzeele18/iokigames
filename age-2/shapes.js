// =====================================
// Ioki Games - Vormen
// =====================================

const targetsContainer = document.getElementById("targets");
const shapesContainer = document.getElementById("shapes");

const correctSound = new Audio("../assets/sounds/correct.mp3");
const wrongSound = new Audio("../assets/sounds/wrong.mp3");

const shapes = [
    "circle",
    "square",
    "triangle",
    "star",
    "heart",
    "hexagon"
];

let draggedShape = null;

let offsetX = 0;
let offsetY = 0;

// ---------------------------
// Schudden
// ---------------------------

function shuffle(array){

    for(let i = array.length - 1; i > 0; i--){

        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];

    }

    return array;

}

// ---------------------------
// Nieuwe ronde
// ---------------------------

function newRound(){

    targetsContainer.innerHTML = "";
    shapesContainer.innerHTML = "";

    const selected = shuffle([...shapes]).slice(0,3);

    // Targets

    selected.forEach(shape=>{

        const target = document.createElement("div");

        target.className = "target";
        target.dataset.shape = shape;

        const img = document.createElement("img");

        img.src = `../assets/images/shapes/${shape}-shadow.png`;

        target.appendChild(img);

        targetsContainer.appendChild(target);

    });

    // Alle vormen onderaan

    shuffle([...shapes]).forEach(shape=>{

        const piece = document.createElement("div");

        piece.className = "shape";
        piece.dataset.shape = shape;

        const img = document.createElement("img");

        img.src = `../assets/images/shapes/${shape}.png`;

        piece.appendChild(img);

        piece.addEventListener("pointerdown",startDrag);

        shapesContainer.appendChild(piece);

    });

}

// ---------------------------
// Slepen
// ---------------------------

function startDrag(e){

    draggedShape = e.currentTarget;

    draggedShape.classList.add("dragging");

    const rect = draggedShape.getBoundingClientRect();

    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    draggedShape.style.position = "fixed";
    draggedShape.style.zIndex = "1000";

    moveShape(e);

    document.addEventListener("pointermove",moveShape);
    document.addEventListener("pointerup",stopDrag);

}

function moveShape(e){

    if(!draggedShape) return;

    draggedShape.style.left = (e.clientX - offsetX) + "px";
    draggedShape.style.top = (e.clientY - offsetY) + "px";

}

function stopDrag(){

    if(!draggedShape) return;

    const shapeRect = draggedShape.getBoundingClientRect();

    let placed = false;

    document.querySelectorAll(".target").forEach(target=>{

        if(placed) return;

        if(!target.querySelector("img")) return;

        const targetRect = target.getBoundingClientRect();

        const centerX = shapeRect.left + shapeRect.width/2;
        const centerY = shapeRect.top + shapeRect.height/2;

        if(

            centerX > targetRect.left &&
            centerX < targetRect.right &&
            centerY > targetRect.top &&
            centerY < targetRect.bottom

        ){

            if(target.dataset.shape === draggedShape.dataset.shape){

                correctSound.currentTime = 0;
                correctSound.play();

                target.innerHTML = "";

                const img = draggedShape.querySelector("img");

                target.appendChild(img);

                draggedShape.remove();

                placed = true;

                checkFinished();

            }else{

                wrongSound.currentTime = 0;
                wrongSound.play();

            }

        }

    });

    if(!placed){

        draggedShape.style.position = "";
        draggedShape.style.left = "";
        draggedShape.style.top = "";
        draggedShape.style.zIndex = "";

    }

    if(draggedShape){

        draggedShape.classList.remove("dragging");

    }

    draggedShape = null;

    document.removeEventListener("pointermove",moveShape);
    document.removeEventListener("pointerup",stopDrag);

}

// ---------------------------
// Klaar?
// ---------------------------

function checkFinished(){

    const completed = [...targetsContainer.children].every(target=>{

        const img = target.querySelector("img");

        return img && !img.src.includes("-shadow");

    });

    if(completed){

        setTimeout(newRound,500);

    }

}

// ---------------------------
// Start
// ---------------------------

newRound();
