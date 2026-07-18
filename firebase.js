// =====================================
// Ioki Games - Firebase
// =====================================

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    collection,
    query,
    where,
    getDocs,
    increment
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

// =====================================
// Config
// =====================================

const firebaseConfig = {

    apiKey: "AIzaSyCJFP0Bo2f3CUCs_YmrT5wWUFzLbnBIXVk",

    authDomain: "iokigames.firebaseapp.com",

    projectId: "iokigames",

    storageBucket: "iokigames.firebasestorage.app",

    messagingSenderId: "801522202722",

    appId: "1:801522202722:web:cd78c84f55858313af393b",

    measurementId: "G-NPJZSDCGBN"

};

// =====================================

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

// =====================================
// Uniek Profile-ID
// =====================================

async function generateProfileId(){

    const chars =
        "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    while(true){

        let id = "";

        for(let i=0;i<8;i++){

            id += chars[
                Math.floor(
                    Math.random()*chars.length
                )
            ];

        }

        id =
            id.substring(0,4)
            +
            "-"
            +
            id.substring(4);

        const q = query(

            collection(db,"users"),

            where("profileId","==",id)

        );

        const snapshot =
            await getDocs(q);

        if(snapshot.empty){

            return id;

        }

    }

}

// =====================================
// Eerste login
// =====================================

async function createUserIfNeeded(user){

    const ref =
        doc(db,"users",user.uid);

    const snapshot =
        await getDoc(ref);

    if(snapshot.exists()){

        return;

    }

    const profileId =
        await generateProfileId();

    await setDoc(

        ref,

        {

            name:
                user.displayName,

            email:
                user.email,

            profileId:
                profileId,

            parentUid: null,

            emailParent: null,

            parentVerified: false,

            pendingParentUid: null,

            pendingParentEmail: null,

            dailyLimit: -1,

            playedToday: 0,

            lastPlayDate: null,

            games:{
                animals:true,
                balloons:true,
                blocks:true,
                bubbles:true,
                caterpillar:true,
                cleaning:true,
                cleanup:true,
                colors:true,
                cut:true,
                fruit:true,
                memory:true,
                moles:true,
                music:true,
                pattern:true,
                sorting:true,
                train:true,
                numbers:true,
                shapes:true,
                puzzle:true,
                logic:true,
                bowling:true,
                bird:true,
                dino:true,
            }

        }

    );

}

// =====================================
// Google Login
// =====================================

async function login(){

    const result =
        await signInWithPopup(

            auth,

            provider

        );

    await createUserIfNeeded(

        result.user

    );

    return result.user;

}

// =====================================

export{

    db,
    auth,

    login,
    signOut,
    onAuthStateChanged,

    doc,
    getDoc,
    updateDoc,
    increment

};
