import {
    auth,
    db,
    doc,
    updateDoc,
    onAuthStateChanged
} from "./firebase.js";

import {
    increment
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

let interval = null;

export function startGameTimer() {

    onAuthStateChanged(auth, user => {

        if (!user) return;

        const userRef = doc(db, "users", user.uid);

        interval = setInterval(async () => {

            try {
                await updateDoc(userRef, {
                    playedToday: increment(1)   // ⭐ elke minuut +1
                });
            }
            catch (error) {
                console.error(error);
            }

        }, 60000); // 60000 ms = 1 minuut

    });

}

export function stopGameTimer() {

    if (interval) {
        clearInterval(interval);
        interval = null;
    }

}
