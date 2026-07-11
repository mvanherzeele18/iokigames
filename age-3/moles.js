// =====================================
// Ioki Games - Mollen
// =====================================

const holes = document.querySelectorAll(".hole");

const popSound = new Audio("../assets/sounds/pop.mp3");

let currentHole = null;
let currentMole = null;

// ---------------------------
// Mol tonen
// ---------------------------

function showMole(){

    // Oude mol verwijderen

    if(currentMole){

        currentMole.remove();

    }

    // Willekeurig gat kiezen

    const randomIndex =
        Math.floor(Math.random() * holes.length);

    currentHole = holes[randomIndex];

    // Mol maken

    currentMole = document.createElement("img");

    currentMole.src =
        "../assets/images/moles/mole.png";

    currentMole.className = "mole";

    currentHole.appendChild(currentMole);

    // Klikken op mol

    currentMole.addEventListener("click",hitMole);
    currentMole.addEventListener("touchstart",hitMole,{passive:true});

    // Na 1 seconde verdwijnt hij

    setTimeout(()=>{

        if(currentMole){

            currentMole.remove();

            currentMole = null;

        }

    },1000);

}

// ---------------------------
// Mol geraakt
// ---------------------------

function hitMole(){

    if(!currentMole) return;

    popSound.currentTime = 0;
    popSound.play();

    currentMole.remove();

    currentMole = null;

}

// ---------------------------
// Nieuwe mol
// ---------------------------

setInterval(showMole,1500);

// Eerste mol

showMole();
