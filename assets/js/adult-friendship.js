'use strict';


/**
 * TESTING PURPOSES ›
 */

// let session_id; // Declare session_id in a higher scope

// // Define the getUrlParams function
// const getUrlParams = function (url) {
//   const params = {};
//   const searchParams = new URLSearchParams(new URL(url).search);
//   for (const [key, value] of searchParams) {
//     params[key] = value;
//   }
//   return params;
// };

// // Function to generate random sample URLs
// const generateRandomSampleUrls = function (count) {
//   const urls = [];
//   for (let i = 0; i < count; i++) {
//     const PROLIFIC_PID = Math.floor(Math.random() * 1000);
//     const STUDY_ID = Math.floor(Math.random() * 1000);
//     session_id = Math.floor(Math.random() * 1000); // Assign session_id in generateRandomSampleUrls
//     const url = `https://example.com?PROLIFIC_PID=${PROLIFIC_PID}&STUDY_ID=${STUDY_ID}&SESSION_ID=${session_id}`;
//     urls.push(url);
//   }
//   return urls;
// };

// // Generate random sample URLs
// const sampleUrls = generateRandomSampleUrls(5);

// // Iterate over each sample URL and capture the session ID
// sampleUrls.forEach(url => {
//   const params = getUrlParams(url);
//   session_id = params['SESSION_ID']; // Update session_id variable
//   // Use session_id variable here, for example:
//   console.log(session_id);
// });

// let session_id;

// // Function to extract SESSION_ID from the URL
// function extractSessionIdFromUrl(url) {
//   let searchParams = new URLSearchParams(new URL(url).search);
//   return searchParams.get("SESSION_ID");
// }


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
    question: "What percentage of US adults are affected by depression each year, underscoring the potential mitigating role of friendships?",
    answers: [
      { text: "5%", correct: false },
      { text: "8%", correct: true },
      { text: "15%", correct: false },
      { text: "20%", correct: false }
    ]
  },
  {
    question: "Which friendship practice is linked to the highest increase in wellbeing, according to research?",
    answers: [
      { text: "Maintaining a gratitude journal", correct: false },
      { text: "Writing a gratitude letter", correct: true },
      { text: "Digital socializing", correct: false },
      { text: "Public expressions of gratitude", correct: false }
    ]
  },
  {
    question: "Which of the following gaps is highlighted in the literature on adult friendship and wellbeing?",
    answers: [
      { text: "An overemphasis on financial aspects of friendships", correct: false },
      { text: "A lack of focus on middle-aged adults", correct: false },
      { text: "Sparse data on specific wellbeing components, with a notable focus on younger adult populations", correct: true },
      { text: "An absence of studies on the role of pets in enhancing adult friendships", correct: false }
    ]
  }

];

const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("quiz-next");

let currentQuestionIndex = 0;
let score = 0;

let openModalTime; // Declare openModalTime as a global variable
let exitModalTime; // Declare exitModalTime as a global variable
let closeModalTime; 


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
  exitModalTime = Date.now();
  console.log("Exit modal time:", exitModalTime);

  // Call function to send elapsed time data
  sendElapsedTimeData();
}


function calculateAndSendScore() {
  // Calculate the score as a percentage
  const percentageScore = (score / questions.length) * 100;

  // Calculate the score data to be sent
  const scoreData = {
    score: score,
    totalQuestions: questions.length,
    percentageScore: percentageScore // Include the percentage score in the data
  };

  // Convert score data to JSON string
  const dataAsString = JSON.stringify(scoreData);

  // Send data to DataPipe
  fetch("https://pipe.jspsych.org/api/data/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
    },
    body: JSON.stringify({
      experimentID: "Ba31pR7ZH2RG", // Your experiment ID
      filename: "scores.csv", // Unique filename for your CSV data
      data: dataAsString,
    }),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.statusText);
      }
      console.log('Score data sent successfully');
    })
    .catch(error => {
      console.error('There was a problem with sending score data:', error);
    });
}


function showScore() {
  resetState();
  questionElement.innerHTML = `You scored ${score} out of ${questions.length}!`;
  nextButton.innerHTML = "Exit";
  nextButton.style.display = "block";

  // Add event listener to exit modal when nextButton is clicked
  nextButton.addEventListener("click", exitModal);

  // Calculate and send the score
  calculateAndSendScore();
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

  // let quizStartTime;
  // let modalExitTime;
  // const timeElapsedEvent = new Event('timeElapsed');

  function resetQuiz() {
    resetState(); // Reset quiz state
    startQuiz(); // Start the quiz
  }


  // Add click event listener to open the modal
  openModalBtn.addEventListener('click', function () {
    showModal();
    resetQuiz();
    openModalTime = Date.now();
    console.log("Open modal time: ", openModalTime);
    sendElapsedTimeData(); // Send openModalTime to DataPipe
  });


  // Close the modal when clicking on the close button
  closeButton.addEventListener('click', function () {
    hideModal();
    closeModalTime = Date.now(); // Capture timestamp when close modal is clicked
    console.log("Close modal time: ", closeModalTime);
    // Calculate elapsed time and send data to DataPipe
    sendElapsedTimeData();
  });

  function sendElapsedTimeData() {
    if (openModalTime && closeModalTime && exitModalTime) {
      const currentOpenTime = Date.now(); // Current time when this function is called
      console.log("Current open time:", currentOpenTime);
      const timeToCloseModal = closeModalTime ? closeModalTime - openModalTime : 0;
      const timeToExitModal = exitModalTime ? exitModalTime - openModalTime : 0;
      console.log("Time to close modal:", timeToCloseModal);
      console.log("Time to exit modal:", timeToExitModal);
  
  
      // Prepare data to send to DataPipe
      const dataToSend = {
        experimentID: "ImqWglh8uDm6",
        filename: "elapsed-times.csv",
        data: JSON.stringify({
          openModalTime: openModalTime,
          closeModalTime: closeModalTime,
          exitModalTime: exitModalTime,
          currentOpenTime: currentOpenTime,
          timeToCloseModal: timeToCloseModal,
          timeToExitModal: timeToExitModal
        })
      };
  
      // Send data to DataPipe
      fetch("https://pipe.jspsych.org/api/data/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        body: JSON.stringify(dataToSend),
      }).then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok: ' + response.statusText);
        }
        console.log('Data sent to DataPipe successfully');
      }).catch(error => {
        console.error('There was a problem sending data to DataPipe:', error);
      });
    } else {
      console.error("Timestamps for modal actions are missing.");
    }
  }




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


