const pattern =
document.getElementById("pattern");

const answers =
document.getElementById("answers");

const symbols=[

    "🐶",
    "🐱",
    "🐭",
    "🐸",
    "🐷",
    "🐵",
    "🐧",
    "🐼",
    "🦁",
    "🐯",
    "🐨",
    "🐰",
    "🍎",
    "🍌",
    "🍓",
    "🍇"

];

generate();

function generate(){

    pattern.innerHTML="";

    answers.innerHTML="";

    // 4 verschillende symbolen kiezen

    const pool=[...symbols];

    shuffle(pool);

    const sequence=

    pool.slice(0,4);

    // patroon van 8 maken

    const full=[];

    for(let i=0;i<8;i++){

        full.push(

            sequence[i%4]

        );

    }

    // willekeurig vraagteken

    const missing=

    Math.floor(

        Math.random()*8

    );

    const correct=

    full[missing];

    full[missing]="❓";

    // tonen

    full.forEach(item=>{

        const div=

        document.createElement("div");

        div.className=

        "pattern-item";

        div.textContent=item;

        pattern.appendChild(div);

    });

    // antwoordknoppen

    shuffle(sequence);

    sequence.forEach(symbol=>{

        const button=

        document.createElement("button");

        button.className=

        "answer-button";

        button.textContent=symbol;

        button.onclick=()=>{

            if(symbol===correct){

                generate();

            }

            else{

                button.animate([

                    {

                        transform:"translateX(-8px)"

                    },

                    {

                        transform:"translateX(8px)"

                    },

                    {

                        transform:"translateX(0)"

                    }

                ],{

                    duration:250

                });

            }

        };

        answers.appendChild(button);

    });

}

function shuffle(array){

    for(

        let i=array.length-1;

        i>0;

        i--

    ){

        const j=

        Math.floor(

            Math.random()*(i+1)

        );

        [

            array[i],

            array[j]

        ]=[

            array[j],

            array[i]

        ];

    }

}
