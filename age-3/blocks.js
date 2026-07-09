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

const GROUND_HEIGHT = 120;

const ground = Bodies.rectangle(

    window.innerWidth / 2,
    window.innerHeight - GROUND_HEIGHT + 40,

    window.innerWidth,
    80,

    {
        isStatic: true,
        render: {
            visible: false
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

const spacing = window.innerWidth / 7;

for(let i=0;i<6;i++){

    const block = Bodies.rectangle(

        spacing * (i + 1),
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
