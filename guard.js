import {

    auth,
    db,

    onAuthStateChanged,

    doc,
    getDoc,
    updateDoc

} from "./firebase.js";

function today(){

    return new Date().toISOString().split("T")[0];

}

function waitForUser(){

    return new Promise(resolve=>{

        const unsubscribe=

        onAuthStateChanged(auth,user=>{

            unsubscribe();

            resolve(user);

        });

    });

}

export async function checkGameAccess(gameName){

    const user=

    await waitForUser();

    if(!user){

        window.location.href="../index.html";

        return null;

    }

    const ref=

    doc(db,"users",user.uid);

    const snap=

    await getDoc(ref);

    if(!snap.exists()){

        window.location.href="../index.html";

        return null;

    }

    const data=

    snap.data();

    // Nieuwe dag?

    if(data.lastPlayDate!==today()){

        await updateDoc(ref,{

            playedToday:0,

            lastPlayDate:today()

        });

        data.playedToday=0;

        data.lastPlayDate=today();

    }

    // Spel toegestaan?

    if(!data.games?.[gameName]){

        alert("Dit spel is uitgeschakeld door je ouder.");

        window.location.href="../index.html";

        return null;

    }

    // Schermtijd controleren

    if(

        data.dailyLimit!==-1 &&

        data.playedToday>=data.dailyLimit

    ){

        alert("Je schermtijd is op voor vandaag.");

        window.location.href="../index.html";

        return null;

    }

    return{

        user,

        data,

        ref

    };

}
