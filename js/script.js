let startQuize = document.querySelector(".start-quiz"),
  quizInfo = document.querySelector(".quiz-info"),
  qustionsContainer = document.querySelector(".qustions"),
  exitQuize = document.querySelector(".exit"),
  continueQuize = document.querySelector(".continue"),
  nextBtn = document.querySelector(".next_btn"),
  contentQuestion = document.querySelector(".qustions .content"),
  numberOfQuestion = document.querySelector(".question-num"),
  answers = document.querySelector(".content .option-list"),
  resultBox = document.querySelector(".result-box"),
  replay = document.querySelector(".replay"),
  quit = document.querySelector(".quit");

// actions on click on buttons
document.addEventListener("click", function (e) {
  if (e.target == startQuize) {
    startQuize.classList.add("hide");
    quizInfo.classList.add("active");
  } else if (e.target == exitQuize) {
    startQuize.classList.remove("hide");
    quizInfo.classList.remove("active");
  } else if (e.target == continueQuize) {
    quizInfo.classList.remove("active");
    qustionsContainer.classList.add("active");
    addQuestion(0);
    timing();
  } else if (e.target == replay) {
    // reset quez settings
    qustionsContainer.classList.add("active");
    resultBox.classList.remove("active");
    nextBtn.classList.remove("show");
    document.querySelector(".score").innerText = 0;
    i = 0;
    j = 0;
    addQuestion(0);
    timing();
  } else if (e.target == quit) {
    window.location.reload();
  }
});

let i = 0,
  j = 0,
  countDown,
  progressIncrease,
  fetchQuestion;

// get question from api
fetch("js/question.json")
  .then((Response) => Response.json())
  .then((second) => {
    fetchQuestion = second;
  });

function addQuestion(index) {
  numberOfQuestion.textContent = fetchQuestion[i].numb;
  document.querySelector(
    ".content h2"
  ).innerHTML = `${fetchQuestion[index].numb}. ${fetchQuestion[index].question}`;
  answers.innerHTML = `<li>${fetchQuestion[index].options[0]}</li>
                        <li>${fetchQuestion[index].options[1]}</li>
                        <li>${fetchQuestion[index].options[2]}</li>
                        <li>${fetchQuestion[index].options[3]}</li>`;
  answers.querySelectorAll("li").forEach((li) => {
    li.addEventListener("click", checkValue);
  });
}

// validate the chosen value is right or wrong
let checkValue = function (e) {
  clearInterval(countDown);
  clearInterval(progressIncrease);
  if (e.target.textContent == fetchQuestion[i].answer) {
    e.target.classList.add("correct");
    document.querySelector(".score").innerText++;
    contentQuestion.style.pointerEvents = "none";
    nextBtn.classList.add("show");
  } else {
    e.target.classList.add("wrong");
    // add the correct answer if checked is wrong
    for (j = 0; j < answers.children.length; j++) {
      if (answers.children[j].textContent == fetchQuestion[i].answer) {
        answers.children[j].classList.add("correct");
      }
    }
    contentQuestion.style.pointerEvents = "none";
    nextBtn.classList.add("show");
  }
};

// count down and increase the timing bar size
function timing() {
  let count = document.querySelector(".count-down");
  count.innerText = 15;
  countDown = setInterval(() => {
    count.innerText--;
    if (count.innerText < 10) {
      count.innerText = `0${count.innerText}`;
    }
    if (count.innerText == 0) {
      nextBtn.classList.add("show");
      clearInterval(countDown);
      contentQuestion.style.pointerEvents = "none";
      // add the correct answer when the count down finished and no answer done
      for (j = 0; j < answers.children.length; j++) {
        if (answers.children[j].textContent == fetchQuestion[i].answer) {
          answers.children[j].classList.add("correct");
        }
      }
    }
  }, 1000);
  let width = 0;
  let progress = document.querySelector(".progress");
  progressIncrease = setInterval(() => {
    width += 1;
    progress.style.width = `${width}px`;
    if (width > 549) {
      clearInterval(progressIncrease);
    }
  }, 15000 / 550);
}

// next button actions
nextBtn.onclick = () => {
  i++;
  if (i < fetchQuestion.length) {
    numberOfQuestion.textContent = fetchQuestion[i].numb;
    contentQuestion.style.pointerEvents = "auto";
    addQuestion(i);
    timing();
    nextBtn.classList.remove("show");
  } else {
    showResult();
    contentQuestion.style.pointerEvents = "auto"; //restore pointer events for content on replay quwz choice
  }
};

// show result of the quez
function showResult() {
  qustionsContainer.classList.remove("active");
  resultBox.classList.add("active");
  document.querySelector(".Q-num").innerText = fetchQuestion.length;
}
