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

// console.log(session_id);

let session_id; 

// Function to extract SESSION_ID from the URL
function extractSessionIdFromUrl(url) {
  let searchParams = new URLSearchParams(new URL(url).search);
  return searchParams.get("SESSION_ID");
}

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
    question: "What are the key dimensions of digital wellness outlined in the article?",
    answers: [
      { text: "Time management, multitasking, and screen brightness adjustment", correct: false },
      { text: "Productivity, environment, communication, relationships, mental health, physical health, quantified self, and digital citizenship", correct: true },
      { text: "Social media usage, email etiquette, and device security", correct: false },
      { text: "Online gaming, digital artistry, and virtual reality exploration", correct: false }
    ]
  },
  {
    question: "According to the article, what is one negative consequence of checking your phone mid-task?",
    answers: [
      { text: "Increased accuracy and efficiency", correct: false },
      { text: "Improved workflow and productivity", correct: false },
      { text: "Compromised accuracy and disruption of workflow", correct: true },
      { text: "Enhanced focus and concentration", correct: false }
    ]
  },
  {
    question: "How can individuals cultivate a responsible online presence, as discussed in the article?",
    answers: [
      { text: "By posting frequently on social media to maintain visibility", correct: false },
      { text: "By engaging in respectful discourse and managing their digital footprint", correct: true },
      { text: "By disregarding privacy concerns and sharing personal information liberally", correct: false },
      { text: "By unfollowing all online connections to minimize digital presence", correct: false }
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
  // const sampleUrl = "https://vassarpsych.az1.qualtrics.com/jfe/preview/previewId/50e8b891-9fea-4141-b9e9-8bedaa5aefaa/SV_3q3Aq6mArVZRJ3M?Q_CHL=preview&Q_SurveyVersionID=current&PROLIFIC_PID=12345&STUDY_ID=54321&SESSION_ID=ABCDE12345";
  // Add click event listener to open the modal
  modal.style.display = 'none';

  let session_id = extractSessionIdFromUrl(window.location.href);
  // let session_id = extractSessionIdFromUrl(sampleUrl);
  console.log(session_id);

  // Make a GET request to the end endpoint
  if (session_id) {
    fetch(`https://hammerhead-app-5ehuo.ondigitalocean.app/app/end/?session_id=${session_id}`, {
      method: 'GET',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();  // Assuming the server responds with JSON data
      })
      .then(data => {
        console.log('Success:', data);
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }
}

function calculateScore() {
  // const sampleUrl = "https://vassarpsych.az1.qualtrics.com/jfe/preview/previewId/50e8b891-9fea-4141-b9e9-8bedaa5aefaa/SV_3q3Aq6mArVZRJ3M?Q_CHL=preview&Q_SurveyVersionID=current&PROLIFIC_PID=12345&STUDY_ID=54321&SESSION_ID=ABCDE12345";
  // Add click event listener to open the modal
  let session_id = extractSessionIdFromUrl(window.location.href);
  // let session_id = extractSessionIdFromUrl(sampleUrl);
  console.log(session_id);
  // Construct the URL with the appropriate query parameters
  if (session_id) {
    const scoreUrl = `https://hammerhead-app-5ehuo.ondigitalocean.app/app/score/?session_id=${session_id}&total=${questions.length}&correct=${score}`;
    fetch(scoreUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Handle the JSON response data here
        console.log(data);
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }
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
    // Log the current URL
    console.log("Current URL:", window.location.href);

    // Extract the session ID from the URL
    let session_id = extractSessionIdFromUrl(window.location.href);

    // Log the extracted session ID
    console.log("Extracted session_id:", session_id);

    if (session_id !== null && session_id !== undefined) {
      fetch(`https://hammerhead-app-5ehuo.ondigitalocean.app/app/start/?session_id=${session_id}`, {
        method: 'GET'
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
          }
          return response.json();  // Assuming the server responds with JSON data
        })
        .then(data => {
          console.log('Success:', data);
        })
        .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
        });

      showModal();
      resetQuiz();
    } else {
      // If session_id is not present, still open the modal
      showModal();
      resetQuiz();
    }
  });


// Close the modal when clicking on the close button
closeButton.addEventListener('click', function () {
  let session_id = extractSessionIdFromUrl(window.location.href);
  // let session_id = extractSessionIdFromUrl(sampleUrl);
  console.log(session_id);
  // Make a GET request to the endpoint
  if (session_id) {
    fetch(`https://hammerhead-app-5ehuo.ondigitalocean.app/app/end/?session_id=${session_id}`, {
      method: 'GET',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();  // Assuming the server responds with JSON data
      })
      .then(data => {
        console.log('Success:', data);
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }
  hideModal();
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

