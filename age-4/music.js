// =====================================
// Ioki Games - Muziek
// =====================================

const keys = document.querySelectorAll(".key");

const sounds = {

    do:new Audio("../assets/sounds/music/do.mp3"),
    re:new Audio("../assets/sounds/music/re.mp3"),
    mi:new Audio("../assets/sounds/music/mi.mp3"),
    fa:new Audio("../assets/sounds/music/fa.mp3"),
    sol:new Audio("../assets/sounds/music/sol.mp3"),
    la:new Audio("../assets/sounds/music/la.mp3"),
    si:new Audio("../assets/sounds/music/si.mp3"),
    do2:new Audio("../assets/sounds/music/do2.mp3")

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
