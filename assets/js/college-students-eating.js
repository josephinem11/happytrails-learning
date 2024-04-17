'use strict';

/**
 * Function to extract URL parameters
 */
//  const getUrlParams = function (url) {
//   const params = {};
//   const searchParams = new URLSearchParams(new URL(url).search);
//   for (const [key, value] of searchParams) {
//     params[key] = value;
//   }
//   return params;
// }


// // Capture 'SESSION_ID' from URL
// const params = getUrlParams(window.location.href);
// const session_id = params['SESSION_ID'];

let session_id; // Declare session_id in a higher scope

// Define the getUrlParams function
const getUrlParams = function (url) {
  const params = {};
  const searchParams = new URLSearchParams(new URL(url).search);
  for (const [key, value] of searchParams) {
    params[key] = value;
  }
  return params;
};

// Function to generate random sample URLs
const generateRandomSampleUrls = function (count) {
  const urls = [];
  for (let i = 0; i < count; i++) {
    const PROLIFIC_PID = Math.floor(Math.random() * 1000);
    const STUDY_ID = Math.floor(Math.random() * 1000);
    session_id = Math.floor(Math.random() * 1000); // Assign session_id in generateRandomSampleUrls
    const url = `https://example.com?PROLIFIC_PID=${PROLIFIC_PID}&STUDY_ID=${STUDY_ID}&SESSION_ID=${session_id}`;
    urls.push(url);
  }
  return urls;
};

// Generate random sample URLs
const sampleUrls = generateRandomSampleUrls(5);

// Iterate over each sample URL and capture the session ID
sampleUrls.forEach(url => {
  const params = getUrlParams(url);
  session_id = params['SESSION_ID']; // Update session_id variable
  // Use session_id variable here, for example:
  console.log(session_id);
});





/**
 * add event on element
 */

const addEventOnElem = function (elem, type, callback) {
  if (elem.length > 1) {
    for (let i = 0; i < elem.length; i++) {
      elem[i].addEventListener(type, callback);
    }
  } else {
    elem.addEventListener(type, callback);
  }
}



/**
 * navbar toggle
 */

const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const navLinks = document.querySelectorAll("[data-nav-link]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
}

addEventOnElem(navTogglers, "click", toggleNavbar);

const closeNavbar = function () {
  navbar.classList.remove("active");
  overlay.classList.remove("active");
}

addEventOnElem(navLinks, "click", closeNavbar);



/**
 * header active when scroll down to 100px
 */

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

const activeElem = function () {
  if (window.scrollY > 100) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
}

addEventOnElem(window, "scroll", activeElem);

/**
 * quiz
 */

const questions = [
  {
    question: "What was significantly associated with higher happiness scores among students?",
    answers: [
      { text: "Skipping breakfast", correct: false },
      { text: "Consuming fast food regularly", correct: false },
      { text: "Eating breakfast every day", correct: true },
      { text: "Drinking coffee daily", correct: false }
    ]
  },
  {
    question: "Which food group's consumption was linked to increased happiness?",
    answers: [
      { text: "Processed foods", correct: false },
      { text: "Fruits and vegetables", correct: true },
      { text: "Sugary snacks", correct: false },
      { text: "Red meat", correct: false }
    ]
  },
  {
    question: " How did meal frequency affect happiness levels according to the study?",
    answers: [
      { text: "Eating one large meal a day was best", correct: false },
      { text: "The number of meals had no impact on happiness", correct: false },
      { text: "Skipping meals improved mood", correct: false },
      { text: "Having 3 meals and 1-2 snacks per day led to the highest happiness", correct: true }
    ]
  }

];

const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("quiz-next");

let currentQuestionIndex = 0;
let score = 0;

function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  nextButton.innerHTML = "Next";
  showQuestion();
}

function showQuestion() {
  resetState();
  let currentQuestion = questions[currentQuestionIndex];
  let questionNo = currentQuestionIndex + 1;
  questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

  currentQuestion.answers.forEach(answer => {
    const button = document.createElement("button");
    button.innerHTML = answer.text;
    button.classList.add("quiz-btn");
    answerButtons.appendChild(button);
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener("click", selectAnswer); // Attach event listener
  });
}


function resetState() {
  nextButton.style.display = "none";
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild)
  }
}

function selectAnswer(e) {
  const selectedBtn = e.target;
  const isCorrect = selectedBtn.dataset.correct === "true"
  if (isCorrect) {
    selectedBtn.classList.add("correct");
    score++;
  }
  else {
    selectedBtn.classList.add("incorrect");
  }
  Array.from(answerButtons.children).forEach(button => {
    if (button.dataset.correct === "true") {
      button.classList.add("correct");
    }
    button.disabled = true;
  });
  nextButton.style.display = "block";
}

function exitModal() {
  const modal = document.getElementById('quizModal');
  modal.style.display = 'none';

  // Make a GET request to the end endpoint
  fetch(`https://hammerhead-app-5ehuo.ondigitalocean.app/app/end/?session_id=${session_id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

function calculateScore() {
  // Construct the URL with the appropriate query parameters
  const scoreUrl = `https://hammerhead-app-5ehuo.ondigitalocean.app/app/score/?session_id=${session_id}&total=${questions.length}&correct=${score}`;

  // Send a GET request to the API endpoint
  fetch(scoreUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
}

function showScore() {
  resetState();
  questionElement.innerHTML = `You scored ${score} out of ${questions.length}!`;
  nextButton.innerHTML = "Exit";
  nextButton.style.display = "block";

  // Add event listener to exit modal when nextButton is clicked
  nextButton.addEventListener("click", exitModal);

  // Trigger API call for score calculation
  calculateScore();
}

function handleNextButton() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  }
  else {
    showScore();
  }
}

nextButton.addEventListener("click", () => {
  if (currentQuestionIndex < questions.length) {
    handleNextButton();
  }
  else {
    startQuiz();
  }
});

startQuiz();

document.addEventListener('DOMContentLoaded', function () {
  const modal = document.getElementById('quizModal');
  const openModalBtn = document.getElementById('openQuizModal');
  const modalContent = document.querySelector('.modal-content');
  const closeButton = document.getElementById('closeQuizModal');
  // const submitAnswerButton = document.getElementById('submitAnswer');
  
  let quizStartTime;
  let modalExitTime;
  const timeElapsedEvent = new Event('timeElapsed');

  function resetQuiz() {
    resetState(); // Reset quiz state
    startQuiz(); // Start the quiz
  }

  // Add click event listener to open the modal
  openModalBtn.addEventListener('click', function () {
    // Send GET request to start the quiz
    fetch(`https://hammerhead-app-5ehuo.ondigitalocean.app/app/start/?session_id=${session_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    showModal();
    resetQuiz();
  });

  // Close the modal when clicking on the close button
  closeButton.addEventListener('click', function () {
    hideModal();
    // Make a GET request to the endpoint
    fetch(`https://hammerhead-app-5ehuo.ondigitalocean.app/app/end/?session_id=${session_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  });

  // Close the modal when clicking outside of it
  window.addEventListener('click', function (event) {
    if (event.target === modal) {
      hideModal();
    }
  });

  // Prevent the modal from closing when clicking inside it
  modal.addEventListener('click', function (event) {
    event.stopPropagation();
  });

  // Function to show the modal
  function showModal() {
    modal.classList.add('active');
    modalContent.classList.add('active');
  }

  // Function to hide the modal
  function hideModal() {
    modal.classList.remove('active');
    modalContent.classList.remove('active');
  }
});




