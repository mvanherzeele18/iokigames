// ===========================
// Ioki Games
// Algemene functies
// ===========================

function createCloud(path = "assets/images/cloud.png") {

    const cloud = document.createElement("img");

    cloud.src = path;
    cloud.className = "cloud";

    const width = 140 + Math.random() * 180;

    cloud.style.width = width + "px";
    cloud.style.top = Math.random() * 35 + "vh";

    cloud.style.animationDuration = (45 + Math.random() * 30) + "s";
    cloud.style.animationDelay = -(Math.random() * 75) + "s";

    document.body.appendChild(cloud);
}

function createClouds(amount = 6, path = "assets/images/cloud.png") {

    for (let i = 0; i < amount; i++) {
        createCloud(path);
    }

}
