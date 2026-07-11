// =====================================
// Ioki Games - Sorteren
// =====================================

const object = document.getElementById("object");

const baskets = document.querySelectorAll(".basket");

const correctSound = new Audio("../assets/sounds/pop.mp3");
const wrongSound = new Audio("../assets/sounds/wrong.mp3");

// ---------------------------
// Voorwerpen
// ---------------------------

const objects = [

    {
        image:"apple-red.png",
        color:"red"
    },

    {
        image:"strawberry-red.png",
        color:"red"
    },

    {
        image:"ball-red.png",
        color:"red"
    },

    {
        image:"banana-yellow.png",
        color:"yellow"
    },

    {
        image:"duck-yellow.png",
        color:"yellow"
    },

    {
        image:"star-yellow.png",
        color:"yellow"
    },

    {
        image:"fish-blue.png",
        color:"blue"
    },

    {
        image:"car-blue.png",
        color:"blue"
    },

    {
        image:"balloon-blue.png",
        color:"blue"
    }

];

let currentObject;

let startX;
let startY;

let dragging = false;

// ---------------------------
// Nieuw voorwerp
// ---------------------------

function newObject(){

    currentObject =
        objects[Math.floor(Math.random() * objects.length)];

    object.src =
        "../assets/images/sorting/" +
        currentObject.image;

    object.style.transition = "none";

    object.style.left = "0px";
    object.style.top = "0px";

    object.style.transform = "";

}

// ---------------------------
// Start slepen
// ---------------------------

object.addEventListener("pointerdown", e => {

    dragging = true;

    startX = e.clientX;
    startY = e.clientY;

    object.setPointerCapture(e.pointerId);

    object.style.cursor = "grabbing";

});

// ---------------------------
// Slepen
// ---------------------------

object.addEventListener("pointermove", e => {

    if(!dragging) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    object.style.transform =
        `translate(${dx}px, ${dy}px)`;

});

// ---------------------------
// Loslaten
// ---------------------------

object.addEventListener("pointerup", e => {

    if(!dragging) return;

    dragging = false;

    object.releasePointerCapture(e.pointerId);

    object.style.cursor = "grab";

    let correct = false;

    baskets.forEach(basket => {

        const basketRect = basket.getBoundingClientRect();
        const objectRect = object.getBoundingClientRect();

        const centerX =
            objectRect.left + objectRect.width / 2;

        const centerY =
            objectRect.top + objectRect.height / 2;

        if(

            centerX >= basketRect.left &&
            centerX <= basketRect.right &&
            centerY >= basketRect.top &&
            centerY <= basketRect.bottom

        ){

            if(basket.dataset.color === currentObject.color){

                correct = true;

            }

        }

    });

    if(correct){

        correctSound.currentTime = 0;
        correctSound.play();

        object.style.transition =
            "transform .25s";

        object.style.transform =
            "scale(0)";

        setTimeout(() => {

            newObject();

        },250);

    }

    else{

        wrongSound.currentTime = 0;
        wrongSound.play();

        object.animate([

            {transform:object.style.transform},
            {transform:object.style.transform + " translateX(-10px)"},
            {transform:object.style.transform + " translateX(10px)"},
            {transform:object.style.transform + " translateX(-10px)"},
            {transform:"translate(0,0)"}

        ],{

            duration:350

        });

        object.style.transition =
            "transform .3s";

        object.style.transform =
            "translate(0,0)";

    }

});

// ---------------------------
// Start
// ---------------------------

newObject();
