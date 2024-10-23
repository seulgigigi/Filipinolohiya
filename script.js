let words = [];
let currentWord = '';
let currentDefinition = '';
let scrambledWord = '';
let attempts = 0;
const maxAttempts = 6; // Maximum number of attempts

document.getElementById('startGame').addEventListener('click', startGame);
document.getElementById('submitGuess').addEventListener('click', checkGuess);

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
    const randomIndex = Math.floor(Math.random() * words.length);
    currentWord = words[randomIndex].word.toLowerCase();
    currentDefinition = words[randomIndex].definition;
    
    scrambledWord = scrambleWord(currentWord);
    
    document.getElementById('scrambledWord').innerText = scrambledWord;
    document.getElementById('definition').innerText = currentDefinition;
    document.getElementById('game').classList.remove('hidden');
    document.getElementById('result').innerText = '';
    document.getElementById('userGuess').value = '';
    
    attempts = 0; // Reset attempts
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
        return;
    }

    if (attempts >= maxAttempts) {
        document.getElementById('result').innerText = `Game over! The word was: ${currentWord}`;
        displayResult(currentWord, false);
        return;
    }

    displayResult(userGuess, false);
}

function displayResult(guess, isCorrect) {
    const resultDiv = document.getElementById('result');
    const guessRow = document.createElement('div');
    guessRow.className = 'guess-row';

    // Check letters and change colors
    let letterStatus = new Array(currentWord.length).fill('wrong'); // Default all letters to 'wrong'
    const currentWordArr = currentWord.split('');
    
    // First pass: check for correct letters
    guess.split('').forEach((letter, index) => {
        if (letter === currentWordArr[index]) {
            letterStatus[index] = 'correct'; // Exact match
        }
    });

    // Second pass: check for wrong position letters
    guess.split('').forEach((letter, index) => {
        if (letterStatus[index] !== 'correct' && currentWordArr.includes(letter)) {
            letterStatus[index] = 'wrong-position'; // Letter is in the word but in the wrong position
        }
    });

    // Create colored boxes for the guess
    guess.split('').forEach((letter, index) => {
        const letterBox = document.createElement('span');
        letterBox.className = `letter-box ${letterStatus[index]}`; // Add the corresponding class
        letterBox.innerText = letter.toUpperCase();
        guessRow.appendChild(letterBox);
    });

    resultDiv.appendChild(guessRow);
    document.getElementById('userGuess').value = ''; // Clear input
}

// CSS for letter boxes and colors
const style = document.createElement('style');
style.innerHTML = `
    .guess-row {
        display: flex;
        margin: 5px 0;
    }
    .letter-box {
        width: 30px;
        height: 30px;
        margin: 0 5px;
        text-align: center;
        line-height: 30px;
        border: 2px solid #ccc;
        font-weight: bold;
    }
    .correct {
        background-color: #6aaa64; /* Green */
        color: white;
    }
    .wrong-position {
        background-color: #f3c94c; /* Yellow */
        color: black;
    }
    .wrong {
        background-color: #787c7e; /* Gray */
        color: white;
    }
`;
document.head.appendChild(style);
