// =====================================
// Ioki Games - Dieren
// =====================================

// Dieren
const animals = [

    {
        name: "Hond",
        image: "../assets/images/animals/dog.png",
        speech: "../assets/sounds/animals/dog_name.mp3",
        sound: "../assets/sounds/animals/dog.mp3",
        volume: 1
    },

    {
        name: "Kat",
        image: "../assets/images/animals/cat.png",
        speech: "../assets/sounds/animals/cat_name.mp3",
        sound: "../assets/sounds/animals/cat.mp3",
        volume: 1
    },

    {
        name: "Koe",
        image: "../assets/images/animals/cow.png",
        speech: "../assets/sounds/animals/cow_name.mp3",
        sound: "../assets/sounds/animals/cow.mp3",
        volume: 1
    },

    {
        name: "Varken",
        image: "../assets/images/animals/pig.png",
        speech: "../assets/sounds/animals/pig_name.mp3",
        sound: "../assets/sounds/animals/pig.mp3",
        volume: 1
    },

    {
        name: "Schaap",
        image: "../assets/images/animals/sheep.png",
        speech: "../assets/sounds/animals/sheep_name.mp3",
        sound: "../assets/sounds/animals/sheep.mp3",
        volume: 1
    },

    {
        name: "Leeuw",
        image: "../assets/images/animals/lion.png",
        speech: "../assets/sounds/animals/lion_name.mp3",
        sound: "../assets/sounds/animals/lion.mp3",
        volume: 1
    },

    {
        name: "Olifant",
        image: "../assets/images/animals/elephant.png",
        speech: "../assets/sounds/animals/elephant_name.mp3",
        sound: "../assets/sounds/animals/elephant.mp3",
        volume: 0.5
    },

    {
        name: "Kikker",
        image: "../assets/images/animals/frog.png",
        speech: "../assets/sounds/animals/frog_name.mp3",
        sound: "../assets/sounds/animals/frog.mp3",
        volume: 0.7
    }

];

let currentAnimal = 0;

// Elementen
const image = document.getElementById("animal-image");
const nameText = document.getElementById("animal-name");

const previousButton = document.getElementById("previous");
const nextButton = document.getElementById("next");
const playButton = document.getElementById("play-sound");

// ---------------------------
// Toon dier
// ---------------------------

function showAnimal() {

    const animal = animals[currentAnimal];

    image.src = animal.image;
    image.alt = animal.name;

    nameText.textContent = animal.name;

}

// ---------------------------
// Naam afspelen
// ---------------------------

function playAnimalName(callback) {

    const animal = animals[currentAnimal];

    const speech = new Audio(animal.speech);

    speech.onended = () => {

        if (callback) {

            callback();

        }

    };

    speech.play();

}

// ---------------------------
// Dierengeluid
// ---------------------------

function playAnimalSound() {

    const animal = animals[currentAnimal];

    const sound = new Audio(animal.sound);

    sound.volume = animal.volume;

    sound.play();

}

// ---------------------------
// Animatie
// ---------------------------

function jumpAnimal() {

    image.classList.remove("jump");

    void image.offsetWidth;

    image.classList.add("jump");

}

// ---------------------------
// Alles afspelen
// ---------------------------

function playCurrentAnimal() {

    jumpAnimal();

    playAnimalName(() => {

        playAnimalSound();

    });

}

// ---------------------------
// Volgende
// ---------------------------

nextButton.addEventListener("click", () => {

    currentAnimal++;

    if (currentAnimal >= animals.length) {

        currentAnimal = 0;

    }

    showAnimal();

    playCurrentAnimal();

});

// ---------------------------
// Vorige
// ---------------------------

previousButton.addEventListener("click", () => {

    currentAnimal--;

    if (currentAnimal < 0) {

        currentAnimal = animals.length - 1;

    }

    showAnimal();

    playCurrentAnimal();

});

// ---------------------------
// Nog eens
// ---------------------------

playButton.addEventListener("click", () => {

    playCurrentAnimal();

});

// ---------------------------
// Klik op dier
// ---------------------------

image.addEventListener("click", () => {

    playCurrentAnimal();

});

// ---------------------------
// Start
// ---------------------------

showAnimal();

setTimeout(() => {

    playCurrentAnimal();

}, 500);
