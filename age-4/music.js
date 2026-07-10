// =====================================
// Ioki Games - Muziek
// =====================================

const keys = document.querySelectorAll(".key");

const sounds = {

    do:new Audio("../assets/sounds/music/do.wav"),
    re:new Audio("../assets/sounds/music/re.wav"),
    mi:new Audio("../assets/sounds/music/mi.wav"),
    fa:new Audio("../assets/sounds/music/fa.wav"),
    sol:new Audio("../assets/sounds/music/sol.wav"),
    la:new Audio("../assets/sounds/music/la.wav"),
    si:new Audio("../assets/sounds/music/si.wav"),
    do2:new Audio("../assets/sounds/music/do2.wav")

};

function createMusicNote(button){

    const rect = button.getBoundingClientRect();

    const note = document.createElement("div");

    note.className = "music-note";

    const notes = ["♪","♫","♬"];

    note.textContent = notes[Math.floor(Math.random()*notes.length)];

    note.style.left = (rect.left + rect.width/2) + "px";
    note.style.top = (rect.top + 20) + "px";

    document.body.appendChild(note);

    setTimeout(()=>{

        note.remove();

    },1200);

}

keys.forEach(button=>{

    button.addEventListener("click",()=>{

        const note = button.dataset.note;

        sounds[note].currentTime = 0;
        sounds[note].play();

        createMusicNote(button);

    });

});
