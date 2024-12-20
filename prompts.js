const prompts = [
  "Write about your favorite childhood memory.",
  "Describe a place you've always wanted to visit.",
  "Write a letter to your future self.",
  "Imagine you are a character in a fantasy world. What is your role?",
  "Write about a time you overcame a challenge.",
  "Describe your perfect day.",
  "Imagine you are a detective solving a mystery.",
  "Write a story set in a futuristic world.",
  "What would you do if you could time travel?"
];

function generatePrompt() {
  const date = new Date();
  const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
  const prompt = prompts[dayOfYear % prompts.length];
  document.getElementById("prompt").innerText = prompt;
}

function updateStreakDisplay(streak) {
  const streakDisplay = document.getElementById('streakDisplay');
  streakDisplay.textContent = `🔥 ${streak}`;
}

function countWords(str) {
  return str.trim() ? str.trim().split(/\s+/).length : 0; // Handle empty strings
}

function saveInput(input) {
  const currentDate = new Date().toLocaleDateString(); // Get the current date
  const historyEntry = {
    date: currentDate,
    text: input
  };

  // Retrieve existing history or initialize an empty array
  const history = JSON.parse(localStorage.getItem('history')) || [];
  history.push(historyEntry); // Add the new entry
  localStorage.setItem('history', JSON.stringify(history)); // Save back to localStorage
}

function displayHistory() {
  const historyContainer = document.getElementById('historyContainer');
  const history = JSON.parse(localStorage.getItem('history')) || [];

  // Clear previous content
  historyContainer.innerHTML = '';

  // Display each entry
  history.forEach((entry, index) => {
    const entryElement = document.createElement('div');
    entryElement.textContent = `${index + 1}: ${entry.date} - ${entry.text}`; // Format entry
    historyContainer.appendChild(entryElement);
  });

  if (history.length === 0) {
    historyContainer.textContent = 'No history available.';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  generatePrompt();
  
  const streakForm = document.getElementById('streakForm');
  const dailyInput = document.getElementById('dailyInput');
  const errorMessage = document.getElementById('error-message'); // Ensure this element exists in your HTML

  let streak = parseInt(localStorage.getItem('streak')) || 0;
  let lastSubmitDate = localStorage.getItem('lastSubmitDate');

  updateStreakDisplay(streak); // Display the initial streak

  streakForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const dailyInputValue = dailyInput.value; // Get the input value
    const wordCount = countWords(dailyInputValue);

    if (wordCount < 250) {
      errorMessage.style.display = 'block';
      errorMessage.textContent = 'Your text must be at least 250 words.';
    } else {
      errorMessage.style.display = 'none';
      saveInput(dailyInputValue); // Save input if valid
      updateStreak(dailyInputValue); // Update the streak
      streakForm.reset(); // Clear the input field
    }
  });

  function updateStreak(input) {
    const today = new Date().toDateString();

    if (lastSubmitDate === today) {
      // No change to streak
    } else if (lastSubmitDate && new Date(today) - new Date(lastSubmitDate) === 86400000) {
      streak += 1; // Increment streak for consecutive days
    } else {
      streak = 1; // Reset streak if not consecutive
    }

    localStorage.setItem('streak', streak);
    localStorage.setItem('lastSubmitDate', today);
    updateStreakDisplay(streak);
  }

  displayHistory(); // Call displayHistory when the page loads
});
