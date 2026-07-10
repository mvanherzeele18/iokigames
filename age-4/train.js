// =====================================
// Ioki Games - Trein
// =====================================

const train = document.getElementById("train");

const startButton = document.getElementById("start-button");

const wagonButtons = document.querySelectorAll(".wagon-button");

let wagonCount = 0;
let trainMoving = false;
const MAX_WAGONS = 4;
// ---------------------------
// Wagons toevoegen
// ---------------------------

wagonButtons.forEach(button => {

    button.addEventListener("click", () => {

        if (trainMoving) return;

        if (wagonCount >= MAX_WAGONS) return;

        const color = button.dataset.color;

        const wagon = document.createElement("img");

        wagon.src = `../assets/images/train/wagon-${color}.png`;

        wagon.className = "wagon";

        wagon.draggable = false;

        train.appendChild(wagon);

        wagonCount++;

    });

});

// ---------------------------
// Trein laten rijden
// ---------------------------

startButton.addEventListener("click", () => {

    if (trainMoving) return;

    trainMoving = true;
    
    startButton.disabled = true;

    const distance = train.offsetWidth + 400;

    train.style.transform = translateX(-${distance}px);

    setTimeout(() => {

        // Alles verwijderen behalve de locomotief
        train.innerHTML = 
            <img
                id="locomotive"
                src="../assets/images/train/locomotive.png"
                alt="Locomotief"
            >
        ;

        wagonCount = 0;
        
        // Trein rechts buiten beeld zetten
        train.style.transition = "none";
        train.style.transform = translateX(${window.innerWidth + 300}px);

        // Browser de tijd geven om de positie toe te passen
        requestAnimationFrame(() => {

            requestAnimationFrame(() => {

                train.style.transition = "transform 1.5s linear";
                train.style.transform = "translateX(0)";

                startButton.disabled = false;
                trainMoving = false;

            });

        });

    }, 4000);

});
