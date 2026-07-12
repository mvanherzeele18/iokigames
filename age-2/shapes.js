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
// Nieuwe opdracht
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

        target.addEventListener("dragover",e=>{

            e.preventDefault();

        });

        target.addEventListener("drop",()=>{

            if(!draggedShape) return;

            if(draggedShape.dataset.shape === target.dataset.shape){

                correctSound.currentTime = 0;
                correctSound.play();

                target.innerHTML = "";

                const placed = draggedShape.querySelector("img");

                target.appendChild(placed);

                draggedShape.remove();

                checkFinished();

            }else{

                wrongSound.currentTime = 0;
                wrongSound.play();

            }

        });

        targetsContainer.appendChild(target);

    });

    // Onderaan alle vormen in willekeurige volgorde
    
    shuffle([...shapes]).forEach(shape=>{
    
        const piece = document.createElement("div");
    
        piece.className = "shape";
        piece.dataset.shape = shape;
    
        piece.draggable = true;
    
        const img = document.createElement("img");
    
        img.src = `../assets/images/shapes/${shape}.png`;
    
        piece.appendChild(img);
    
        piece.addEventListener("dragstart",()=>{
    
            draggedShape = piece;
    
            piece.classList.add("dragging");
    
        });
    
        piece.addEventListener("dragend",()=>{
    
            piece.classList.remove("dragging");
    
        });
    
        shapesContainer.appendChild(piece);
    
    });

}

// ---------------------------
// Klaar?
// ---------------------------

function checkFinished(){

    const completed = [...targetsContainer.children].every(target =>

        !target.querySelector("img").src.includes("-shadow")

    );

    if(completed){

        setTimeout(newRound,500);

    }

}

// ---------------------------
// Start
// ---------------------------

newRound();
