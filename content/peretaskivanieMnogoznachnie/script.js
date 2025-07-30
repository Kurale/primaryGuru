// Game state
const gameState = {
    currentQuestionIndex: 0,
    totalAttempts: 0,
    correctAnswers: 0,
    questions: [],
    isChecking: false,
    isCorrect: false
};

// DOM elements
const welcomeScreen = document.getElementById('welcome-screen');
const taskScreen = document.getElementById('task-screen');
const resultScreen = document.getElementById('result-screen');
const startBtn = document.getElementById('start-btn');
const checkBtn = document.getElementById('check-btn');
const nextBtn = document.getElementById('next-btn');
const tryAgainBtn = document.getElementById('try-again-btn');
const questionText = document.getElementById('question-text');
const digitsArea = document.getElementById('digits-area');
const dropZones = document.querySelectorAll('.drop-zone');
const resultMessage = document.getElementById('result-message');
const totalAttemptsEl = document.getElementById('total-attempts');
const correctAnswersEl = document.getElementById('correct-answers');

// Load questions from JSON
async function loadQuestions() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        gameState.questions = data;
        if (gameState.questions.length === 0) {
            throw new Error('No questions found in data.json');
        }
    } catch (error) {
        console.error('Error loading questions:', error);
        // Fallback questions if data.json fails to load
        gameState.questions = [
  {
    "question": "Какое число состоит из 5 сотен тысяч, 2 десятка тысяч и 8 единиц?",
    "answer": "520008"
  },
  {
    "question": "Какое число состоит из 3 сотен тысяч, 7 тысяч и 1 сотни?",
    "answer": "307100"
  },
  {
    "question": "Какое число состоит из 9 сотен тысяч, 4 десятков и 2 единиц?",
    "answer": "900042"
  },
  {
    "question": "Какое число состоит из 1 миллиона, 5 сотен тысяч и 3 десятков?",
    "answer": "1500030"
  },
{
    "question": "Какое число состоит из 6 сотен тысяч, 4 десятков тысяч, 3 тысяч и 5 единиц?",
    "answer": "643005"
  },
  {
    "question": "Какое число состоит из 8 сотен тысяч, 2 тысяч, 7 десятков и 1 единицы?",
    "answer": "802071"
  },
  {
    "question": "Какое число состоит из 4 сотен тысяч, 5 десятков тысяч и 9 десятков?",
    "answer": "450090"
  },
  {
    "question": "Какое число состоит из 2 миллионов и 8 сотен тысяч?",
    "answer": "2800000"
  },
  {
    "question": "Какое число состоит из 7 миллионов, 3 сотен тысяч, 1 десятка тысяч и 4 сотен?",
    "answer": "7310400"
  },
  {
    "question": "Какое число состоит из 5 десятков миллионов, 4 миллионов, 2 десятков тысяч и 6 единиц?",
    "answer": "54020006"
  }
];
    }
}

// Initialize the game
async function initGame() {
    await loadQuestions();
    setupEventListeners();
    showWelcomeScreen();
}

// Show welcome screen
function showWelcomeScreen() {
    welcomeScreen.classList.remove('hidden');
    taskScreen.classList.add('hidden');
    resultScreen.classList.add('hidden');
}

// Show task screen
function showTaskScreen() {
    welcomeScreen.classList.add('hidden');
    taskScreen.classList.remove('hidden');
    resultScreen.classList.add('hidden');
    loadQuestion(gameState.currentQuestionIndex);
}

// Show result screen
function showResultScreen() {
    welcomeScreen.classList.add('hidden');
    taskScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    
    if (gameState.isCorrect) {
        resultMessage.textContent = "Отлично! Ты правильно собрал число!";
        resultMessage.className = "result-message correct";
    } else {
        resultMessage.textContent = "Попробуй ещё раз — у тебя получится!";
        resultMessage.className = "result-message incorrect";
    }
    
    totalAttemptsEl.textContent = gameState.totalAttempts;
    correctAnswersEl.textContent = gameState.correctAnswers;
}

