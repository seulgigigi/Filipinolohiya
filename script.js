let words = [];
let currentWord = '';
let currentDefinition = '';
let scrambledWord = '';
let attempts = 0;
let currentRound = 0;
const maxRounds = 20; // Maximum rounds (20 words)

document.getElementById('startGame').addEventListener('click', startGame);
document.getElementById('submitGuess').addEventListener('click', checkGuess);
document.getElementById('nextWord').addEventListener('click', nextRound);

// Fetch the CSV from an external source when the page loads
window.onload = function() {
    fetch('words.csv') // Replace with your actual URL
        .then(response => response.text())
        .then(data => {
            words = parseCSV(data); // Parse the CSV data into word-definition pairs
        })
        .catch(error => {
            console.error('Error fetching the CSV file:', error);
        });
};

// Parse the CSV data into an array of word-definition objects
function parseCSV(csvText) {
    return csvText.split(/\r?\n/).map(line => {
        const [word, definition] = line.split(',');
        return { word: word.trim(), definition: definition.trim() };
    }).filter(Boolean);
}

function startGame() {
    if (words.length === 0) {
        alert('Words are not loaded yet. Please try again later.');
        return;
    }
    document.getElementById('startGame').style.display = 'none'; // Hide the start button
    document.getElementById('nextWord').style.display = 'inline-block'; // Show the next button
    currentRound = 0; // Reset rounds
    nextRound(); // Start the first round
}

function nextRound() {
    if (currentRound >= maxRounds) {
        alert('Game over! You have completed all rounds.');
        document.getElementById('game').classList.add('hidden');
        return;
    }

    currentRound++;

    // Pick a random word from the list
    const randomIndex = Math.floor(Math.random() * words.length);
    currentWord = words[randomIndex].word.toLowerCase();
    currentDefinition = words[randomIndex].definition;

    scrambledWord = scrambleWord(currentWord);
    
    document.getElementById('scrambledWord').innerText = scrambledWord;
    document.getElementById('definition').innerText = currentDefinition;
    document.getElementById('game').classList.remove('hidden');
    document.getElementById('result').innerText = '';
    document.getElementById('userGuess').value = '';
    
    // Dynamically set maxlength for the input field
    document.getElementById('userGuess').setAttribute('maxlength', currentWord.length);

    attempts = 0; // Reset attempts for each round
}


function scrambleWord(word) {
    const arr = word.split('');
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('');
}

function checkGuess() {
    const userGuess = document.getElementById('userGuess').value.trim().toLowerCase();
    
    if (userGuess.length !== currentWord.length) {
        alert(`Please guess a ${currentWord.length}-letter word!`);
        return;
    }

    attempts++;
    
    if (userGuess === currentWord) {
        document.getElementById('result').innerText = 'Correct! 🎉';
        displayResult(userGuess, true);
        document.getElementById('submitGuess').disabled = true; // Disable further guessing for this round
        return;
    }

    if (attempts >= 5) {
        document.getElementById('result').innerText = `Game over! The word was: ${currentWord}`;
        displayResult(currentWord, false);
        document.getElementById('submitGuess').disabled = true; // Disable further guessing for this round
        return;
    }

    displayResult(userGuess, false);
}

function displayResult(guess, isCorrect) {
    const resultDiv = document.getElementById('result');
    const guessRow = document.createElement('div');
    guessRow.className = 'guess-row';

    let letterStatus = new Array(currentWord.length).fill('wrong');
    const currentWordArr = currentWord.split('');
    
    guess.split('').forEach((letter, index) => {
        if (letter === currentWordArr[index]) {
            letterStatus[index] = 'correct';
        }
    });

    guess.split('').forEach((letter, index) => {
        if (letterStatus[index] !== 'correct' && currentWordArr.includes(letter)) {
            letterStatus[index] = 'wrong-position';
        }
    });

    guess.split('').forEach((letter, index) => {
        const letterBox = document.createElement('span');
        letterBox.className = `letter-box ${letterStatus[index]}`;
        letterBox.innerText = letter.toUpperCase();
        guessRow.appendChild(letterBox);
    });

    resultDiv.appendChild(guessRow);
    document.getElementById('userGuess').value = '';
}

function showInstructions() {
    document.getElementById('instructions').classList.remove('hidden');
}

function startGame() {
    if (words.length === 0) {
        alert('Words are not loaded yet. Please try again later.');
        return;
    }
    document.getElementById('startGame').style.display = 'none'; // Hide the start button
    document.getElementById('nextWord').style.display = 'inline-block'; // Show the next button
    showInstructions(); // Show instructions when the game starts
    setTimeout(() => {
        hideInstructions(); // Hide instructions after 5 seconds
        currentRound = 0; // Reset rounds
        nextRound(); // Start the first round
    }, 5000); // Hide instructions after 5 seconds
}

document.getElementById('toggleInstructions').addEventListener('click', toggleInstructions);

function toggleInstructions() {
    const instructions = document.getElementById('instructions');
    const button = document.getElementById('toggleInstructions');

    if (instructions.style.display === 'block' || !instructions.classList.contains('hidden')) {
        instructions.style.display = 'none'; // Hide instructions
        instructions.classList.add('hidden');
        button.innerText = 'Ipakita ang Mga Panuto'; // Update button text
    } else {
        instructions.style.display = 'block'; // Show instructions
        instructions.classList.remove('hidden');
        button.innerText = 'Itago ang Mga Panuto'; // Update button text
    }
}

document.head.appendChild(style);
