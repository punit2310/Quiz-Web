const questionsList = [];
const amount = 5;
let category = 0;
const url = `https://opentdb.com/api.php?amount=${amount}&category=${category}&type=multiple`;
let count = 0;
let increaseWidth = 1;
const homeContainer = document.querySelector(".container");
const questionsContainer = document.querySelector(".questions");
let index;
let isAPI = true;
let isLoading = false;
let optionClick = false;

const alertMessage = (message) => {
  document
    .querySelector(".message")
    .classList.remove("hidden", "alertAnimtionExit");
  document.querySelector(".message").classList.add("alertAnimtion");
  setTimeout(() => {
    document.querySelector(".message").classList.remove("alertAnimtion");
    document
      .querySelector(".message")
      .classList.add("alertAnimtionExit", "hidden");
  }, 2000);
  document.querySelector(".message").textContent = message;
};

const loader = (isLoading) => {
  document.querySelector(".loader").classList.remove("hidden");
  const r = new rive.Rive({
    src: "assets/loader.riv",
    canvas: document.getElementById("canvas"),
    autoplay: isLoading,
    stateMachines: "rocket in movement",
    onload: () => {
      r.resizeDrawingSurfaceToCanvas();
    },
  });
};

async function questionAPI() {
  try {
    isLoading = true;
    if (isLoading) {
      loader(isLoading);
    }
    const response = await fetch(url);
    const data = await response.json();
    const questions = data.results;
    questions.forEach((question) => {
      questionsList.push(question);
    });
  } catch (error) {
    alertMessage("please check your internet or refresh the page");
  }
}

const getQuestions = async () => {
  if (isAPI) {
    await questionAPI();
    isLoading = false;
    if (!isLoading) {
      document.querySelector(".loader").classList.add("hidden");
    }
    isAPI = false;
  }
  let random = (Math.random() * 4).toFixed();
  let question = questionsList[count].question;
  let options = questionsList[count].incorrect_answers;
  let answer = questionsList[count].correct_answer;
  if (!options.includes(answer)) {
    options.splice(random, 0, answer);
  }
  document.querySelector(".ques").innerHTML = question;
  const ul = document.querySelector("ul");
  ul.innerHTML = "";
  for (const option in options) {
    let listItem = document.createElement("li");
    listItem.innerHTML = options[option];
    listItem.setAttribute(
      "data-answer",
      options[option] === answer ? "correct" : "wrong"
    );
    ul.appendChild(listItem);
  }
  homeContainer.classList.remove("animationEntry");
  homeContainer.classList.add("animationExit");
  setTimeout(() => {
    homeContainer.classList.add("hidden");
    questionsContainer.classList.remove("animationExit");
    questionsContainer.classList.remove("hidden");
    questionsContainer.classList.add("animationEntry");
    document.querySelector(".next").classList.remove("buttonExit");
    document.querySelector(".next").classList.remove("hidden");
    document.querySelector(".next").classList.add("buttonEntry");
  }, 300);
  document.querySelector(".score").style.opacity = 0;
  document.querySelector(".score-hist").style.opacity = 0;
};

const questionCategory = {
  mixed: 0,
  historical: 23,
  entertainment: 11,
};

const listOfClass = ["mixed", "historical", "entertainment"];
let headline = "";

homeContainer.addEventListener("click", (e) => {
  let parent = e.target.parentNode;
  let parentClass = parent.classList[0];
  if (listOfClass.includes(parentClass)) {
    let titel = String(parentClass);
    headline = titel.toUpperCase();
    localStorage.setItem("title", headline);
    if (count < amount - 1) {
      category = questionCategory[parentClass];
      getQuestions();
      document.querySelector(".outOf").textContent = `-${amount}`;
      document.querySelector(".comlited").textContent = count + 1;
    }
  }
});

//this function for icrease the width of .fill.
const widthProgress = () => {
  let bar = document.querySelector(".fill");
  bar.style.width = `${increaseWidth}%`;
};

