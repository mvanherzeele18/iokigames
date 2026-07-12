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
let startX = 0;
let startY = 0;
let currentX = 0;
let currentY = 0;

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

    // Bovenaan 3 schaduwen

    selected.forEach(shape=>{

        const target = document.createElement("div");

        target.className = "target";
        target.dataset.shape = shape;

        const img = document.createElement("img");

        img.src =
            `../assets/images/shapes/${shape}-shadow.png`;

        target.appendChild(img);

        targetsContainer.appendChild(target);

    });

    // Onderaan alle 6 vormen

    shuffle([...shapes]).forEach(shape=>{

        const piece = document.createElement("div");

        piece.className = "shape";
        piece.dataset.shape = shape;

        const img = document.createElement("img");

        img.src =
            `../assets/images/shapes/${shape}.png`;

        piece.appendChild(img);

        // Slepen starten

        piece.addEventListener("pointerdown",e=>{

            draggedShape = piece;

            piece.classList.add("dragging");

            startX = e.clientX;
            startY = e.clientY;

            currentX = 0;
            currentY = 0;

            piece.style.transition = "none";

            piece.setPointerCapture(e.pointerId);

        });

        // Slepen

        piece.addEventListener("pointermove",e=>{

            if(draggedShape !== piece) return;

            currentX = e.clientX - startX;
            currentY = e.clientY - startY;

            piece.style.transform =
                `translate(${currentX}px, ${currentY}px)`;

        });
        
        // Loslaten

        piece.addEventListener("pointerup",e=>{

            if(draggedShape !== piece) return;

            piece.releasePointerCapture(e.pointerId);

            const pieceRect = piece.getBoundingClientRect();

            const centerX = pieceRect.left + pieceRect.width / 2;
            const centerY = pieceRect.top + pieceRect.height / 2;

            let correct = false;

            document.querySelectorAll(".target").forEach(target=>{

                const rect = target.getBoundingClientRect();

                if(

                    centerX >= rect.left &&
                    centerX <= rect.right &&
                    centerY >= rect.top &&
                    centerY <= rect.bottom

                ){

                    if(

                        target.dataset.shape === piece.dataset.shape &&
                        target.querySelector("img").src.includes("-shadow")

                    ){

                        correct = true;

                        correctSound.currentTime = 0;
                        correctSound.play();

                        target.innerHTML = "";

                        const img = piece.querySelector("img");

                        target.appendChild(img);

                        piece.remove();

                    }

                }

            });

            // -----------------------
            // Fout
            // -----------------------

            if(!correct){

                wrongSound.currentTime = 0;
                wrongSound.play();

                piece.animate([

                    { transform: piece.style.transform },

                    { transform: piece.style.transform + " translateX(-10px)" },

                    { transform: piece.style.transform + " translateX(10px)" },

                    { transform: piece.style.transform + " translateX(-10px)" },

                    { transform: piece.style.transform }

                ],{

                    duration:300

                });

                setTimeout(()=>{

                    piece.style.transition = "transform .25s";

                    piece.style.transform = "translate(0,0)";

                    setTimeout(()=>{

                        piece.style.transition = "none";

                    },250);

                },300);

            }

            piece.classList.remove("dragging");

            draggedShape = null;

            checkFinished();

        });

        shapesContainer.appendChild(piece);

    });

}

// ---------------------------
// Klaar?
// ---------------------------

function checkFinished(){

    const completed =
        document.querySelectorAll(".target img:not([src*='-shadow'])").length;

    if(completed === 3){

        setTimeout(newRound,500);

    }

}

// ---------------------------
// Start
// ---------------------------

newRound();
