// ===========================
// Ballonnen - Ioki Games
// ===========================

import { checkGameAccess } from "../guard.js";

const session=

await checkGameAccess("memory");

if(!session) return;

// Alle ballonafbeeldingen
const balloonImages = [
    "../assets/images/balloons/red.png",
    "../assets/images/balloons/blue.png",
    "../assets/images/balloons/green.png",
    "../assets/images/balloons/yellow.png",
    "../assets/images/balloons/purple.png"
];

// Spelgebied
const game = document.getElementById("game");

// Maak één ballon
function createBalloon() {

    const balloon = document.createElement("img");
    balloon.className = "balloon";

    // Willekeurige kleur
    const randomImage = balloonImages[Math.floor(Math.random() * balloonImages.length)];
    balloon.src = randomImage;

    // Willekeurige grootte
    const size = 70 + Math.random() * 50;
    balloon.style.width = size + "px";

    // Willekeurige positie
    balloon.style.left = Math.random() * 90 + "vw";

    // Willekeurige snelheid
    balloon.style.animationDuration = (5 + Math.random() * 3) + "s";

    // Ballon kapot tikken
    balloon.addEventListener("click", () => {

        // Voorkom dubbel klikken
        balloon.style.pointerEvents = "none";

        // Pop-geluid
        const pop = new Audio("../assets/sounds/pop.mp3");
        pop.play();

        const rect = balloon.getBoundingClientRect();

        createPopEffect(
            rect.left + rect.width / 2,
            rect.top + rect.height / 2
        );
        
        balloon.classList.add("pop");

        // Ballon verwijderen
        setTimeout(() => {
            balloon.remove();
        }, 180);

    });

    // Ballon verwijderen als hij boven uit beeld vliegt
    balloon.addEventListener("animationend", () => {
        balloon.remove();
    });

    // Voeg ballon toe aan het spel
    game.appendChild(balloon);

}
function createPopEffect(x, y){

    const pop = document.createElement("div");

    pop.className = "pop-effect";
    pop.textContent = "💥";

    pop.style.left = x + "px";
    pop.style.top = y + "px";

    game.appendChild(pop);

    setTimeout(() => {
        pop.remove();
    }, 300);

}
// Elke 700 ms een nieuwe ballon
setInterval(createBalloon, 700);
