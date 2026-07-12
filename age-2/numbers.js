// =====================================
// Ioki Games - Cijfers
// =====================================

const objectsContainer = document.getElementById("objects");
const buttons = document.querySelectorAll(".answer-button");

const correctSound = new Audio("../assets/sounds/correct.mp3");
const wrongSound = new Audio("../assets/sounds/wrong.mp3");

const objects = [
    "apple.png",
    "ball.png",
    "car.png",
    "duck.png",
    "fish.png",
    "flower.png",
    "star.png"
];

// ---------------------------
// Nieuwe opdracht
// ---------------------------

function newQuestion(){

    objectsContainer.innerHTML = "";

    // Willekeurig object

    const object =
        objects[Math.floor(Math.random() * objects.length)];

    // Juiste aantal (1 t.e.m. 9)

    const correct = Math.floor(Math.random() * 9) + 1;

    // Afbeeldingen tonen

    for(let i = 0; i < correct; i++){

        const img = document.createElement("img");

        img.src = "../assets/images/numbers/" + object;

        objectsContainer.appendChild(img);

    }

    // Antwoorden maken

    let answers = [correct];

    while(answers.length < 3){

        const random = Math.floor(Math.random() * 9) + 1;

        if(!answers.includes(random)){

            answers.push(random);

        }

    }

    // Door elkaar zetten

    answers.sort(() => Math.random() - 0.5);

    // Knoppen invullen

    buttons.forEach((button,index)=>{

        button.textContent = answers[index];

        button.onclick = ()=>{

            if(answers[index] === correct){

                correctSound.currentTime = 0;
                correctSound.play();

                setTimeout(newQuestion,400);

            }else{

                wrongSound.currentTime = 0;
                wrongSound.play();

                button.animate(

                    [

                        { transform:"translateX(0)" },
                        { transform:"translateX(-10px)" },
                        { transform:"translateX(10px)" },
                        { transform:"translateX(-10px)" },
                        { transform:"translateX(0)" }

                    ],

                    {

                        duration:300

                    }

                );

            }

        };

    });

}

// ---------------------------
// Start
// ---------------------------

newQuestion();