// Load a question
function loadQuestion(index) {
    if (index >= gameState.questions.length) {
        gameState.currentQuestionIndex = 0;
        index = 0;
    }
    
    const question = gameState.questions[index];
    questionText.textContent = question.question;
    
    // Clear previous digits and drop zones
    digitsArea.innerHTML = '';
    const dropZonesContainer = document.getElementById('drop-zones-container');
    dropZonesContainer.innerHTML = '';
    
    // Create digits for dragging
    const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    shuffleArray(digits);
    
    digits.forEach(digit => {
        const digitEl = document.createElement('div');
        digitEl.className = 'digit generator';
        digitEl.textContent = digit;
        digitEl.dataset.value = digit;
        digitEl.draggable = true;
        digitEl.dataset.type = 'generator';
        
        digitEl.addEventListener('dragstart', dragStart);
        digitEl.addEventListener('dragend', dragEnd);
        
        digitsArea.appendChild(digitEl);
    });
    
    // Create drop zones based on the answer length
    const answerLength = question.answer.length;
    let zoneGroups = [];
    
    if (answerLength === 7) {
        zoneGroups = [
            [0],           // Миллионы
            [1, 2, 3],     // Сотни, десятки, единицы тысяч
            [4, 5, 6]      // Сотни, десятки, единицы
        ];
    } else {
        zoneGroups = [
            [0, 1, 2],     // Сотни, десятки, единицы тысяч
            [3, 4, 5]      // Сотни, десятки, единицы
        ];
    }
    
    zoneGroups.forEach((group, groupIndex) => {
        const groupEl = document.createElement('div');
        groupEl.className = 'drop-zone-group';
        
        group.forEach(pos => {
            const zoneEl = document.createElement('div');
            zoneEl.className = 'drop-zone';
            zoneEl.dataset.position = pos;
            
            groupEl.appendChild(zoneEl);
        });
        
        dropZonesContainer.appendChild(groupEl);
    });
    
    // Reset UI state
    checkBtn.classList.remove('hidden');
    nextBtn.classList.add('hidden');
    gameState.isChecking = false;
    gameState.isCorrect = false;
    
    // Setup drag and drop for new zones
    setupDragAndDrop();
}

// Clear all drop zones
function clearDropZones() {
    dropZones.forEach(zone => {
        zone.innerHTML = '';
        zone.classList.remove('filled', 'incorrect', 'highlight');
    });
}

// Drag and drop functions
function dragStart(e) {
    const digitValue = e.target.dataset.value;
    e.dataTransfer.setData('text/plain', digitValue);
    
    // Если это генератор - устанавливаем флаг для создания клона
    e.dataTransfer.setData('is-generator', e.target.dataset.type === 'generator');
    
    e.target.classList.add('dragging');
    setTimeout(() => {
        e.target.classList.add('hidden');
    }, 0);
}


function dragEnd(e) {
    e.target.classList.remove('dragging', 'hidden');
}

// ... (предыдущий код остаётся тем же до функции setupDragAndDrop) ...

// Setup event listeners for drag and drop
// Setup event listeners for drag and drop
function setupDragAndDrop() {
    const dropZones = document.querySelectorAll('.drop-zone');
    
    dropZones.forEach(zone => {
        zone.addEventListener('dragover', e => {
            e.preventDefault();
            if (!gameState.isChecking) {
                zone.classList.add('highlight');
            }
        });
        
        zone.addEventListener('dragleave', () => {
            zone.classList.remove('highlight');
        });
        
        zone.addEventListener('drop', e => {
            e.preventDefault();
            zone.classList.remove('highlight');
            
            if (gameState.isChecking) return;
            
            const digitValue = e.dataTransfer.getData('text/plain');
            const isGenerator = e.dataTransfer.getData('is-generator') === 'true';
            const draggedElement = document.querySelector('.digit.dragging');
            
            // Возвращаем исходный элемент в видимое состояние
            if (draggedElement) {
                draggedElement.classList.remove('dragging', 'hidden');
            }
            
            // Удаляем предыдущую цифру из зоны (если есть)
            if (zone.firstChild) {
                const existingDigit = zone.firstChild;
                
                // Если это клон - удаляем полностью
                if (!existingDigit.classList.contains('generator')) {
                    existingDigit.remove();
                } 
                // Если это генератор (крайне маловероятно) - возвращаем
                else {
                    digitsArea.appendChild(existingDigit);
                }
            }
            
            // Для генераторов создаем клон, для обычных цифр - перемещаем
            let digitToPlace;
            if (isGenerator) {
                // Создаем клон генератора
                digitToPlace = document.createElement('div');
                digitToPlace.className = 'digit';
                digitToPlace.textContent = digitValue;
                digitToPlace.dataset.value = digitValue;
                digitToPlace.draggable = true;
                
                // Добавляем обработчики для нового элемента
                digitToPlace.addEventListener('dragstart', dragStart);
                digitToPlace.addEventListener('dragend', dragEnd);
            } else {
                // Перемещаем существующую цифру
                digitToPlace = draggedElement;
            }
            
            // Помещаем цифру в зону
            zone.appendChild(digitToPlace);
            zone.classList.add('filled');
        });
    });
}


