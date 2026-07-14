import{

    auth,
    db,

    onAuthStateChanged,

    doc,
    getDoc

}from"./firebase.js";

const nameLabel =
document.getElementById("name");

const emailLabel =
document.getElementById("email");

const profileLabel =
document.getElementById("profile-id");

const screenLabel =
document.getElementById("screen-time");

const gamesList =
document.getElementById("games-list");

const copyButton =
document.getElementById("copy-button");

const backButton =
document.getElementById("back-button");

const GAME_NAMES={

    balloons:"Ballonnen",

    animals:"Dieren",

    colors:"Kleuren",

    bubbles:"Bubbels",

    sorting:"Sorteren",

    moles:"Mollen",

    blocks:"Blokken",

    cleanup:"Opruimen",

    cleaning:"Schoonmaken",

    memory:"Memory",
    
    train:"Trein",

    caterpillar:"Rups",

    music:"Muziek",

    fruit:"Fruit",

    pattern:"Patroon",

    cut:"Snijden",

};

onAuthStateChanged(auth,async user=>{

    if(!user){

        window.location.href="index.html";
        return;

    }

    const snapshot=

    await getDoc(

        doc(db,"users",user.uid)

    );

    const data=
    snapshot.data();

    nameLabel.textContent=
    data.name;

    emailLabel.textContent=
    data.email;

    profileLabel.textContent=
    data.profileId;

    const used=
    data.playedToday || 0;

    const limit=
    data.dailyLimit ?? 60;

    if(limit===-1){
    
        screenLabel.textContent="Onbeperkt";
    
    }
    else{
    
        screenLabel.textContent=
    
        used+" / "+limit+" min";
    
    }

    gamesList.innerHTML = "";
    
    const games = data.games || {};
    
    const GAME_ORDER = [
    
        "balloons",
        "animals",
        "colors",
        "bubbles",
        "sorting",
        "moles",
        "blocks",
        "cleanup",
        "cleaning",
        "memory",
        "train",
        "caterpillar",
        "music",
        "fruit",
        "pattern",
        "cut"
    
    ];
    
    GAME_ORDER.forEach(game => {
    
        const p = document.createElement("p");
    
        const allowed = games[game] === true;
    
        p.textContent =
            (allowed ? "✅ " : "❌ ") +
            (GAME_NAMES[game] || game);
    
        gamesList.appendChild(p);
    
    });

});

copyButton.addEventListener("click",async()=>{

    await navigator.clipboard.writeText(

        profileLabel.textContent

    );

    copyButton.textContent=

    "✅ Gekopieerd!";

    setTimeout(()=>{

        copyButton.textContent=

        "📋 Kopiëren";

    },2000);

});

backButton.addEventListener("click",()=>{

    window.location.href="index.html";

});
