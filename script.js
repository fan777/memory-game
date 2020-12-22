const gameContainer = document.getElementById("game");
const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple"
];

function shuffle(array) {
  let counter = array.length;
  while (counter > 0) {
    let index = Math.floor(Math.random() * counter);
    counter--;
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}

let shuffledColors = shuffle(COLORS);

function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    const newDiv = document.createElement("div");
    newDiv.classList.add(color);
    newDiv.addEventListener("click", handleCardClick);
    gameContainer.append(newDiv);
  }
}

const bestScoreElement = document.getElementById('best-score');
bestScoreElement.innerText = localStorage.getItem('best-score') || '--';

const currentScoreElement = document.getElementById('current-score');
let currentScoreCounter = 0;
currentScoreElement.innerText = currentScoreCounter;

let flippedCards = [];
let matchedCounter = 0;

document.querySelector('#new-game').addEventListener('click', function(e) {
  e.preventDefault();
  resetGame();
});

document.querySelector('#reset-scores').addEventListener('click', function(e) {
  e.preventDefault();
  resetGame();

  localStorage.removeItem('best-score');
  bestScoreElement.innerText = localStorage.getItem('best-score') || '--';
  
});

// TODO: Implement this function!
function handleCardClick(event) {
  //console.log("you just clicked", event.target);
  if (flippedCards.length < 2 && !flippedCards.includes(event.target) && !(matchedCounter === shuffledColors.length / 2)) {
    currentScoreCounter++;
    currentScoreElement.innerText = currentScoreCounter;
    flippedCards.push(event.target);
    event.target.style.backgroundColor = event.target.className;
    if (flippedCards.length === 2) {
      if (flippedCards[0].className === flippedCards[1].className) {
        resetFlippedCards(true);
        if (++matchedCounter === shuffledColors.length / 2) {
          let bestScore = parseInt(localStorage.getItem('best-score'));
          bestScore = bestScore < currentScoreCounter ? bestScore : currentScoreCounter;
          bestScoreElement.innerText = bestScore;
          localStorage.setItem('best-score', bestScore);
          alert('you win!!!');
        }
      } else {
        setTimeout(function() { 
          resetFlippedCards(false)
        }, 1000);
      } 
    }
  }
}

function resetFlippedCards(isMatched) {
  while(flippedCards.length) {
    let card = flippedCards.pop();
    if (!isMatched) {
      card.style.backgroundColor = 'white';
    } 
  }
}

function resetGame() {
  matchedCounter = 0;
  currentScoreCounter = 0;
  currentScoreElement.innerText = currentScoreCounter;
  
  resetFlippedCards(flippedCards);
  for (let div of document.querySelectorAll('#game div')) {
    div.remove();
  }
  
  shuffledColors = shuffle(COLORS);
  createDivsForColors(shuffledColors);
}

// when the DOM loads
createDivsForColors(shuffledColors);
