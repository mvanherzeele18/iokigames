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

const SEGMENT_SIZE = 34;
const SPEED = 3;

let dx = 0;
let dy = 0;

const segments = [

    {
        x: field.clientWidth / 2,
        y: field.clientHeight / 2
    }

];

for(let i = 0; i < 3; i++){

    segments.push({

        x: field.clientWidth / 2 - (i + 1) * SEGMENT_SIZE,
        y: field.clientHeight / 2

    });

}

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

    const last = segments[segments.length - 1];

    segments.push({

        x: last.x,
        y: last.y

    });

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

    // Vorige posities bewaren

    const previous = segments.map(segment => ({

        x: segment.x,
        y: segment.y

    }));

    // Kop bewegen

    segments[0].x += dx * SPEED;
    segments[0].y += dy * SPEED;

    segments[0].x = Math.max(
        0,
        Math.min(field.clientWidth - SEGMENT_SIZE, segments[0].x)
    );

    segments[0].y = Math.max(
        0,
        Math.min(field.clientHeight - SEGMENT_SIZE, segments[0].y)
    );

    // Lichaam volgt

    for(let i = 1; i < segments.length; i++){

        segments[i].x = previous[i - 1].x;
        segments[i].y = previous[i - 1].y;

    }

    // HTML updaten

    const parts = caterpillar.children;

    for(let i = 0; i < parts.length; i++){

        parts[i].style.position = "absolute";

        parts[i].style.left = segments[i].x + "px";
        parts[i].style.top = segments[i].y + "px";

    }

    // Blaadjes eten

    const head = segments[0];

    document.querySelectorAll(".leaf").forEach(leaf=>{

        const lx = leaf.offsetLeft;
        const ly = leaf.offsetTop;

        const distance = Math.hypot(

            head.x - lx,
            head.y - ly

        );

        if(distance < 30){

            leaf.remove();

            grow();

        }

    });

    requestAnimationFrame(update);

}

update();
