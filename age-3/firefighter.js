// =====================================
// Ioki Games - Brandweer
// =====================================

const cloud = document.getElementById("rain-cloud");
const rain = document.getElementById("rain");
const fires = document.getElementById("fires");

const FIRE_COUNT = 4;

let dragging = false;

// --------------------
// Vuurtje
// --------------------

function createFire(){

    const fire = document.createElement("div");

    fire.className = "fire";
    fire.textContent = "🔥";

    const x = 20 + Math.random() * (window.innerWidth - 90);

    // Alleen op het gras
    const groundTop = window.innerHeight * 0.72;

    const y = groundTop + Math.random() * (window.innerHeight * 0.20);

    fire.style.left = x + "px";
    fire.style.top = y + "px";

    fires.appendChild(fire);

}

for(let i=0;i<FIRE_COUNT;i++){

    createFire();

}

// --------------------
// Wolk slepen
// --------------------

function moveCloud(x){

    const w = cloud.offsetWidth;

    x = Math.max(w/2, Math.min(window.innerWidth-w/2,x));

    cloud.style.left = x + "px";

}

cloud.addEventListener("mousedown",()=>dragging=true);

window.addEventListener("mouseup",()=>dragging=false);

window.addEventListener("mousemove",(e)=>{

    if(dragging){

        moveCloud(e.clientX);

    }

});

cloud.addEventListener("touchstart",()=>dragging=true);

window.addEventListener("touchend",()=>dragging=false);

window.addEventListener("touchmove",(e)=>{

    if(!dragging) return;

    e.preventDefault();

    moveCloud(e.touches[0].clientX);

},{passive:false});

// --------------------
// Regen
// --------------------

function createDrop(){

    const rect = cloud.getBoundingClientRect();

    const drop = document.createElement("div");

    drop.className = "raindrop";

    let x = rect.left + rect.width/2 + (Math.random()*40-20);
    let y = rect.bottom - 5;

    drop.style.left = x + "px";
    drop.style.top = y + "px";

    rain.appendChild(drop);

    function animate(){

        y += 8;

        drop.style.top = y + "px";

        const dropRect = drop.getBoundingClientRect();

        document.querySelectorAll(".fire").forEach(fire=>{

            if(fire.classList.contains("out")) return;

            const fireRect = fire.getBoundingClientRect();

            const hit = !(
                dropRect.right < fireRect.left ||
                dropRect.left > fireRect.right ||
                dropRect.bottom < fireRect.top ||
                dropRect.top > fireRect.bottom
            );

            if(hit){

                fire.classList.add("out");

                setTimeout(()=>{

                    fire.remove();

                    createFire();

                },200);

                drop.remove();

            }

        });

        if(!drop.parentNode) return;

        if(y > window.innerHeight){

            drop.remove();

            return;

        }

        requestAnimationFrame(animate);

    }

    requestAnimationFrame(animate);

}

setInterval(createDrop,90);
