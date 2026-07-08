// ===========================
// Ioki Games
// Algemene functies
// ===========================

function createCloud() {

    const cloud = document.createElement("div");

    cloud.className = "cloud";

    const width = 120 + Math.random() * 120;

    cloud.style.width = width + "px";
    cloud.style.height = (width * 0.45) + "px";

    cloud.style.top = Math.random() * 40 + "vh";

    cloud.style.animationDuration = (35 + Math.random() * 35) + "s";

    cloud.style.animationDelay = -(Math.random() * 70) + "s";

    document.body.appendChild(cloud);

}

function createClouds(amount = 6) {

    for(let i = 0; i < amount; i++) {
        createCloud();
    }

}
