const gameContainer = document.getElementById('game');
const bestScore = document.getElementById('best-score');
const currentScore = document.getElementById('current-score');

let flippedCards = [];
let successfulMatches = 0;
let eligiblePairs = 0;
let currentScoreCounter = 0;

function randomRGB() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r},${g},${b})`;
}

function getArrayOfColors(pairs) {
  let COLORS = [];
  while (pairs--) {
    COLORS.push(randomRGB());
  }
  return COLORS.concat(COLORS);
}

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

function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    const newDiv = document.createElement('div');
    newDiv.dataset.color = color;
    newDiv.addEventListener("click", handleCardClick);
    gameContainer.append(newDiv);
  }
}

function startNewGame() {
  let shuffledColors = shuffle(getArrayOfColors(eligiblePairs));
  for (let div of gameContainer.querySelectorAll('div')) {
    div.remove();
  }
  document.querySelector('#best-score-pairs').innerText = eligiblePairs;
  bestScore.innerText = localStorage.getItem('best-score-' + eligiblePairs) || '--';
  currentScore.innerText = currentScoreCounter = 0;
  successfulMatches = 0;
  resetFlippedCards(false);
  createDivsForColors(shuffledColors);
}

function resetFlippedCards(isMatched) {
  while(flippedCards.length) {
    let card = flippedCards.pop();
    if (!isMatched) {
      card.style.backgroundColor = 'white';
    } 
  }
}

function handleCardClick(event) {
  // console.log("you just clicked", event.target);
  if (flippedCards.length < 2 && !flippedCards.includes(event.target) && successfulMatches < eligiblePairs) {
    currentScore.innerText = ++currentScoreCounter;
    flippedCards.push(event.target);
    event.target.style.backgroundColor = event.target.dataset.color;
    if (flippedCards.length === 2) {
      if (flippedCards[0].dataset.color === flippedCards[1].dataset.color) {
        resetFlippedCards(true);
        if (++successfulMatches == eligiblePairs) {
          bestScore.innerText = parseInt(bestScore.innerText) < currentScoreCounter ? parseInt(bestScore.innerText) : currentScoreCounter;
          localStorage.setItem('best-score-' + eligiblePairs, bestScore.innerText);
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

document.querySelector('#reset-all-scores').addEventListener('click', function(e) {
  e.preventDefault();
  for (let counter = document.querySelectorAll('option').length; counter > 0; counter--) {
    localStorage.removeItem('best-score-' + counter);
  }
  bestScore.innerText = '--';
});

document.querySelector('#reset-this-score').addEventListener('click', function(e) {
  e.preventDefault();
  localStorage.removeItem('best-score-' + eligiblePairs);
  bestScore.innerText = '--';
});

document.querySelector('#new-game').addEventListener('submit', function(e) {
  e.preventDefault();
  eligiblePairs = document.getElementById('match-pairs').value;
  startNewGame();
})

window.addEventListener('load', function(e) {
  eligiblePairs = document.querySelector('option[selected="selected"]').value;
  startNewGame();
});