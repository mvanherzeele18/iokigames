import {

    auth,
    db,

    onAuthStateChanged,

    doc,
    getDoc,
    updateDoc

} from "./firebase.js";

let startTime = null;

let userRef = null;

let timerStarted = false;

// ------------------------------------
// Start timer
// ------------------------------------

export async function startGameTimer(){

    if(timerStarted) return;

    timerStarted = true;

    onAuthStateChanged(auth, async user => {

        if(!user) return;

        userRef = doc(db,"users",user.uid);

        startTime = Date.now();

    });

}

// ------------------------------------
// Tijd opslaan
// ------------------------------------

async function saveTime(){

    if(!userRef || !startTime){

        return;

    }

    const playedMinutes =

        Math.floor(

            (Date.now()-startTime)

            /60000

        );

    if(playedMinutes<=0){

        return;

    }

    const snapshot =

        await getDoc(userRef);

    if(!snapshot.exists()){

        return;

    }

    const data =

        snapshot.data();

    await updateDoc(

        userRef,

        {

            playedToday:

            (data.playedToday||0)

            +

            playedMinutes

        }

    );

    startTime = Date.now();

}

// ------------------------------------
// Pagina verlaten
// ------------------------------------

window.addEventListener(

    "beforeunload",

    saveTime

);

document.addEventListener(

    "visibilitychange",

    ()=>{

        if(document.visibilityState==="hidden"){

            saveTime();

        }

    }

);
