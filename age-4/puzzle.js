// =====================================
// Ioki Games - Puzzels
// Deel 1
// =====================================

const categoryScreen = document.getElementById("category-screen");
const sizeScreen = document.getElementById("size-screen");
const puzzleBoard = document.getElementById("puzzle-board");

const correctSound = new Audio("../assets/sounds/correct.mp3");

let category = "";
let gridSize = 2;

let boardSize = 0;
let pieceSize = 0;

let imagePath = "";

let pieces = [];

let draggedPiece = null;
let startX = 0;
let startY = 0;

// -------------------------------------
// Categorie kiezen
// -------------------------------------

document.querySelectorAll(".category").forEach(button => {

    button.addEventListener("click", () => {

        category = button.dataset.category;

        categoryScreen.classList.add("hidden");
        sizeScreen.classList.remove("hidden");

    });

});

// -------------------------------------
// Grootte kiezen
// -------------------------------------

document.querySelectorAll(".amount").forEach(button => {

    button.addEventListener("click", () => {

        gridSize = Number(button.dataset.size);

        sizeScreen.classList.add("hidden");

        startPuzzle();

    });

});

// -------------------------------------
// Start puzzel
// -------------------------------------

function startPuzzle() {

    boardSize = Math.min(window.innerWidth * 0.8, 520);

    if (window.innerWidth < 700) {
        boardSize = Math.min(window.innerWidth * 0.9, 340);
    }

    pieceSize = boardSize / gridSize;

    puzzleBoard.innerHTML = "";
    puzzleBoard.classList.remove("hidden");

    puzzleBoard.style.width = boardSize + "px";
    puzzleBoard.style.height = boardSize + "px";

    puzzleBoard.style.gridTemplateColumns = `repeat(${gridSize},1fr)`;

    imagePath =
        `../assets/images/puzzles/${category}/${Math.floor(Math.random() * 5) + 1}.png`;

    buildPieces();
    enableDragging(); // ⭐ drag pas NA stukjes
}

// -------------------------------------
// Stukjes bouwen
// -------------------------------------

function buildPieces() {

    pieces = [];

    // Juiste volgorde
    for (let row = 0; row < gridSize; row++) {

        for (let col = 0; col < gridSize; col++) {

            pieces.push({
                id: row * gridSize + col,
                correctRow: row,
                correctCol: col,
                currentRow: row,
                currentCol: col,
                element: null
            });

        }

    }

    shuffle(pieces);

    puzzleBoard.innerHTML = "";

    pieces.forEach((piece, index) => {

        piece.currentRow = Math.floor(index / gridSize);
        piece.currentCol = index % gridSize;

        const div = document.createElement("div");

        div.className = "piece";

        div.style.width = pieceSize + "px";
        div.style.height = pieceSize + "px";

        div.style.backgroundImage = `url(${imagePath})`;

        div.style.backgroundSize = `${boardSize}px ${boardSize}px`;

        div.style.backgroundPosition =
            `${-piece.correctCol * pieceSize}px ${-piece.correctRow * pieceSize}px`;

        div.dataset.id = piece.id;

        piece.element = div;

        puzzleBoard.appendChild(div);

    });

}

// -------------------------------------
// Fisher-Yates shuffle
// -------------------------------------

function shuffle(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] =
        [array[j], array[i]];

    }

}

// =====================================
// Deel 2 - Drag Engine
// =====================================

function enableDragging() {

    pieces.forEach(piece => {

        const element = piece.element;

        // Drag starten
        element.addEventListener("pointerdown", e => {

            draggedPiece = piece;

            startX = e.clientX;
            startY = e.clientY;

            element.classList.add("dragging");

            element.style.transition = "none";

            element.setPointerCapture(e.pointerId);

        });

        // Slepen
        element.addEventListener("pointermove", e => {

            if (draggedPiece !== piece) return;

            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            element.style.zIndex = 1000;

            element.style.transform =
                `translate(${dx}px,${dy}px) scale(1.05)`;

        });

        // Loslaten
        element.addEventListener("pointerup", e => {

            if (draggedPiece !== piece) return;

            element.releasePointerCapture(e.pointerId);

            element.classList.remove("dragging");

            const rect = element.getBoundingClientRect();

            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            let targetPiece = null;

            pieces.forEach(other => {

                if (other === piece) return;

                const otherRect =
                    other.element.getBoundingClientRect();

                if (
                    centerX >= otherRect.left &&
                    centerX <= otherRect.right &&
                    centerY >= otherRect.top &&
                    centerY <= otherRect.bottom
                ) {
                    targetPiece = other;
                }

            });

            if (targetPiece) {
                swapPieces(piece, targetPiece);
            }

            element.style.transition = "transform .25s";

            element.style.transform = "translate(0,0)";

            element.style.zIndex = "";

            draggedPiece = null;

        });

    });

}

// -------------------------------------
// Stukjes wisselen
// -------------------------------------

function swapPieces(pieceA, pieceB) {

    const tempRow = pieceA.currentRow;
    const tempCol = pieceA.currentCol;

    pieceA.currentRow = pieceB.currentRow;
    pieceA.currentCol = pieceB.currentCol;

    pieceB.currentRow = tempRow;
    pieceB.currentCol = tempCol;

    // volgorde in array wisselen
    const indexA = pieces.indexOf(pieceA);
    const indexB = pieces.indexOf(pieceB);

    pieces[indexA] = pieceB;
    pieces[indexB] = pieceA;

    // DOM opnieuw opbouwen
    puzzleBoard.innerHTML = "";

    pieces.forEach(piece => {
        puzzleBoard.appendChild(piece.element);
    });

    checkSolved();

}

// -------------------------------------
// Check of puzzel klaar is
// -------------------------------------

function checkSolved() {

    const solved = pieces.every(piece =>
        piece.currentRow === piece.correctRow &&
        piece.currentCol === piece.correctCol
    );

    if (!solved) return;

    correctSound.play();

    // 5 seconden wachten
    setTimeout(() => {

        // puzzel verbergen
        puzzleBoard.classList.add("hidden");

        // schermen resetten
        sizeScreen.classList.add("hidden");

        // terug naar categorie
        categoryScreen.classList.remove("hidden");

    }, 5000);

}


