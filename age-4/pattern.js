// =====================================
// Ioki Games - Patroon
// =====================================

const startButton = document.getElementById("start-button");

const buttons = {

    red: document.querySelector(".red"),
    blue: document.querySelector(".blue"),
    green: document.querySelector(".green"),
    yellow: document.querySelector(".yellow")

};

// ---------------------------
// Geluiden
// ---------------------------

const sounds = {

    red: new Audio("../assets/sounds/music/do.wav"),
    blue: new Audio("../assets/sounds/mi.wav"),
    green: new Audio("../assets/sounds/sol.wav"),
    yellow: new Audio("../assets/sounds/do2.wav"),
    wrong: new Audio("../assets/sounds/wrong.mp3")

};

const colors = [

    "red",
    "blue",
    "green",
    "yellow"

];

let sequence = [];

let playerSequence = [];

let playerTurn = false;

// ---------------------------
// Willekeurige kleur
// ---------------------------

function randomColor(){

    return colors[Math.floor(Math.random() * colors.length)];

}

// ---------------------------
// Knop laten oplichten
// ---------------------------

function flash(color){

    const button = buttons[color];

    button.classList.add("active");

    const sound = sounds[color];

    sound.currentTime = 0;
    sound.play();

    setTimeout(()=>{

        button.classList.remove("active");

    },500);

}

// ---------------------------
// Volgende ronde
// ---------------------------

function nextRound(){

    playerTurn = false;

    playerSequence = [];

    sequence.push(randomColor());

    playSequence();

}

// ---------------------------
// Patroon afspelen
// ---------------------------

function playSequence(){

    let i = 0;

    const interval = setInterval(()=>{

        flash(sequence[i]);

        i++;

        if(i >= sequence.length){

            clearInterval(interval);

            setTimeout(()=>{

                playerTurn = true;

            },600);

        }

    },800);

}

// ---------------------------
// Klik op kleur
// ---------------------------

Object.keys(buttons).forEach(color=>{

    buttons[color].addEventListener("click",()=>{

        if(!playerTurn) return;

        flash(color);

        playerSequence.push(color);

        const index = playerSequence.length - 1;

        // Fout

        if(playerSequence[index] !== sequence[index]){

            playerTurn = false;

            sounds.wrong.currentTime = 0;
            sounds.wrong.play();

            setTimeout(()=>{

                sequence = [];

                playerSequence = [];

                startButton.style.display = "block";

            },600);

            return;

        }

        // Hele patroon juist

        if(playerSequence.length === sequence.length){

            playerTurn = false;

            setTimeout(()=>{

                nextRound();

            },800);

        }

    });

});

// ---------------------------
// Start
// ---------------------------

startButton.addEventListener("click",()=>{

    startButton.style.display = "none";

    sequence = [];
    playerSequence = [];

    nextRound();

});
