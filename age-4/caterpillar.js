// =====================================
// Ioki Games - Rups
// =====================================

const field = document.getElementById("field");
const caterpillar = document.getElementById("caterpillar");
const leavesContainer = document.getElementById("leaves");

const joystickBase = document.getElementById("joystick-base");
const joystickStick = document.getElementById("joystick-stick");

// ---------------------------
// Rups
// ---------------------------

let x = field.clientWidth / 2;
let y = field.clientHeight / 2;

let dx = 0;
let dy = 0;

const SPEED = 3;

// ---------------------------
// Blaadjes
// ---------------------------

const MAX_LEAVES = 5;

function spawnLeaf(){

    if(leavesContainer.children.length >= MAX_LEAVES) return;

    const leaf = document.createElement("div");

    leaf.className = "leaf";

    leaf.style.left =
        Math.random() * (field.clientWidth - 50) + "px";

    leaf.style.top =
        Math.random() * (field.clientHeight - 50) + "px";

    leavesContainer.appendChild(leaf);

}

setInterval(spawnLeaf,2500);

// Eerste blaadjes

for(let i=0;i<3;i++){

    spawnLeaf();

}

// ---------------------------
// Rups groeien
// ---------------------------

function grow(){

    const segment = document.createElement("div");

    segment.className = "segment";

    caterpillar.appendChild(segment);

}

// ---------------------------
// Joystick
// ---------------------------

let dragging = false;

const radius = 40;

function moveJoystick(clientX,clientY){

    const rect = joystickBase.getBoundingClientRect();

    const cx = rect.left + rect.width/2;
    const cy = rect.top + rect.height/2;

    let vx = clientX - cx;
    let vy = clientY - cy;

    const distance = Math.sqrt(vx*vx + vy*vy);

    if(distance > radius){

        vx = vx / distance * radius;
        vy = vy / distance * radius;

    }

    joystickStick.style.transform =
        "translate(" + vx + "px," + vy + "px)";

    dx = vx / radius;
    dy = vy / radius;

}

// ---------------------------
// Muis
// ---------------------------

joystickBase.addEventListener("mousedown",()=>{

    dragging = true;

});

window.addEventListener("mouseup",()=>{

    dragging = false;

    joystickStick.style.transform = "translate(0,0)";

    dx = 0;
    dy = 0;

});

window.addEventListener("mousemove",(e)=>{

    if(!dragging) return;

    moveJoystick(e.clientX,e.clientY);

});

// ---------------------------
// Touch
// ---------------------------

joystickBase.addEventListener("touchstart",(e)=>{

    dragging = true;

});

window.addEventListener("touchend",()=>{

    dragging = false;

    joystickStick.style.transform = "translate(0,0)";

    dx = 0;
    dy = 0;

});

window.addEventListener("touchmove",(e)=>{

    if(!dragging) return;

    e.preventDefault();

    moveJoystick(
        e.touches[0].clientX,
        e.touches[0].clientY
    );

},{passive:false});

// ---------------------------
// Spel
// ---------------------------

function update(){

    x += dx * SPEED;
    y += dy * SPEED;

    x = Math.max(0,Math.min(field.clientWidth-34,x));
    y = Math.max(0,Math.min(field.clientHeight-34,y));

    caterpillar.style.left = x + "px";
    caterpillar.style.top = y + "px";

    const headRect =
        caterpillar.querySelector(".head").getBoundingClientRect();

    document.querySelectorAll(".leaf").forEach(leaf=>{

        const rect = leaf.getBoundingClientRect();

        const overlap = !(
            headRect.right < rect.left ||
            headRect.left > rect.right ||
            headRect.bottom < rect.top ||
            headRect.top > rect.bottom
        );

        if(overlap){

            leaf.remove();

            grow();

        }

    });

    requestAnimationFrame(update);

}

update();
