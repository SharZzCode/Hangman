// String prototype method

String.prototype.replaceAt = function (index, replacement) {
  return (
    this.substring(0, index) +
    replacement +
    this.substring(index + replacement.length)
  );
};

// Declare global variables

let hangmanParts = document.querySelectorAll(".noDisplay");
let displayedHiddenWord = document.querySelector(".word");
let keyboard = document.querySelector(".keyboard");
let wrongLettersContainer = document.querySelector(".wrong-letters");
let helpBtn = document.querySelector(".help-btn");
let startBtn = document.querySelector(".start-btn");
let wrongLetters = "";
let keyboardButtons;
let hiddenWord = "";
let hangmanPartsIndex = 0;

// Generate random word via API

let generatedWord;

fetch("https://api.api-ninjas.com/v1/randomword")
  .then((response) => response.json())
  .then((data) => {
    generatedWord = data.word;
    generatedWord = generatedWord.toLocaleLowerCase();
    displayHiddenWord(generatedWord, "");
    generateKeyboard();
    guessLetter();
  });

// Display on the screen the hidden word

function displayHiddenWord(word) {
  console.log(generatedWord);
  word.split("").forEach(() => {
    hiddenWord += "_";
  });
  displayedHiddenWord.innerHTML = hiddenWord;
}

// Build the keyboard

let alphabetArray = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];

function generateKeyboard() {
  alphabetArray.forEach((letter) => {
    let letterDiv = document.createElement("div");
    letterDiv.innerHTML = letter;
    letterDiv.classList.add("letterDiv");
    keyboard.appendChild(letterDiv);
  });
}

// Check if the clicked letter is right or not

function guessLetter() {
  keyboardButtons = document.querySelectorAll(".letterDiv");
  keyboardButtons.forEach((letterDiv) => {
    letterDiv.addEventListener("click", (btn) => {
      if (
        generatedWord
          .split("")
          .some((letter) => letter === letterDiv.innerHTML) ||
        wrongLetters.split("").some((letter) => letter === letterDiv.innerHTML)
      ) {
        displayLetter(letterDiv.innerHTML);
      } else {
        wrongLetters += letterDiv.innerHTML;
        wrongLettersContainer.innerHTML = wrongLetters;

        if (hangmanPartsIndex !== 6) {
          hangmanParts[hangmanPartsIndex].style.display = "block";
        }

        if (hangmanPartsIndex === 6) {
          hangmanParts.forEach((hangmanPart) => {
            hangmanPart.style.backgroundColor = "#c4301a";
            hangmanPart.style.border = "#c4301a";
          });

          displayedHiddenWord.innerHTML = generatedWord;
          displayedHiddenWord.style.color = "#c4301a";
          keyboard.style.display = "none";
          helpBtn.style.display = "none";
        } else {
          hangmanPartsIndex++;
        }
      }
    });
  });
}

// Display the letter

function displayLetter(clickedLetter) {
  if (generatedWord.split("").some((letter) => letter === clickedLetter)) {
    let indices = [];
    for (let i = 0; i < generatedWord.length; i++) {
      if (generatedWord[i] === clickedLetter) indices.push(i);
    }

    indices.forEach((letterIndex) => {
      let replacedWord = hiddenWord.replaceAt(letterIndex, clickedLetter);
      hiddenWord = replacedWord;
      displayedHiddenWord.innerHTML = hiddenWord;
      checkWin();
    });
  }
}

// Write a random word when click the "help me" button

helpBtn.addEventListener("click", displayRandomLetter);

function displayRandomLetter() {
  let randomNum = Math.floor(Math.random() * (generatedWord.length - 0));

  if (hiddenWord[randomNum] === "_") {
    let replacedWord = hiddenWord.replaceAt(
      randomNum,
      generatedWord[randomNum]
    );
    hiddenWord = replacedWord;
    displayedHiddenWord.innerHTML = hiddenWord;
    checkWin();
  } else {
    displayRandomLetter();
  }
}

// Restore the page when click the start game

startBtn.addEventListener("click", () => {
  location.reload();
});

// Check if the user won

function checkWin() {
  if (generatedWord === hiddenWord) {
    displayedHiddenWord.style.color = "green";
    keyboard.style.display = "none";
    helpBtn.style.display = "none";
  }
}
