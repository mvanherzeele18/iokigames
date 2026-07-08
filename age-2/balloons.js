const balloonImages = [
    "../assets/images/balloons/red.png",
    "../assets/images/balloons/blue.png",
    "../assets/images/balloons/green.png",
    "../assets/images/balloons/yellow.png",
    "../assets/images/balloons/purple.png"
];

const game = document.getElementById("game");

function createBalloon() {

    const balloon = document.createElement("img");

    balloon.classList.add("balloon");

    balloon.src = balloonImages[Math.floor(Math.random() * balloonImages.length)];

    // Willekeurige grootte
    const size = 70 + Math.random() * 50;
    balloon.style.width = size + "px";

    // Willekeurige positie
    balloon.style.left = Math.random() * 90 + "vw";

    // Willekeurige snelheid
    balloon.style.animationDuration = (5 + Math.random() * 3) + "s";

    balloon.addEventListener("click", () => {

        balloon.classList.add("pop");

        setTimeout(() => {
            balloon.remove();
        }, 180);

    });

    balloon.addEventListener("animationend", () => {
        balloon.remove();
    });

    game.appendChild(balloon);

}

setInterval(createBalloon, 700);
