const questions = [
  { question: 'Which action best reduces your digital footprint risk?', answers: ['Posting your full home address publicly', 'Reviewing privacy settings and limiting who can see posts', 'Sharing your school name and schedule with everyone', 'Accepting every app permission without checking'], correct: 1 },
  { question: 'Why is location tagging risky?', answers: ['It helps everyone know your favorite music', 'It can reveal where you are and expose your routines', 'It makes posts visible only to search engines', 'It automatically deletes old posts'], correct: 1 },
  { question: 'What is the safest response to a suspicious message?', answers: ['Reply immediately with personal details', 'Ask a trusted adult for help and report or block it', 'Forward it to friends', 'Click every link to investigate'], correct: 1 },
  { question: "What is a digital footprint?", answers: ["The physical footprint left by a person","The information and traces you leave online","A type of computer virus","A social media application"], correct: 1 },
   {
    question: "Which is the safest way to protect your social media account?",
    answers: [
      "Use the same password everywhere",
      "Share your password with friends",
      "Use a strong and unique password",
      "Write your password in public"
    ],
    correct: 2
  },
  {
    question: "What should you do if you are being cyberbullied?",
    answers: [
      "Keep it secret forever",
      "Reply with more bullying",
      "Save evidence and tell a trusted adult or authority",
      "Share your password"
    ],
    correct: 2
  },
  {
    question: "What should you do if you receive a suspicious link?",
    answers: [
      "Click it immediately",
      "Share it with friends",
      "Avoid clicking and verify the sender",
      "Enter your password"
    ],
    correct: 2
  },
  {
    question: "What is phishing?",
    answers: [
      "A method of catching fish",
      "A scam used to steal personal information",
      "A social media feature",
      "A type of strong password"
    ],
    correct: 1
  }
];

const questionEl = document.getElementById('question');
const answersEl = document.getElementById('answers');
const nextBtn = document.getElementById('nextBtn');
const statusEl = document.getElementById('status');
const timerEl = document.getElementById('timer');
const scoreEl = document.getElementById('score');
const resultTextEl = document.getElementById('resultText');
const certificationLink = document.getElementById('certificationLink');
const questionTimeLimit = 15;
let currentIndex = 0;
let score = 0;
let answered = false;
let quizStarted = false;
let timerInterval;
let preparationInterval;

function renderQuestion(startTimer = false) {
  clearInterval(timerInterval);
  clearInterval(preparationInterval);
  answered = false;
  const current = questions[currentIndex];
  questionEl.textContent = current.question;
  statusEl.textContent = `Question ${currentIndex + 1} of ${questions.length}`;
  let timeRemaining = questionTimeLimit;
  timerEl.classList.remove('timer-warning');
  timerEl.textContent = quizStarted ? `${timeRemaining}s` : 'Press Start';
  answersEl.innerHTML = '';
  current.answers.forEach((answer, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'answer';
    button.textContent = answer;
    button.disabled = !quizStarted;
    button.addEventListener('click', () => selectAnswer(button, index === current.correct));
    answersEl.appendChild(button);
  });
  nextBtn.textContent = !quizStarted ? 'Start quiz' : (currentIndex === questions.length - 1 ? 'See result' : 'Next');
  if (startTimer) beginQuestionTimer();
}

function beginQuestionTimer() {
  let timeRemaining = questionTimeLimit;
  timerInterval = setInterval(() => {
    timeRemaining -= 1;
    timerEl.textContent = `${timeRemaining}s`;
    if (timeRemaining <= 5) {
      timerEl.classList.add('timer-warning');
    }
    if (timeRemaining === 0) {
      clearInterval(timerInterval);
      showNextQuestion();
    }
  }, 1000);
}

function startQuiz() {
  quizStarted = true;
  nextBtn.disabled = true;
  timerEl.classList.add('timer-starting');
  let preparationTime = 3;
  timerEl.textContent = `Starting in ${preparationTime}`;
  preparationInterval = setInterval(() => {
    preparationTime -= 1;
    timerEl.textContent = preparationTime > 0 ? `Starting in ${preparationTime}` : 'Go!';
    if (preparationTime === 0) {
      clearInterval(preparationInterval);
      timerEl.classList.remove('timer-starting');
      [...answersEl.children].forEach((item) => {
        item.disabled = false;
      });
      nextBtn.disabled = false;
      timerEl.textContent = `${questionTimeLimit}s`;
      beginQuestionTimer();
    }
  }, 1000);
}

function selectAnswer(button, isCorrect) {
  if (answered) return;
  answered = true;
  [...answersEl.children].forEach((item, index) => {
    item.disabled = true;
    if (index === questions[currentIndex].correct) item.classList.add('correct');
  });
  if (!isCorrect) button.classList.add('wrong');
  if (isCorrect) score += 1;
  scoreEl.textContent = `${Math.round((score / questions.length) * 100)}%`;
}

function showNextQuestion() {
  clearInterval(timerInterval);
  if (currentIndex < questions.length - 1) {
    currentIndex += 1;
    renderQuestion(true);
    return;
  }
  questionEl.textContent = 'Quiz complete!';
  answersEl.innerHTML = '<p>Review the checklist and continue learning to strengthen your online safety habits.</p>';
  statusEl.textContent = 'Completed';
  resultTextEl.textContent = `You scored ${Math.round((score / questions.length) * 100)}%. Continue to the certification questionnaire to complete your learning check.`;
  certificationLink.hidden = false;
  timerEl.classList.remove('timer-warning');
  timerEl.textContent = '';
  nextBtn.textContent = 'Restart';
  nextBtn.onclick = () => {
    clearInterval(timerInterval);
    currentIndex = 0;
    score = 0;
    quizStarted = false;
    scoreEl.textContent = '0%';
    resultTextEl.textContent = 'Take the quiz to see how well you understand digital privacy.';
    certificationLink.hidden = true;
    nextBtn.onclick = null;
    renderQuestion();
  };
}

nextBtn.addEventListener('click', () => {
  if (!quizStarted) {
    startQuiz();
    return;
  }
  if (!answered) return;
  showNextQuestion();
});

renderQuestion();
