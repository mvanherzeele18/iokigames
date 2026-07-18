const orderLabel =
document.getElementById("order");

const pizza =
document.getElementById("pizza");

const ingredientsDiv =
document.getElementById("ingredients");

const ALL_INGREDIENTS = [

    "🍅",
    "🧀",
    "🍄",
    "🫒",
    "🌶️",
    "🍍",
    "🥓",
    "🧅"

];

let currentOrder = [];

let currentPizza = [];

createButtons();

newOrder();

function createButtons(){

    ingredientsDiv.innerHTML = "";

    ALL_INGREDIENTS.forEach(ingredient=>{

        const button =
        document.createElement("button");

        button.className =
        "ingredient";

        button.textContent =
        ingredient;

        button.addEventListener(

            "click",

            ()=>{

                addIngredient(

                    ingredient

                );

            }

        );

        ingredientsDiv.appendChild(

            button

        );

    });

}

function newOrder(){

    currentPizza = [];

    pizza.innerHTML = "";

    currentOrder = [];

    const amount =

    random(

        2,

        5

    );

    const pool =

    [...ALL_INGREDIENTS];

    shuffle(pool);

    for(

        let i = 0;

        i < amount;

        i++

    ){

        currentOrder.push(

            pool[i]

        );

    }

    orderLabel.textContent =

        "Maak deze pizza: "

        +

        currentOrder.join(" ");

}

function addIngredient(

    ingredient

){

    currentPizza.push(

        ingredient

    );

    const topping =

    document.createElement("div");

    topping.className =

    "topping";

    topping.textContent =

    ingredient;

    topping.style.left =

    random(

        20,

        80

    ) + "%";

    topping.style.top =

    random(

        20,

        80

    ) + "%";

    pizza.appendChild(

        topping

    );

}

function random(

    min,

    max

){

    return Math.floor(

        Math.random()

        *

        (

            max-min+1

        )

    )+min;

}

function shuffle(

    array

){

    for(

        let i=array.length-1;

        i>0;

        i--

    ){

        const j=

        Math.floor(

            Math.random()

            *

            (

                i+1

            )

        );

        [

            array[i],

            array[j]

        ]=

        [

            array[j],

            array[i]

        ];

    }

}

const checkButton =
document.getElementById("check-button");

checkButton.addEventListener(

    "click",

    checkPizza

);

function checkPizza(){

    if(

        currentPizza.length !==

        currentOrder.length

    ){

        wrongPizza();

        return;

    }

    const order =

    [...currentOrder].sort();

    const pizzaItems =

    [...currentPizza].sort();

    for(

        let i = 0;

        i < order.length;

        i++

    ){

        if(

            order[i] !==

            pizzaItems[i]

        ){

            wrongPizza();

            return;

        }

    }

    goodPizza();

}

function goodPizza(){

    orderLabel.textContent =

    "🎉 Lekker!";

    checkButton.disabled = true;

    setTimeout(()=>{

        checkButton.disabled = false;

        newOrder();

    },1500);

}

function wrongPizza(){

    orderLabel.textContent =

    "❌ Probeer opnieuw!";

    pizza.animate(

        [

            {

                transform:"translateX(-8px)"

            },

            {

                transform:"translateX(8px)"

            },

            {

                transform:"translateX(-8px)"

            },

            {

                transform:"translateX(8px)"

            },

            {

                transform:"translateX(0)"

            }

        ],

        {

            duration:300

        }

    );

    setTimeout(()=>{

        orderLabel.textContent =

        "Maak deze pizza: "

        +

        currentOrder.join(" ");

    },1200);

}