//this function is calling a widthProgress function and increaseProgress increase by 100/amount
const increaseProgress = () => {
  increaseWidth += 100 / amount;
  widthProgress();
};

//next button
document.querySelector(".next").addEventListener("click", () => {
  if (optionClick) {
    let len = amount;
    if (count < len - 1) {
      count++;
      if (count === len - 1) {
        document.querySelector(".sub").classList.remove("hidden");
        document.querySelector(".sub").classList.add("buttonEntry");
        document.querySelector(".next").style.pointerEvents = "none";
        document.querySelector(".next").style.opacity = 0.5;
      }
    }
    //increase progress
    increaseProgress();
    if (len >= count + 1) {
      document.querySelector(".comlited").textContent = count + 1;
    }
    getQuestions();
    optionClick = false;
  } else {
    alertMessage("please select your answer");
  }
});

//this function for disable the all li when one li was occured
const disableOptions = () => {
  const options = document.querySelectorAll("li");
  options.forEach((option) => {
    option.style.pointerEvents = "none";
  });
};

let score = 0;

//if user select wrong answer then this function is occured
const highlightCorrectAnswer = () => {
  let items = document.querySelectorAll("li");
  for (const item of items) {
    if (item.getAttribute("data-answer") === "correct") {
      item.style.backgroundColor = "green";
    }
  }
};

//this event for check the answer and when I tag is occured then what it's do
questionsContainer.addEventListener("click", (e) => {
  if (e.target.tagName === "LI") {
    const selectedItem = e.target;
    const isCorrect = selectedItem.getAttribute("data-answer") === "correct";
    if (isCorrect) {
      e.target.style.backgroundColor = "green";
      e.target.style.boxShadow = "none";
      score++;
    } else {
      e.target.style.backgroundColor = "red";
      e.target.style.boxShadow = "none";
      highlightCorrectAnswer();
    }
    //disabel all li
    disableOptions();
    optionClick = true;
  } else if (e.target.tagName === "I") {
    document.querySelector(".exitInfoContainer").classList.remove("hidden");
    document
      .querySelector(".exitInfoContainer")
      .classList.add("BoardAnimation");
    document
      .querySelector(".exitInfoContainer")
      .classList.remove("BoardAnimationExit");
  }
});

const resetQuiz = () => {
  optionClick = false;
  count = 0;
  index = "";
  increaseWidth = 1;
  widthProgress();
  document.querySelector(".score").style.opacity = 1;
  document.querySelector(".score-hist").style.opacity = 1;
  score = 0;
  isAPI = true;
  questionsList.splice(0, questionsList.length);
  document.querySelector(".next").style.pointerEvents = "auto";
  document.querySelector(".next").style.opacity = 1;
};

const exit = (messageContainer) => {
  questionsContainer.classList.remove("animationEntry");
  questionsContainer.classList.add("animationExit");
  setTimeout(() => {
    questionsContainer.classList.add("hidden");
    homeContainer.classList.remove("hidden");
    homeContainer.classList.remove("animationExit");
    homeContainer.classList.add("animationEntry");
    document.querySelector(".next").classList.remove("buttonEntry");
    document.querySelector(".next").classList.add("hidden");
    document.querySelector(".sub").classList.add("hidden");
    document.querySelector(messageContainer).classList.add("hidden");
  }, 300);
  resetQuiz();
};

document.querySelector(".exitInfoContainer").addEventListener("click", (e) => {
  if (
    e.target.classList.contains("resume") ||
    e.target.classList.contains("fa-arrow-rotate-right")
  ) {
    document
      .querySelector(".exitInfoContainer")
      .classList.add("BoardAnimationExit");
    document
      .querySelector(".exitInfoContainer")
      .classList.remove("BoardAnimation");
    setTimeout(() => {
      document.querySelector(".exitInfoContainer").classList.add("hidden");
    }, 300);
  } else if (
    e.target.classList.contains("exits") ||
    e.target.classList.contains("fa-xmark")
  ) {
    document
      .querySelector(".exitInfoContainer")
      .classList.add("BoardAnimationExit");
    document
      .querySelector(".exitInfoContainer")
      .classList.remove("BoardAnimation");
    exit(".exitInfoContainer");
  }
});

