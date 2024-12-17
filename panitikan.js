// Save PANITIKAN mode state to localStorage
function savePanitikanState() {
    const panitikanState = {
        currentStory: window.location.pathname, // Save the current story page
        assessmentAnswers: {
            q1: document.querySelector('input[name="q1"]:checked')?.value,
            q2: document.querySelector('input[name="q2"]:checked')?.value
        }
    };
    localStorage.setItem('panitikanState', JSON.stringify(panitikanState));
}

// Load PANITIKAN mode state from localStorage
function loadPanitikanState() {
    const savedState = localStorage.getItem('panitikanState');
    if (savedState) {
        const panitikanState = JSON.parse(savedState);
        // Redirect to the saved story if applicable
        if (panitikanState.currentStory && panitikanState.currentStory !== window.location.pathname) {
            window.location.href = panitikanState.currentStory;
        }
        // Restore assessment answers
        if (panitikanState.assessmentAnswers) {
            const { q1, q2 } = panitikanState.assessmentAnswers;
            if (q1) document.querySelector(`input[name="q1"][value="${q1}"]`).checked = true;
            if (q2) document.querySelector(`input[name="q2"][value="${q2}"]`).checked = true;
        }
    }
}

// Save PANITIKAN state whenever the user interacts with the assessment
function submitAssessment() {
    savePanitikanState(); // Save state before submitting
    const form = document.getElementById('assessmentForm');
    const q1 = form.q1.value;
    const q2 = form.q2.value;

    let score = 0;

    if (q1 === 'a') {
        score++;
    }
    if (q2 === 'a') {
        score++;
    }

    alert(`You scored ${score} out of 2!`);
}

// Load PANITIKAN state when the page loads
window.onload = function() {
    loadPanitikanState(); // Load saved state
};