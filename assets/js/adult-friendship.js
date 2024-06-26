'use strict';


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

let participantData = {
  participant: localStorage.getItem('PROLIFIC_PID'),
  openModalTime: null,
  openModalDate: null,
  closeModalTime: null,
  closeModalDate: null,
  exitModalTime: null,
  exitModalDate: null,
  score: null,
  totalQuestions: null,
  percentageScore: null,
  courseTitle: document.title
};


function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  for (let i = 0; i < length; i++) {
    randomString += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomString;
}

function sendParticipantData() {
  // Check if we have captured either closeModalTime or exitModalTime
  if (participantData.closeModalTime || participantData.exitModalTime) {
    const dataAsString = JSON.stringify(participantData);
    console.log(dataAsString);

    // Generate a random filename
    const filename = generateRandomString(10);
    console.log(filename)

    // Send data to DataPipe
    fetch("https://pipe.jspsych.org/api/data/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
      body: JSON.stringify({
        experimentID: "Ba31pR7ZH2RG",
        filename: filename + "-data.json",
        data: dataAsString,
      })
    }).then(response => {
      console.log(response);
      if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.statusText);
      }
      console.log('Participant data sent to DataPipe successfully');
    }).catch(error => {
      console.error('There was a problem sending participant data to DataPipe:', error);
    });
  }
}


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


// function exitModal() {
//   const modal = document.getElementById('quizModal');
//   modal.style.display = 'none';
//   const exitModalTime = Date.now();
//   console.log("Exit modal time:", exitModalTime);

//   const exitModalDate = new Date(exitModalTime);
//   console.log("Exit modal date:", exitModalDate);

//   const participant = localStorage.getItem('PROLIFIC_PID');
//   console.log(participant);

//   // Prepare data to send to DataPipe
//   const timeData = {
//     exitModalTime: exitModalTime,
//     exitModalDate: exitModalDate,
//     participant: participant
//   };
  

//   const dataAsString = JSON.stringify({
//     exitModalTime: timeData.exitModalTime,
//     exitModalDate: timeData.exitModalDate,
//     participant: participant
//   });
//   console.log(dataAsString);

//   // Send data to DataPipe
//   fetch("https://pipe.jspsych.org/api/data/", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Accept: "*/*",
//     },
//     body: JSON.stringify({
//       experimentID: "Ba31pR7ZH2RG",
//       filename: "exit.json",
//       data: dataAsString,
//     })
//   }).then(response => {
//     console.log(response);
//     if (!response.ok) {
//       throw new Error('Network response was not ok: ' + response.statusText);
//     }
//     console.log('Exit modal time sent to DataPipe successfully');
//   }).catch(error => {
//     console.error('There was a problem sending exit modal time to DataPipe:', error);
//   });
// }

// Define exitModal function
function exitModal() {
  const modal = document.getElementById('quizModal');
  modal.style.display = 'none';
  const exitModalTime = Date.now();
  console.log("Exit modal time:", exitModalTime);

  const exitModalDate = new Date(exitModalTime);
  console.log("Exit modal date:", exitModalDate);

  const participant = localStorage.getItem('PROLIFIC_PID');
  console.log(participant);

  // Update participantData
  participantData.exitModalTime = exitModalTime;
  participantData.exitModalDate = exitModalDate;

  sendParticipantData();
}

// sending exitModal times using sendDataToDataPipe helper 
// function exitModal() {
//   const modal = document.getElementById('quizModal');
//   modal.style.display = 'none';
//   const exitModalTime = Date.now();
//   console.log("Exit modal time:", exitModalTime);

//   const exitModalDate = new Date(exitModalTime);
//   console.log("Exit modal date:", exitModalDate);

//   const participant = localStorage.getItem('PROLIFIC_PID');
//   console.log(participant);

//   // Prepare data to send to DataPipe
//   const timeData = {
//     exitModalTime: exitModalTime,
//     exitModalDate: exitModalDate,
//     participant: participant
//   };

//   sendDataToDataPipe(timeData, "exit-times.json");
// }


// function calculateAndSendScore() {
//   // Calculate the score as a percentage
//   const percentageScore = (score / questions.length) * 100;
//   console.log('Score:', score);
//   console.log('Percentage Score:', percentageScore);
  
//   const participant = localStorage.getItem('PROLIFIC_PID');
//   console.log(participant);


// // Calculate the score data to be sent
//   const dataAsString = JSON.stringify({
//     score: score,
//     totalQuestions: questions.length,
//     percentageScore: percentageScore, // Include the percentage score in the data
//     participant: participant
//   });

//   console.log(dataAsString);

//   // Convert score data to JSON string
//   //const dataAsString = JSON.stringify(scoreData);
//   //console.log(dataAsString);

//   // Send data to DataPipe
//   fetch("https://pipe.jspsych.org/api/data/", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Accept: "*/*",
//     },
//     body: JSON.stringify({
//       experimentID: "Ba31pR7ZH2RG", // Your experiment ID
//       filename: "allscores.json", // Unique filename for your CSV data
//       data: dataAsString
//     }),
//   })
//     .then(response => {
//       if (!response.ok) {
//         throw new Error('Network response was not ok: ' + response.statusText);
//       }
//       console.log('Score data sent successfully');
//     })
//     .catch(error => {
//       console.error('There was a problem with sending score data:', error);
//     });
// }