document.querySelector(".sub").addEventListener("click", () => {
  if (optionClick) {
    document.querySelector(".scoreBoard").classList.remove("hidden");
    document.querySelector(".scoreBoard").classList.add("BoardAnimation");
    document
      .querySelector(".scoreBoard")
      .classList.remove("BoardAnimationExit");
    document.querySelector(".point").textContent = score;
  } else {
    alertMessage("please select your answer");
  }
});

const getDate = () => {
  let currentDate = new Date();
  let date = currentDate.getDate();
  let month = currentDate.getMonth() + 1;
  let year = currentDate.getFullYear();
  let today = `${date}-${month}-${year}`;
  return today;
};

const addHistory = (heading, correctCount, today) => {
  const hist = document.createElement("div");
  hist.classList.add("hist");
  hist.textContent = heading;
  const date = document.createElement("h3");
  date.textContent = today;
  const point = document.createElement("div");
  point.classList.add("gainScore");
  point.textContent = `+${correctCount}`;
  hist.appendChild(date);
  hist.appendChild(point);
  document.querySelector(".scroll").append(hist);
};

const saveHist = (heading, correctCount) => {
  let history = JSON.parse(localStorage.getItem("setHis")) || [];
  const newEntry = {
    heading,
    correctCount,
    date: getDate(),
  };
  history.push(newEntry);
  localStorage.setItem("setHis", JSON.stringify(history));
};

document.querySelector(".scoreBoard").addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    document.querySelector(".scoreBoard").classList.add("BoardAnimationExit");
    document.querySelector(".scoreBoard").classList.remove("BoardAnimation");
    let totalScore = Number(document.querySelector(".value").textContent);
    totalScore += score;
    totalScore = String(totalScore);
    localStorage.setItem("figure", JSON.stringify(totalScore));
    document.querySelector(".value").textContent = totalScore;
    let heading = localStorage.getItem("title");
    saveHist(heading, score);
    addHistory(heading,score,getDate());
    exit(".scoreBoard");
  }
});

window.addEventListener("load", () => {
  let totalScores = JSON.parse(localStorage.getItem("figure")) || 0;
  let history = JSON.parse(localStorage.getItem("setHis")) || [];
  history.forEach((entry) =>
    addHistory(entry.heading, entry.correctCount, entry.date)
  );
  document.querySelector(".value").textContent = totalScores;
  isAPI = true;
  if (questionsList.length > 0) {
    questionsList.splice(0, questionsList.length);
  }
});

const createRandomStar = () => {
  let topRand = Math.floor(Math.random() * 210);
  let leftRand = Math.floor(Math.random() * 90);
  let fontSizeRand = Math.floor(Math.random() * 5);
  const colors = [
    "white",
    "#ffcda5",
    "#ffd250",
    "#ff8220",
    "#fff220",
    "#ff5000",
  ];
  let idx = Math.floor(Math.random() * colors.length);
  const star = document.createElement("i");
  star.classList.add("fa-solid", "fa-star");
  star.style = `color:${colors[idx]};
                top:${topRand}vmin;
                left:${leftRand}vmin;
                font-size:${fontSizeRand}vmin;`;
  document.body.appendChild(star);
};

for (let i = 0; i < 40; i++) {
  createRandomStar();
}

const histContainer = document.querySelector(".histContainer");
document.querySelector(".score-hist").addEventListener("click", () => {
  histContainer.classList.remove("hidden");
  histContainer.classList.add("animationEntry");
  setTimeout(() => {
    histContainer.classList.remove("animationEntry");
  }, 300);
});

histContainer.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    histContainer.classList.add("animationExit");
    setTimeout(() => {
      histContainer.classList.add("hidden");
      histContainer.classList.remove("animationExit");
    }, 300);
  }
});