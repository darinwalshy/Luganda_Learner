// 1. Your Custom Luganda Word List
const wordList = [
    { luganda: "Oli otya?", english: "How are you?5" },
    { luganda: "Gyebale ko", english: "Well done / Hello5" },
    { luganda: "Weebale", english: "Thank you5" },
    { luganda: "Ssebo", english: "Sir / Gentleman5" },
    { luganda: "Nnyabo", english: "Madam / Lady5" },
    { luganda: "Ndi bulungi", english: "I am fine5" },
    { luganda: "Agasubwa?", english: "What's the news?5" },
    { luganda: "Kale", english: "OK / You're welcome5" }
];

// 2. Track State
let currentWordIndex = 0;

// 3. DOM Elements
const flashcard = document.getElementById('flashcard');
const nextBtn = document.getElementById('nextBtn');
const lugandaFront = document.getElementById('lugandaFront');
const lugandaBack = document.getElementById('lugandaBack');
const englishBack = document.getElementById('englishBack');

// 4. Function to pick a random word (avoiding repeating the exact same word twice in a row if possible)
function getNewWord() {
    // Reset the card to front face before swapping data
    flashcard.classList.remove('is-flipped');
    
    // Tiny delay to let the flip back finish animation before text changes
    setTimeout(() => {
        let randomIndex;
        
        // If we have more than 1 word, make sure we don't pick the immediate same index
        if (wordList.length > 1) {
            do {
                randomIndex = Math.floor(Math.random() * wordList.length);
            } while (randomIndex === currentWordIndex);
        } else {
            randomIndex = 0;
        }
        
        currentWordIndex = randomIndex;
        const currentWord = wordList[currentWordIndex];
        
        // Inject the text into both front and back
        lugandaFront.textContent = currentWord.luganda;
        lugandaBack.textContent = currentWord.luganda;
        englishBack.textContent = currentWord.english;
    }, 200);
}

// 5. Event Listeners
// Flip the card when clicked
flashcard.addEventListener('click', () => {
    flashcard.classList.toggle('is-flipped');
});

// Load next word when button is clicked
nextBtn.addEventListener('click', getNewWord);

// Load an initial random word right away on page load
window.addEventListener('DOMContentLoaded', () => {
    getNewWord();
});

// 6. Register Service Worker for Offline Capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('Service Worker registered successfully!', reg.scope))
            .catch(err => console.log('Service Worker registration failed:', err));
    });
}