// Define calculateAndSendScore function
function calculateAndSendScore() {
  // Calculate the score as a percentage
  const percentageScore = (score / questions.length) * 100;
  console.log('Score:', score);
  console.log('Percentage Score:', percentageScore);
  
  const participant = localStorage.getItem('PROLIFIC_PID');
  console.log(participant);

  // Update participantData
  participantData.score = score;
  participantData.totalQuestions = questions.length;
  participantData.percentageScore = percentageScore;
}

// }

// send scores using helper function
// function calculateAndSendScore() {
//   // Calculate the score as a percentage
//   const percentageScore = (score / questions.length) * 100;
//   console.log('Score:', score);
//   console.log('Percentage Score:', percentageScore);
  
//   const participant = localStorage.getItem('PROLIFIC_PID');
//   console.log(participant);

//   // Prepare data to send to DataPipe
//   const scoreData = {
//     score: score,
//     totalQuestions: questions.length,
//     percentageScore: percentageScore, // Include the percentage score in the data
//     participant: participant
//   };

//   sendDataToDataPipe(scoreData, "score.json");
// }


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

  

// Event listener for openModalBtn
// openModalBtn.addEventListener('click', function () {
//   showModal();
//   resetQuiz();
//   const openModalTime = Date.now();
//   console.log("Open modal time: ", openModalTime);

//   const openModalDate = new Date(openModalTime);
//   console.log("Open modal date: ", openModalDate);

//   const participant = localStorage.getItem('PROLIFIC_PID');
//   console.log(participant);

//   // Prepare data to send to DataPipe
//   const timeData = {
//     openModalTime: openModalTime,
//     openModalDate: openModalDate,
//     participant: participant
//   };

//   const dataAsString = JSON.stringify(timeData);
//   console.log(dataAsString);

//   // Send data to DataPipe
//   fetch("https://pipe.jspsych.org/api/data/", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Accept: "*/*",
//     },
//     body: JSON.stringify({
//       experimentID: "Ba31pR7ZH2RG",
//       filename: "open-times.json",
//       data: dataAsString,
//     })
//   }).then(response => {
//     console.log(response);
//     if (!response.ok) {
//       throw new Error('Network response was not ok: ' + response.statusText);
//     }
//     console.log('Open modal time sent to DataPipe successfully');
//   }).catch(error => {
//     console.error('There was a problem sending open modal time to DataPipe:', error);
//   });
// });

// // Event listener for closeButton
// closeButton.addEventListener('click', function () {
//   hideModal();
//   const closeModalTime = Date.now(); // Capture timestamp when close modal is clicked
//   console.log("Close modal time: ", closeModalTime);

//   const closeModalDate = new Date(closeModalTime);
//   console.log("Close modal date: ", closeModalDate);

//   const participant = localStorage.getItem('PROLIFIC_PID');
//   console.log(participant);

//   // Prepare data to send to DataPipe
//   const timeData = {
//     closeModalTime: closeModalTime,
//     closeModalDate: closeModalDate,
//     participant: participant
//   };

//   const dataAsString = JSON.stringify(timeData);
//   console.log(dataAsString);

//   // Send data to DataPipe
//   fetch("https://pipe.jspsych.org/api/data/", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Accept: "*/*",
//     },
//     body: JSON.stringify({
//       experimentID: "Ba31pR7ZH2RG",
//       filename: "close-times.json",
//       data: dataAsString,
//     })
//   }).then(response => {
//     console.log(response);
//     if (!response.ok) {
//       throw new Error('Network response was not ok: ' + response.statusText);
//     }
//     console.log('Close modal time sent to DataPipe successfully');
//   }).catch(error => {
//     console.error('There was a problem sending close modal time to DataPipe:', error);
//   });
// });


  // // Add click event listener to open the modal
  // openModalBtn.addEventListener('click', function () {
  //   showModal();
  //   resetQuiz();
  //   const openModalTime = Date.now();
  //   console.log("Open modal time: ", openModalTime);

  //   const openModalDate = new Date(openModalTime);
  //   console.log("Open modal date: ", openModalDate);

  // });


  // // Close the modal when clicking on the close button
  // closeButton.addEventListener('click', function () {
  //   hideModal();
  //   const closeModalTime = Date.now(); // Capture timestamp when close modal is clicked
  //   console.log("Close modal time: ", closeModalTime);

  //   const closeModalDate = new Date(closeModalTime);
  //   console.log("Close modal date: ", closeModalDate);
  // });


  function openModal() {
    showModal();
    resetQuiz();
    const openModalTime = Date.now();
    console.log("Open modal time: ", openModalTime);
  
    const openModalDate = new Date(openModalTime);
    console.log("Open modal date: ", openModalDate);
  
    const participant = localStorage.getItem('PROLIFIC_PID');
    console.log(participant);
  
    // Update participantData
    participantData.openModalTime = openModalTime;
    participantData.openModalDate = openModalDate;
  }
  
  // Add event listener for openModalBtn
  openModalBtn.addEventListener('click', openModal);

  function closeModal(){
    hideModal();

    const closeModalTime = Date.now(); // Capture timestamp when close modal is clicked
    console.log("Close modal time: ", closeModalTime);

    const closeModalDate = new Date(closeModalTime);
    console.log("Close modal date: ", closeModalDate);

    const participant = localStorage.getItem('PROLIFIC_PID');
    console.log(participant);
  
    // Update participantData
    participantData.closeModalTime = closeModalTime;
    participantData.closeModalDate = closeModalDate;

    sendParticipantData();
  }

  closeButton.addEventListener('click', closeModal);


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

