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

const backButton =
document.getElementById("back-button");

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

    // ------------------------
    // Schermtijd
    // ------------------------

    let used=
    data.playedToday || 0;

    let limit=
    data.dailyLimit ?? 60;

    if(limit==-1){

        screenLabel.textContent=

        used+" min / Onbeperkt";

    }

    else{

        screenLabel.textContent=

        used+" / "+limit+" min";

    }

    // ------------------------
    // Games
    // ------------------------

    gamesList.innerHTML="";

    const games=
    data.games || {};

    for(const game in games){

        const p=
        document.createElement("p");

        p.textContent=

        games[game]

        ?

        "✅ "+capitalize(game)

        :

        "❌ "+capitalize(game);

        gamesList.appendChild(p);

    }

});

function capitalize(text){

    return text.charAt(0).toUpperCase()

    +

    text.slice(1);

}

backButton.addEventListener("click",()=>{

    window.location.href="index.html";

});
