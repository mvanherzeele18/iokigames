// =====================================
// Ioki Games - Blokken
// =====================================

const {
    Engine,
    Render,
    Runner,
    World,
    Bodies,
    Mouse,
    MouseConstraint
} = Matter;

// ---------------------------
// Engine
// ---------------------------

const engine = Engine.create();

const world = engine.world;

world.gravity.y = 1;

// ---------------------------
// Renderer
// ---------------------------

const render = Render.create({

    element: document.getElementById("world"),

    engine: engine,

    options:{

        width:window.innerWidth,
        height:window.innerHeight,

        wireframes:false,

        background:"transparent"

    }

});

Render.run(render);

const runner = Runner.create();

Runner.run(runner, engine);

// ---------------------------
// Muren
// ---------------------------

const ground = Bodies.rectangle(

    window.innerWidth/2,
    window.innerHeight+40,

    window.innerWidth,
    80,

    {
        isStatic:true,
        render:{
            visible:false
        }
    }

);

const leftWall = Bodies.rectangle(

    -40,
    window.innerHeight/2,

    80,
    window.innerHeight,

    {
        isStatic:true,
        render:{
            visible:false
        }
    }

);

const rightWall = Bodies.rectangle(

    window.innerWidth+40,
    window.innerHeight/2,

    80,
    window.innerHeight,

    {
        isStatic:true,
        render:{
            visible:false
        }
    }

);

const ceiling = Bodies.rectangle(

    window.innerWidth / 2,
    -40,

    window.innerWidth,
    80,

    {
        isStatic: true,
        render: {
            visible: false
        }
    }

);

World.add(world,[ground,leftWall,rightWall,ceiling]);

// ---------------------------
// Blokken
// ---------------------------

const colors=[

    "#ff6b6b",
    "#4dabf7",
    "#ffd43b",
    "#69db7c",
    "#b197fc",
    "#ffa94d"

];

for(let i=0;i<6;i++){

    const block=Bodies.rectangle(

        180+i*95,
        220,

        120,
        60,

        {

            restitution:0.03,

            friction:0.7,

            render:{

                fillStyle:colors[i]

            }

        }

    );

    World.add(world,block);

}

// ---------------------------
// Slepen
// ---------------------------

const mouse=Mouse.create(render.canvas);

const mouseConstraint=MouseConstraint.create(engine,{

    mouse:mouse,

    constraint:{

        stiffness:0.2,

        render:{

            visible:false

        }

    }

});

World.add(world,mouseConstraint);

render.mouse=mouse;

// ---------------------------
// Scherm draaien
// ---------------------------

window.addEventListener("resize",()=>{

    location.reload();

});
