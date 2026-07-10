// =====================================
// Ioki Games - Fruit
// =====================================

const field = document.getElementById("field");
const fruitsContainer = document.getElementById("fruits");
const basket = document.getElementById("basket");

const catchSound = new Audio("../assets/sounds/catch.mp3");

// ---------------------------
// Fruit
// ---------------------------

const fruitTypes = [
    "apple",
    "banana",
    "orange",
    "pear",
    "strawberry"
];

const fruits = [];

// ---------------------------
// Mand
// ---------------------------

let dragging = false;

// ---------------------------
// Fruit laten vallen
// ---------------------------

function spawnFruit(){

    const fruit = document.createElement("img");

    fruit.className = "fruit";

    const type =
        fruitTypes[Math.floor(Math.random() * fruitTypes.length)];

    fruit.src =
        "../assets/images/fruit/" + type + ".png";

    // Linker of rechter boom

    let x;

    if(Math.random() < 0.5){

        x = 120 + Math.random() * 70;

    }else{

        x = field.clientWidth - 200 + Math.random() * 70;

    }

    const y = 95;

    fruit.style.left = x + "px";
    fruit.style.top = y + "px";

    fruitsContainer.appendChild(fruit);

    fruits.push({

        element: fruit,

        x: x,
        y: y,

        speed: 2 + Math.random() * 2

    });

}

setInterval(spawnFruit,1200);

// ---------------------------
// Mand bewegen
// ---------------------------

function moveBasket(clientX){

    const rect = field.getBoundingClientRect();

    let x = clientX - rect.left;

    x -= basket.offsetWidth / 2;

    x = Math.max(
        0,
        Math.min(field.clientWidth - basket.offsetWidth, x)
    );

    basket.style.left = x + "px";
    basket.style.transform = "none";

}

// ---------------------------
// Muis
// ---------------------------

basket.addEventListener("mousedown",()=>{

    dragging = true;

});

window.addEventListener("mouseup",()=>{

    dragging = false;

});

window.addEventListener("mousemove",(e)=>{

    if(!dragging) return;

    moveBasket(e.clientX);

});

// ---------------------------
// Touch
// ---------------------------

basket.addEventListener("touchstart",(e)=>{

    dragging = true;

    e.preventDefault();

},{passive:false});

window.addEventListener("touchend",()=>{

    dragging = false;

});

window.addEventListener("touchmove",(e)=>{

    if(!dragging) return;

    e.preventDefault();

    moveBasket(e.touches[0].clientX);

},{passive:false});

// ---------------------------
// Spel
// ---------------------------

function update(){

    const basketRect = basket.getBoundingClientRect();

    for(let i = fruits.length - 1; i >= 0; i--){

        const fruit = fruits[i];

        fruit.y += fruit.speed;

        fruit.element.style.top = fruit.y + "px";

        const fruitRect =
            fruit.element.getBoundingClientRect();

        const caught = !(

            fruitRect.right < basketRect.left ||
            fruitRect.left > basketRect.right ||
            fruitRect.bottom < basketRect.top ||
            fruitRect.top > basketRect.bottom

        );

        if(caught){

            catchSound.currentTime = 0;
            catchSound.play();

            fruit.element.remove();

            fruits.splice(i,1);

            continue;

        }

        if(fruit.y > field.clientHeight){

            fruit.element.remove();

            fruits.splice(i,1);

        }

    }

    requestAnimationFrame(update);

}

update();
