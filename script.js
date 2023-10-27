// Pages
const gamePage = document.getElementById("game-page");
const scorePage = document.getElementById("score-page");
const splashPage = document.getElementById("splash-page");
const countdownPage = document.getElementById("countdown-page");
// Splash Page
const startForm = document.getElementById("start-form");
const radioContainers = document.querySelectorAll(".radio-container");
const radioInputs = document.querySelectorAll("input");
const bestScores = document.querySelectorAll(".best-score-value");
// Countdown Page
const countdown = document.querySelector(".countdown");
// Game Page
const itemContainer = document.querySelector(".item-container");
// Score Page
const finalTimeEl = document.querySelector(".final-time");
const baseTimeEl = document.querySelector(".base-time");
const penaltyTimeEl = document.querySelector(".penalty-time");
const playAgainBtn = document.querySelector(".play-again");

// Equations
let questionsAmount = 0;
let equationsArray = [];
let playerGuessArray = [];

// Game Page
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat = [];

// Time
let timer;
let timePlayed = 0;
let bestTime = 0;
let penaltyTime = 0;
let finalTime = 0;
let finalTimeDisplay = "0.0s";

// Scroll
let valueY = 0; // this value will change when we answer each question

// Show score page
function showScorePAge() {
  gamePage.classList.add("hidden");
  scorePage.classList.remove("hidden");
}

// Format & Display time in DOM
function scoresToDOM() {
  finalTime = finalTime.toFixed(1);
  baseTime = timePlayed.toFixed(1);
  penaltyTime = penaltyTime.toFixed(1);
  baseTimeEl.textContent = `Base time. ${baseTime}`;
  penaltyTimeEl.textContent = `Penalty time: +${penaltyTime}`;
  finalTimeEl.textContent = `${finalTime}s`;
  showScorePAge();
}

// Stop timer, process results, go to score page
function checkTime() {
  console.log(timePlayed);
  console.log("player guess array", playerGuessArray.length);
  if (playerGuessArray.length == questionsAmount) {
    clearInterval(timer);
    equationsArray.forEach((e, index) => {
      if (e.evaluated === playerGuessArray[index]) {
        // correct gues, no penalty
      } else {
        penaltyTime += 0.5;
      }
    });
    finalTime = timePlayed + penaltyTime;
    console.log(
      "time",
      timePlayed,
      "penalty time",
      penaltyTime,
      "final time",
      finalTime
    );
    scoresToDOM();
  }
}

// add a tenth of a second to timeplayed
function addTime() {
  timePlayed += 0.1;
  checkTime();
}

// Start timer when game page is clicked
function startTimer() {
  // Reset time
  timePlayed = 0;
  penaltyTime = 0;
  finalTime = 0;
  timer = setInterval(addTime, 100);
  gamePage.removeEventListener("click", startTimer);
}

//Scroll and store guess player selection in player GuessArray
function select(guessedTrue) {
  // scroll 80 pixels because that is height of each equation
  valueY += 80;
  itemContainer.scroll(0, valueY);
  return guessedTrue
    ? playerGuessArray.push("true")
    : playerGuessArray.push("false");
}

// get random  number up to a max number
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

// Create Correct/Incorrect Random Equations
function createEquations() {
  // Randomly choose how many correct equations there should be
  const correctEquations = getRandomInt(questionsAmount);
  //Set amount of wrong equations
  const wrongEquations = questionsAmount - correctEquations;
  // Loop through, multiply random numbers up to 9, push to array
  for (let i = 0; i < correctEquations; i++) {
    firstNumber = getRandomInt(9);
    secondNumber = getRandomInt(9);
    const equationValue = firstNumber * secondNumber;
    const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
    equationObject = { value: equation, evaluated: "true" };
    equationsArray.push(equationObject);
  }
  // Loop through, mess with the equation results, push to array
  for (let i = 0; i < wrongEquations; i++) {
    firstNumber = getRandomInt(9);
    secondNumber = getRandomInt(9);
    const equationValue = firstNumber * secondNumber;
    wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
    wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`;
    wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;
    const formatChoice = getRandomInt(3);
    const equation = wrongFormat[formatChoice];
    equationObject = { value: equation, evaluated: "false" };
    equationsArray.push(equationObject);
  }
  shuffleArray(equationsArray);
  // equationsToDOM();
}

// add the random equiations to the DOM
function equationsToDOM() {
  equationsArray.forEach((equation) => {
    // item
    const item = document.createElement("div");
    item.classList.add("item");
    // equiationText
    const equiationText = document.createElement("h1");
    equiationText.textContent = equation.value;
    item.appendChild(equiationText);
    itemContainer.appendChild(item);
  });
}

// Dynamically adding correct/incorrect equations
function populateGamePage() {
  // Reset DOM, Set Blank Space Above
  itemContainer.textContent = "";
  // Spacer
  const topSpacer = document.createElement("div");
  topSpacer.classList.add("top-spacer");
  // Selected Item
  const selectedItem = document.createElement("div");
  selectedItem.classList.add("selected-item");
  // Append
  itemContainer.append(topSpacer, selectedItem);

  // Create Equations, Build Elements in DOM
  createEquations();
  equationsToDOM();

  // Set Blank Space Below
  const bottomSpacer = document.createElement("div");
  bottomSpacer.classList.add("bottom-spacer");
  itemContainer.appendChild(bottomSpacer);
}

// display countdown 3, 2, 1, GO!!
function countdownStart() {
  countdown.textContent = "3";
  setTimeout(() => {
    countdown.textContent = "2";
  }, 1000);
  setTimeout(() => {
    countdown.textContent = "1";
  }, 2000);
  setTimeout(() => {
    countdown.textContent = "Go!!!";
    countdownPage.classList.add("hidden");
    gamePage.classList.remove("hidden");
  }, 3000);
}

// navigate from splash page to countdown page
function showCountdown() {
  countdownPage.classList.remove("hidden");
  splashPage.classList.add("hidden");
  countdownStart();
  // createEquations();
  populateGamePage();
}

// get value from selected radio button
function getRadioValue() {
  let radioValue;
  radioInputs.forEach((radioInput) => {
    if (radioInput.checked) {
      radioValue = radioInput.value;
    }
  });
  return radioValue;
}

// decide amount of questions
function selectQuestionAmoung(event) {
  event.preventDefault();
  questionsAmount = getRadioValue();
  // checking if user select any value
  if (questionsAmount) {
    showCountdown();
  }
}

startForm.addEventListener("click", () => {
  radioContainers.forEach((element) => {
    // remove selected label styling
    element.classList.remove("selected-label");
    // add it back if radio is checked
    if (element.children[1].checked) {
      element.classList.add("selected-label");
    }
  });
});

// event listeners startform
startForm.addEventListener("submit", selectQuestionAmoung);
gamePage.addEventListener("click", startTimer);
