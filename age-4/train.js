// =====================================
// Ioki Games - Trein
// =====================================

const train = document.getElementById("train");
const exampleTrain = document.getElementById("example-train");

const startButton = document.getElementById("start-button");
const wagonButtons = document.querySelectorAll(".wagon-button");

const colors = [
    "red",
    "blue",
    "green",
    "yellow"
];

let playerTrain = [];
let targetTrain = [];

let trainMoving = false;

const MAX_WAGONS = 4;

// ---------------------------
// Nieuwe opdracht
// ---------------------------

function newChallenge(){

    targetTrain = [];

    exampleTrain.innerHTML =
        '<img id="example-locomotive" src="../assets/images/train/locomotive.png">';

    const amount = Math.floor(Math.random() * 2) + 3;

    for(let i = 0; i < amount; i++){

        const color = colors[Math.floor(Math.random() * colors.length)];

        targetTrain.push(color);

        const wagon = document.createElement("img");

        wagon.src = "../assets/images/train/wagon-" + color + ".png";

        wagon.className = "example-wagon";

        exampleTrain.appendChild(wagon);

    }

}

// ---------------------------
// Trein resetten
// ---------------------------

function resetPlayerTrain(){

    playerTrain = [];

    train.innerHTML =
        '<img id="locomotive" src="../assets/images/train/locomotive.png">';

}

// ---------------------------
// Wagons toevoegen
// ---------------------------

wagonButtons.forEach(button=>{

    button.addEventListener("click",()=>{

        if(trainMoving) return;

        if(playerTrain.length >= MAX_WAGONS) return;

        const color = button.dataset.color;

        playerTrain.push(color);

        const wagon = document.createElement("img");

        wagon.src = "../assets/images/train/wagon-" + color + ".png";

        wagon.className = "wagon";

        train.appendChild(wagon);

    });

});

// ---------------------------
// Vergelijken
// ---------------------------

function correctTrain(){

    if(playerTrain.length !== targetTrain.length){

        return false;

    }

    for(let i=0;i<targetTrain.length;i++){

        if(playerTrain[i] !== targetTrain[i]){

            return false;

        }

    }

    return true;

}

// ---------------------------
// Schudden
// ---------------------------

function shakeTrain(){

    train.animate([

        {transform:"translateX(0)"},
        {transform:"translateX(-12px)"},
        {transform:"translateX(12px)"},
        {transform:"translateX(-12px)"},
        {transform:"translateX(12px)"},
        {transform:"translateX(0)"}

    ],{

        duration:500

    });

}

// ---------------------------
// Start
// ---------------------------

startButton.addEventListener("click",()=>{

    if(trainMoving) return;

    if(correctTrain()){

        trainMoving = true;

        startButton.disabled = true;

        const distance = train.offsetWidth + 400;

        train.style.transition = "transform 4s linear";
        train.style.transform = "translateX(-" + distance + "px)";

        setTimeout(()=>{

            resetPlayerTrain();

            newChallenge();

            train.style.transition = "none";
            train.style.transform =
                "translateX(" + (window.innerWidth + 300) + "px)";

            requestAnimationFrame(()=>{

                requestAnimationFrame(()=>{

                    train.style.transition =
                        "transform 1.5s linear";

                    train.style.transform = "translateX(0)";

                    trainMoving = false;
                    startButton.disabled = false;

                });

            });

        },4000);

    }

    else{

        shakeTrain();

        setTimeout(()=>{

            resetPlayerTrain();

        },500);

    }

});

// ---------------------------
// Eerste opdracht
// ---------------------------

newChallenge();
