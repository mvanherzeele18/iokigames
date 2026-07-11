// =====================================
// Ioki Games - Memory
// =====================================

const themeScreen = document.getElementById("theme-screen");
const amountScreen = document.getElementById("amount-screen");
const memoryBoard = document.getElementById("memory-board");

const themeButtons =
    document.querySelectorAll("[data-theme]");

const amountButtons =
    document.querySelectorAll("[data-cards]");

let selectedTheme = "";
let selectedCards = 0;

let firstCard = null;
let secondCard = null;

let lockBoard = false;
let matchedPairs = 0;

// ---------------------------
// Thema kiezen
// ---------------------------

themeButtons.forEach(button => {

    button.addEventListener("click", () => {

        selectedTheme = button.dataset.theme;

        themeScreen.classList.add("hidden");
        amountScreen.classList.remove("hidden");

    });

});

// ---------------------------
// Aantal kaarten kiezen
// ---------------------------

amountButtons.forEach(button => {

    button.addEventListener("click", () => {

        selectedCards =
            Number(button.dataset.cards);

        startGame();

    });

});

// ---------------------------
// Spel starten
// ---------------------------

function startGame(){

    amountScreen.classList.add("hidden");

    memoryBoard.classList.remove("hidden");

    matchedPairs = 0;

    createCards();

}

// ---------------------------
// Kaarten maken
// ---------------------------

function createCards(){

    memoryBoard.innerHTML = "";

    const pairCount = selectedCards / 2;

    let cards = [];

    for(let i = 1; i <= pairCount; i++){

        cards.push(i);
        cards.push(i);

    }

    cards.sort(() => Math.random() - 0.5);

    if(selectedCards === 6){

        memoryBoard.style.gridTemplateColumns =
            "repeat(3,1fr)";

    }

    else if(selectedCards === 8){

        memoryBoard.style.gridTemplateColumns =
            "repeat(4,1fr)";

    }

    else{

        memoryBoard.style.gridTemplateColumns =
            "repeat(5,1fr)";

    }

    cards.forEach(value => {

        const card = document.createElement("div");

        card.className = "card";

        card.dataset.value = value;

        card.innerHTML =
            '<div class="card-front">❓</div>' +
            '<div class="card-back">' +
            '<img src="../assets/images/memory/' +
            selectedTheme +
            '/' +
            value +
            '.png">' +
            '</div>';

        card.addEventListener("click", flipCard);

        memoryBoard.appendChild(card);

    });

}

// ---------------------------
// Kaart omdraaien
// ---------------------------

function flipCard(){

    if(lockBoard) return;

    if(this === firstCard) return;

    this.classList.add("flipped");

    if(!firstCard){

        firstCard = this;

        return;

    }

    secondCard = this;

    checkMatch();

}

// ---------------------------
// Vergelijken
// ---------------------------

function checkMatch(){

    const match =
        firstCard.dataset.value ===
        secondCard.dataset.value;

    if(match){

        firstCard = null;
        secondCard = null;

        matchedPairs++;

        if(matchedPairs === selectedCards / 2){
        
            setTimeout(() => {
        
                // Bord verbergen
                memoryBoard.classList.add("hidden");
                memoryBoard.innerHTML = "";
        
                // Terug naar eerste scherm
                amountScreen.classList.add("hidden");
                themeScreen.classList.remove("hidden");
        
                // Variabelen resetten
                selectedTheme = "";
                selectedCards = 0;
        
                firstCard = null;
                secondCard = null;
                matchedPairs = 0;
                lockBoard = false;
        
            },1000);
        
        }

    }

    else{

        lockBoard = true;

        setTimeout(() => {

            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");

            firstCard = null;
            secondCard = null;

            lockBoard = false;

        },1000);

    }

}
