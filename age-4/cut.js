// =====================================
// Ioki Games - Snijden
// =====================================

const startButton = document.getElementById("start-button");
const gameArea = document.getElementById("game-area");
const trail = document.getElementById("trail");

const sliceSound = new Audio("../assets/sounds/slice.mp3");

const fruits = [
    "apple.png",
    "banana.png",
    "orange.png",
    "pear.png",
    "strawberry.png",
    "watermelon.png"
];

let playing = false;
let spawnInterval;

// ---------------------------
// Fruit maken
// ---------------------------

function spawnFruit(){

    if(!playing) return;

    const fruit = document.createElement("img");

    fruit.src = "../assets/images/cut/" +
        fruits[Math.floor(Math.random()*fruits.length)];

    fruit.className = "fruit";

    const startX = Math.random() * (window.innerWidth - 120);

    fruit.style.left = startX + "px";
    fruit.style.top = (window.innerHeight + 120) + "px";

    gameArea.appendChild(fruit);

    const height = window.innerHeight + 200;
    const duration = 2200 + Math.random()*400;

    fruit.animate(

        [

            {
                transform:"translateY(0)"
            },

            {
                transform:"translateY(-"+height+"px)"
            }

        ],

        {

            duration:duration,
            easing:"ease-out"

        }

    );

    setTimeout(()=>{

        fruit.remove();

    },duration);

}

// ---------------------------
// Snijden
// ---------------------------

function slice(x,y){

    trail.style.display = "block";

    trail.style.left = x + "px";
    trail.style.top = y + "px";

    document.querySelectorAll(".fruit").forEach(fruit=>{

        const rect = fruit.getBoundingClientRect();

        if(

            x >= rect.left &&
            x <= rect.right &&
            y >= rect.top &&
            y <= rect.bottom

        ){

            if(fruit.dataset.cut) return;

            fruit.dataset.cut = "true";

            sliceSound.currentTime = 0;
            sliceSound.play();

            fruit.style.transition = ".2s";
            fruit.style.transform =
                "scale(1.4) rotate(25deg)";
            fruit.style.opacity = "0";

            setTimeout(()=>{

                fruit.remove();

            },200);

        }

    });

}

// ---------------------------
// Vinger / muis
// ---------------------------

window.addEventListener("pointermove",e=>{

    if(!playing) return;

    if(e.buttons===0 && e.pointerType==="mouse") return;

    slice(e.clientX,e.clientY);

});

window.addEventListener("pointerdown",e=>{

    if(!playing) return;

    slice(e.clientX,e.clientY);

});

window.addEventListener("pointerup",()=>{

    trail.style.display = "none";

});

// ---------------------------
// Start
// ---------------------------

startButton.addEventListener("click",()=>{

    startButton.style.display = "none";

    playing = true;

    spawnFruit();

    spawnInterval = setInterval(spawnFruit,900);

});
