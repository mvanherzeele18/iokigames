function maakBallon(){

    const ballon = document.createElement("div");

    ballon.className = "balloon";

    ballon.innerHTML = "🎈";

    ballon.style.left = Math.random() * 90 + "vw";

    ballon.style.animationDuration =
        (4 + Math.random() * 3) + "s";

    ballon.onclick = () => {

        ballon.innerHTML = "💥";

        setTimeout(() => {

            ballon.remove();

        },200);

    };

    document.getElementById("game").appendChild(ballon);

    ballon.addEventListener("animationend",()=>{

        ballon.remove();

    });

}

setInterval(maakBallon,700);