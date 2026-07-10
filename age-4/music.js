// =====================================
// Ioki Games - Muziek
// =====================================

const keys = document.querySelectorAll(".key");

// ---------------------------
// Geluiden
// ---------------------------

const sounds = {

    do: new Audio("../assets/sounds/music/do.mp3"),
    re: new Audio("../assets/sounds/music/re.mp3"),
    mi: new Audio("../assets/sounds/music/mi.mp3"),
    fa: new Audio("../assets/sounds/music/fa.mp3"),
    sol: new Audio("../assets/sounds/music/sol.mp3"),
    la: new Audio("../assets/sounds/music/la.mp3"),
    si: new Audio("../assets/sounds/music/si.mp3"),
    do2: new Audio("../assets/sounds/music/do2.mp3")

};

// ---------------------------
// Muzieknoot
// ---------------------------

function createMusicNote(x, y){

    const note = document.createElement("div");

    note.className = "music-note";

    note.innerHTML = "♪";

    note.style.left = x + "px";
    note.style.top = y + "px";

    document.getElementById("game").appendChild(note);

    setTimeout(() => {

        note.remove();

    }, 1000);

}

// ---------------------------
// Noot spelen
// ---------------------------

function playNote(button){

    const note = button.dataset.note;

    sounds[note].currentTime = 0;
    sounds[note].play();

    const rect = button.getBoundingClientRect();

    createMusicNote(

        rect.left + rect.width / 2,
        rect.top

    );

}

// ---------------------------
// Events
// ---------------------------

keys.forEach(button => {

    button.addEventListener("click", () => {

        playNote(button);

    });

});
