import {

    auth,
    db,

    doc,
    getDoc,
    updateDoc,

    onAuthStateChanged

} from "./firebase.js";

let userRef = null;

let lastSave = Date.now();

let interval = null;

let started = false;

// ======================================

export function startGameTimer(){

    if(started) return;

    started = true;

    onAuthStateChanged(auth, async user=>{

        if(!user) return;

        userRef = doc(db,"users",user.uid);

        lastSave = Date.now();

        interval = setInterval(saveTime,60000);

    });

}

// ======================================

async function saveTime(){

    if(!userRef) return;

    const now = Date.now();

    const seconds = Math.floor(

        (now-lastSave)/1000

    );

    if(seconds<=0) return;

    try{

        const snap = await getDoc(userRef);

        if(!snap.exists()) return;

        const data = snap.data();

        await updateDoc(userRef,{

            playedToday:

                (data.playedToday||0)

                + seconds

        });

        lastSave = now;

    }

    catch(error){

        console.error(error);

    }

}

// ======================================

window.addEventListener(

    "beforeunload",

    async()=>{

        clearInterval(interval);

        await saveTime();

    }

);

document.addEventListener(

    "visibilitychange",

    async()=>{

        if(document.visibilityState==="hidden"){

            await saveTime();

        }

    }

);
