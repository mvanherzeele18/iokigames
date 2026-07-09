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
    MouseConstraint,
    Body,
    Events
} = Matter;

// ---------------------------
// Speelveld
// ---------------------------

const game = document.getElementById("game");

const WIDTH = game.clientWidth;
const HEIGHT = game.clientHeight;

const GROUND_HEIGHT = 120;
const FLOOR_THICKNESS = 80;

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

    engine,

    options:{

        width: WIDTH,
        height: HEIGHT,

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

    WIDTH / 2,
    HEIGHT - GROUND_HEIGHT + FLOOR_THICKNESS / 2,

    WIDTH,
    FLOOR_THICKNESS,

    {

        isStatic:true,

        render:{
            visible:false
        }

    }

);

const leftWall = Bodies.rectangle(

    -40,
    HEIGHT / 2,

    80,
    HEIGHT,

    {

        isStatic:true,

        render:{
            visible:false
        }

    }

);

const rightWall = Bodies.rectangle(

    WIDTH + 40,
    HEIGHT / 2,

    80,
    HEIGHT,

    {

        isStatic:true,

        render:{
            visible:false
        }

    }

);

const ceiling = Bodies.rectangle(

    WIDTH / 2,
    -40,

    WIDTH,
    80,

    {

        isStatic:true,

        render:{
            visible:false
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

const spacing = WIDTH / 7;

for(let i=0;i<6;i++){

    const block = Bodies.rectangle(

        spacing * (i + 1),
        220,

        120,
        60,

        {

            restitution:0.03,

            friction:0.8,

            density:0.002,

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

const mouse = Mouse.create(render.canvas);

const mouseConstraint = MouseConstraint.create(engine,{

    mouse,

    constraint:{

        stiffness:0.2,

        render:{
            visible:false
        }

    }

});

World.add(world,mouseConstraint);

render.mouse = mouse;

// ---------------------------
// Onder gras blokkeren
// ---------------------------

Events.on(engine,"beforeUpdate",()=>{

    const limit = HEIGHT - GROUND_HEIGHT;

    world.bodies.forEach(body=>{

        if(body.isStatic) return;

        if(body.position.y > limit){

            Body.setPosition(body,{
                x:body.position.x,
                y:limit
            });

            Body.setVelocity(body,{
                x:body.velocity.x,
                y:0
            });

        }

    });

});

// ---------------------------
// Scherm draaien
// ---------------------------

window.addEventListener("resize",()=>{

    location.reload();

});
