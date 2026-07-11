// ===============================
// Whack-a-Mole – Variant B
// ===============================

// Alle mollen selecteren
const holes = document.querySelectorAll(".hole");
const moles = document.querySelectorAll(".mole");

// Aantal mollen tegelijk
const ACTIVE_MOLES = 2;

// Tijd dat een mol zichtbaar blijft
const MOLE_UP_TIME = 1200; // 1.2s

// Minimale tijd tussen nieuwe mollen
const MOLE_INTERVAL = 900;

// Houd bij welke mollen actief zijn
let active = [];

// Mol omhoog laten komen
function showMole(mole) {
    mole.style.transition = "transform 0.25s ease-out";
    mole.style.transform = "translateY(0%)"; // omhoog
}

// Mol omlaag laten gaan
function hideMole(mole) {
    mole.style.transition = "transform 0.25s ease-in";
    mole.style.transform = "translateY(100%)"; // omlaag
}

// Kies willekeurige mollen
function pickRandomMoles() {
    const available = [...moles].filter(m => !active.includes(m));
    const chosen = [];

    while (chosen.length < ACTIVE_MOLES && available.length > 0) {
        const index = Math.floor(Math.random() * available.length);
        chosen.push(available.splice(index, 1)[0]);
    }

    return chosen;
}

// Start een mol-cyclus
function startMoleCycle() {
    const chosen = pickRandomMoles();

    chosen.forEach(mole => {
        active.push(mole);
        showMole(mole);

        // Automatisch weer omlaag
        setTimeout(() => {
            hideMole(mole);
            active = active.filter(m => m !== mole);
        }, MOLE_UP_TIME);
    });

    // Nieuwe cyclus
    setTimeout(startMoleCycle, MOLE_INTERVAL);
}

// Tik op mol → direct omlaag
moles.forEach(mole => {
    mole.addEventListener("pointerdown", () => {
        hideMole(mole);
        active = active.filter(m => m !== mole);
    });
});

// Start spel
startMoleCycle();
