// =====================================
// Ioki Games - Opruimen
// =====================================

const toysContainer = document.getElementById("toys");
const toyBox = document.getElementById("toy-box");

const toyImages = [

    "teddy.png",
    "car.png",
    "ball.png",
    "blocks.png",
    "duck.png",
    "train.png",
    "robot.png",
    "dinosaur.png"

];

const TOY_SIZE = 80;

// ---------------------------
// Nieuw speeltje
// ---------------------------

function createToy(){

    const toy = document.createElement("img");

    toy.className = "toy";

    toy.src = "../assets/images/cleanup/" +
        toyImages[Math.floor(Math.random()*toyImages.length)];

    toy.draggable = false;

    const maxX = toysContainer.clientWidth - TOY_SIZE;

    // Alleen op de vloer
    const minY = toysContainer.clientHeight * 0.55;
    const maxY = toysContainer.clientHeight - TOY_SIZE - 30;

    toy.style.left = Math.random()*maxX + "px";
    toy.style.top = minY + Math.random()*(maxY-minY) + "px";

    toysContainer.appendChild(toy);

    makeDraggable(toy);

}

// ---------------------------
// Slepen
// ---------------------------

function makeDraggable(toy){

    let dragging = false;

    let offsetX = 0;
    let offsetY = 0;

    function start(x,y){

        dragging = true;

        toy.style.zIndex = 100;

        const rect = toy.getBoundingClientRect();

        offsetX = x - rect.left;
        offsetY = y - rect.top;

    }

    function move(x,y){

        if(!dragging) return;

        const room = toysContainer.getBoundingClientRect();

        let left = x - room.left - offsetX;
        let top = y - room.top - offsetY;

        left = Math.max(0, Math.min(left, room.width - TOY_SIZE));
        top = Math.max(0, Math.min(top, room.height - TOY_SIZE));

        toy.style.left = left + "px";
        toy.style.top = top + "px";

    }

    function end(){

        if(!dragging) return;

        dragging = false;

        toy.style.zIndex = "";

        const toyRect = toy.getBoundingClientRect();
        const boxRect = toyBox.getBoundingClientRect();

        if(

            toyRect.left < boxRect.right &&
            toyRect.right > boxRect.left &&
            toyRect.top < boxRect.bottom &&
            toyRect.bottom > boxRect.top

        ){

            new Audio("../assets/sounds/pop.mp3").play();

            toy.remove();

            setTimeout(createToy,2000);

        }

    }

    toy.addEventListener("mousedown",e=>{

        start(e.clientX,e.clientY);

    });

    window.addEventListener("mousemove",e=>{

        move(e.clientX,e.clientY);

    });

    window.addEventListener("mouseup",end);

    toy.addEventListener("touchstart",e=>{

        const touch = e.touches[0];

        start(touch.clientX,touch.clientY);

    });

    window.addEventListener("touchmove",e=>{

        if(!dragging) return;

        e.preventDefault();

        const touch = e.touches[0];

        move(touch.clientX,touch.clientY);

    },{passive:false});

    window.addEventListener("touchend",end);

}

// ---------------------------
// Start
// ---------------------------

for(let i=0;i<6;i++){

    createToy();

}
