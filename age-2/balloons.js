const balloons = [
    "../assets/images/balloons/red.png",
    "../assets/images/balloons/blue.png",
    "../assets/images/balloons/green.png",
    "../assets/images/balloons/yellow.png",
    "../assets/images/balloons/purple.png"
];

function maakBallon(){

    const ballon = document.createElement("img");

    ballon.className = "balloon";

    ballon.src = balloons[Math.floor(Math.random()*balloons.length)];

    ballon.style.left = Math.random()*85 + "vw";

    const grootte = 70 + Math.random()*60;

    ballon.style.width = grootte + "px";

    ballon.style.animationDuration =
        (5 + Math.random()*3) + "s";

    ballon.onclick = () => {

        ballon.style.transform = "scale(1.3)";

        ballon.style.opacity = "0";

        setTimeout(()=>{
            ballon.remove();
        },150);

    };

    document.getElementById("game").appendChild(ballon);

    ballon.addEventListener("animationend",()=>{

        ballon.remove();

    });

}

setInterval(maakBallon,700);
