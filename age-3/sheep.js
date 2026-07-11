// =====================================
// Ioki Games - Schaapjes Scheren
// =====================================

const game = document.getElementById("game");
const sheepContainer = document.getElementById("sheep-container");
const scissors = document.getElementById("scissors");

const snipSound = new Audio("../assets/sounds/snip.mp3");

const sheepList = [];

// ---------------------------
// Schapen maken
// ---------------------------

for(let i = 0; i < 4; i++){

    const sheep = document.createElement("img");

    sheep.src = "../assets/images/sheep/sheep.png";

    sheep.className = "sheep";

    sheepContainer.appendChild(sheep);

    sheepList.push({

        element: sheep,

        x: Math.random() * (window.innerWidth - 150),

        y: window.innerHeight * 0.65 + Math.random() * 180,

        speed: 0.5 + Math.random() * 1,

        direction: Math.random() < 0.5 ? -1 : 1,

        shaved: false

    });

}

// ---------------------------
// Schaar
// ---------------------------

function moveScissors(x,y){

    scissors.style.left = x + "px";
    scissors.style.top = y + "px";

    checkSheep(x,y);

}

// ---------------------------
// Schapen scheren
// ---------------------------

function checkSheep(x,y){

    sheepList.forEach(sheep=>{

        if(sheep.shaved) return;

        const rect = sheep.element.getBoundingClientRect();

        if(

            x > rect.left &&
            x < rect.right &&
            y > rect.top &&
            y < rect.bottom

        ){

            sheep.shaved = true;

            sheep.element.src =
                "../assets/images/sheep/sheep-shaved.png";

            snipSound.currentTime = 0;
            snipSound.play();

            setTimeout(()=>{

                sheep.shaved = false;

                sheep.element.src =
                    "../assets/images/sheep/sheep.png";

            },5000);

        }

    });

}

// ---------------------------
// Muis
// ---------------------------

window.addEventListener("mousemove",(e)=>{

    moveScissors(e.clientX,e.clientY);

});

// ---------------------------
// Touch
// ---------------------------

window.addEventListener("touchstart",(e)=>{

    const touch = e.touches[0];

    moveScissors(touch.clientX,touch.clientY);

});

window.addEventListener("touchmove",(e)=>{

    e.preventDefault();

    const touch = e.touches[0];

    moveScissors(touch.clientX,touch.clientY);

},{passive:false});

// ---------------------------
// Schapen bewegen
// ---------------------------

function update(){

    sheepList.forEach(sheep=>{

        sheep.x += sheep.speed * sheep.direction;

        if(sheep.x < 0){

            sheep.x = 0;

            sheep.direction = 1;

        }

        if(sheep.x > window.innerWidth - 140){

            sheep.x = window.innerWidth - 140;

            sheep.direction = -1;

        }

        sheep.element.style.left = sheep.x + "px";
        sheep.element.style.top = sheep.y + "px";

        sheep.element.style.transform =
            sheep.direction === 1
            ? "scaleX(1)"
            : "scaleX(-1)";

    });

    requestAnimationFrame(update);

}

update();