// Check the answer
function checkAnswer() {
    gameState.isChecking = true;
    gameState.totalAttempts++;
    
    const currentQuestion = gameState.questions[gameState.currentQuestionIndex];
    const correctAnswer = currentQuestion.answer;
    const dropZones = document.querySelectorAll('.drop-zone');
    
    let userAnswer = '';
    let isCorrect = true;
    
    // Strict validation including zeros
    dropZones.forEach((zone, index) => {
        const digitEl = zone.querySelector('.digit');
        const correctDigit = correctAnswer[index];
        
        // Case 1: Digit is missing (error even for zero)
        if (!digitEl) {
            userAnswer += '✗';
            isCorrect = false;
            zone.classList.add('incorrect-digit');
            zone.classList.remove('correct-digit');
        } 
        // Case 2: Wrong digit (including zero mismatch)
        else if (digitEl.dataset.value !== correctDigit) {
            userAnswer += digitEl.dataset.value;
            isCorrect = false;
            zone.classList.add('incorrect-digit');
            zone.classList.remove('correct-digit');
        } 
        // Case 3: Correct digit
        else {
            userAnswer += digitEl.dataset.value;
            zone.classList.add('correct-digit');
            zone.classList.remove('incorrect-digit');
        }
        
        // Show correct digit always
        const correctDigitEl = document.createElement('div');
        correctDigitEl.className = 'correct-digit-value';
        correctDigitEl.textContent = correctDigit;
        zone.appendChild(correctDigitEl);
    });
    
    gameState.isCorrect = isCorrect;
    
    if (isCorrect) {
        gameState.correctAnswers++;
        showFeedbackMessage("Верно! 👍 Число собрано правильно!", true);
    } else {
        showFeedbackMessage(`Почти получилось! Правильный ответ: ${correctAnswer}`, false);
    }
    
    checkBtn.classList.add('hidden');
    nextBtn.classList.remove('hidden');
}


function showFeedbackMessage(message, isSuccess) {
    const feedbackEl = document.createElement('div');
    feedbackEl.className = isSuccess ? 'feedback success' : 'feedback error';
    feedbackEl.textContent = message;
    
    const questionContainer = document.querySelector('.question-container');
    questionContainer.appendChild(feedbackEl);
    
    // Автоматическое скрытие через 3 секунды
    setTimeout(() => {
        feedbackEl.remove();
    }, 3000);
}

// ... (остальной код остаётся тем же) ...

// Move to next question
function nextQuestion() {
    gameState.currentQuestionIndex++;
    showTaskScreen();
}

// Try again (from result screen)
function tryAgain() {
    showTaskScreen();
}

// Helper function to shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Setup event listeners
function setupEventListeners() {
    startBtn.addEventListener('click', showTaskScreen);
    checkBtn.addEventListener('click', checkAnswer);
    nextBtn.addEventListener('click', nextQuestion);
    tryAgainBtn.addEventListener('click', tryAgain);
    
    setupDragAndDrop();
    
    // Make digits draggable (event delegation)
    digitsArea.addEventListener('dragstart', e => {
        if (e.target.classList.contains('digit')) {
            dragStart(e);
        }
    });
    
    digitsArea.addEventListener('dragend', e => {
        if (e.target.classList.contains('digit')) {
            dragEnd(e);
        }
    });
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', initGame);