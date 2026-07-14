// =====================================
// Ioki Games - Home
// =====================================

import {

    auth,
    login,
    signOut,
    onAuthStateChanged

} from "./firebase.js";

import { showPopup } from "./popup.js";

// -------------------------------------
// Elementen
// -------------------------------------

const loginCard =
    document.getElementById("login-card");

const home =
    document.getElementById("home");

const loginButton =
    document.getElementById("google-login");

const logoutButton =
    document.getElementById("logout-button");

const accountButton =
    document.getElementById("account-button");

// -------------------------------------
// Loginstatus
// -------------------------------------

onAuthStateChanged(auth, user=>{

    if(user){

        loginCard.classList.add("hidden");

        home.classList.remove("hidden");

    }

    else{

        loginCard.classList.remove("hidden");

        home.classList.add("hidden");

    }

});

// -------------------------------------
// Google Login
// -------------------------------------

loginButton.addEventListener("click",async()=>{

    loginButton.disabled = true;

    try{

        await login();

    }

    catch(error){

        console.error(error);

        showPopup(
        
            "error",
        
            "Inloggen is mislukt."
        
        );

    }

    loginButton.disabled = false;

});

// -------------------------------------
// Account
// -------------------------------------

accountButton.addEventListener("click",()=>{

    window.location.href =

        "account.html";

});

// -------------------------------------
// Uitloggen
// -------------------------------------

logoutButton.addEventListener("click",async()=>{

    await signOut(auth);

});
