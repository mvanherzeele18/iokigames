// =====================================
// Ioki Games - Fruit
// =====================================

const field = document.getElementById("field");
const fruitsContainer = document.getElementById("fruits");
const basket = document.getElementById("basket");

// ---------------------------
// Geluid
// ---------------------------

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
// Fruit maken
// ---------------------------

function spawnFruit(){

    const fruit = document.createElement("img");

    const type =
        fruitTypes[Math.floor(Math.random() * fruitTypes.length)];

    fruit.src =
        "../assets/images/fruit/" + type + ".png";

    fruit.className = "fruit";

    const leftTree = Math.random() < 0.5;

    const startX = leftTree
        ? 90 + Math.random() * 80
        : field.clientWidth - 170 + Math.random() * 80;

    fruit.style.left = startX + "px";
    fruit.style.top = "80px";

    fruitsContainer.appendChild(fruit);

    fruits.push({

        element: fruit,

        x: startX,
        y: 80,

        speed: 2 + Math.random() * 2

    });

}

setInterval(spawnFruit,1200);

// ---------------------------
// Mand besturen
// ---------------------------

function moveBasket(clientX){

    const rect = field.getBoundingClientRect();

    let x = clientX - rect.left;

    const basketWidth = basket.offsetWidth;

    x -= basketWidth / 2;

    x = Math.max(
        0,
        Math.min(field.clientWidth - basketWidth, x)
    );

    basket.style.left = x + "px";

    basket.style.transform = "none";

}

// Muis

field.addEventListener("mousemove",(e)=>{

    moveBasket(e.clientX);

});

// Touch

field.addEventListener("touchmove",(e)=>{

    e.preventDefault();

    moveBasket(e.touches[0].clientX);

},{passive:false});

// ---------------------------
// Update
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
