import {
    auth,
    db,
    doc,
    getDoc,
    updateDoc,
    onAuthStateChanged
} from "./firebase.js";

import {
    increment
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

let interval = null;

export function startGameTimer() {

    onAuthStateChanged(auth, async user => {

        if (!user) return;

        const userRef = doc(db, "users", user.uid);

        interval = setInterval(async () => {

            try {
                // 1. +1 minuut toevoegen
                await updateDoc(userRef, {
                    playedToday: increment(1)
                });

                // 2. Nieuwe data ophalen
                const snap = await getDoc(userRef);
                const data = snap.data();

                const used = data.playedToday;
                const limit = data.dailyLimit;

                // 3. Limiet checken (zelfde melding als guard.js)
                if (limit !== -1 && used >= limit) {

                    stopGameTimer();

                    alert("Je schermtijd is op voor vandaag.");

                    window.location.href = "../index.html";
                }

            } catch (error) {
                console.error(error);
            }

        }, 60000); // elke minuut

    });

}

export function stopGameTimer() {

    if (interval) {
        clearInterval(interval);
        interval = null;
    }

}
