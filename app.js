// 🎯 SELECTORS
const gameBox = document.querySelectorAll('.box');
const resetGame = document.querySelector('#reset');
const newGameBtn = document.querySelector('#newGame');
const playAgainBtn = document.querySelector('#playAgain');
// const msgContainer = document.querySelector('.msg-container');
const msg = document.querySelector('#msg');
const para = document.querySelector('#para')
const undoBtn = document.querySelector('#undoBtn');
const timerDisplay = document.getElementById('timer');
const resultBoard = document.querySelector('.result-board');


// 🎮 GAME STATE
let turnO = true;
let count = 0;
let gameStarted = false;
let moveHistory = [];

// ⏱ TIMER
let startTime;
let timerInterval;


// 🏆 WIN PATTERNS
const winPatterns = [
  [0, 1, 2],
  [0, 3, 6],
  [0, 4, 8],
  [1, 4, 7],
  [2, 5, 8],
  [2, 4, 6],
  [3, 4, 5],
  [6, 7, 8],
];

// 🎮 GAME CLICK
gameBox.forEach((box, index) => {
  box.addEventListener('click', () => {
    if (box.innerText !== '') return;

    if (!gameStarted) {
      startTimer();
      gameStarted = true;
    }

    let symbol = turnO ? 'O' : 'X';
    box.innerText = symbol;
    turnO = !turnO;

    moveHistory.push({ index, symbol });

    box.disabled = true;
    count++;

    let isWinner = checkWinner();

    if (!isWinner && count === 9) {
      gameDraw();
    }
  });
});

// 🏆 CHECK WINNER
const checkWinner = () => {
  for (let pattern of winPatterns) {
    let [a, b, c] = pattern;

    let pos1 = gameBox[a].innerText;
    let pos2 = gameBox[b].innerText;
    let pos3 = gameBox[c].innerText;

    if (pos1 && pos2 && pos3) {
      if (pos1 === pos2 && pos2 === pos3) {
        showWinner(pos1);
        return true;
      }
    }
  }
  return false;
};

// 🎉 SHOW WINNER
const showWinner = winner => {
  stopTimer();
  let time = timerDisplay.innerText;
  para.innerText = `Congratulations`;
  msg.innerText = `🎉 Winner: ${winner}`;
  resultBoard.classList.remove('hide');

  launchConfetti();
  playSound();

  disableBox();
};

// play sound

const playSound = () => {
  const sound = document.getElementById('winSound');
  sound.currentTime = 0; 
  sound.play();
}

// 🟡 DRAW
const gameDraw = () => {
  stopTimer();
  para.innerText = "";
  msg.innerText = `🤝 Game Draw!`;
  resultBoard.classList.remove('hide');
  disableBox();
};

// 🔒 DISABLE BOXES
const disableBox = () => {
  for (let box of gameBox) {
    box.disabled = true;
  }
};

// 🔓 ENABLE BOXES
const enableBox = () => {
  for (let box of gameBox) {
    box.disabled = false;
    box.innerText = '';
  }
};

// ↩️ UNDO
const undoMove = () => {
  if (moveHistory.length === 0) return;

  let lastMove = moveHistory.pop();

  gameBox[lastMove.index].innerText = '';
  gameBox[lastMove.index].disabled = false;

  turnO = lastMove.symbol === 'X';
  count--;

  if (moveHistory.length === 0) {
    gameStarted = false;
    stopTimer();
    timerDisplay.innerText = '0:00';
  }
};

// ⏱ TIMER
const startTimer = () => {
  clearInterval(timerInterval);

  startTime = Date.now();

  timerInterval = setInterval(() => {
    let elapsed = Date.now() - startTime;
    let seconds = Math.floor((elapsed / 1000) % 60);
    let minutes = Math.floor(elapsed / 60000);

    timerDisplay.innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  },1000);
};

const stopTimer = () => {
  clearInterval(timerInterval);
};


// 🔄 RESET
const resetBtn = () => {
  turnO = true;
  count = 0;
  gameStarted = false;
  moveHistory = [];

  enableBox();

  resultBoard.classList.add('hide');

  stopTimer();
  timerDisplay.innerText = '0:00';
};

// confetti
const launchConfetti = () => {
  // Get the result board center
  const board = resultBoard.getBoundingClientRect();
  const x = board.left + board.width / 2;
  const y = board.top + board.height / 2;

  let duration = 500; // Longer effect
  let end = Date.now() + duration;

  let frame = () => {
    window.confetti({
      particleCount: 50,
      angle:60,
      spread: 500,
      startVelocity: 45,
      scalar: 1.2,
      origin: {
        x: x / window.innerWidth, // Normalized x
        y: y / window.innerHeight, // Normalized y
      },
    });

    window.confetti({
      particleCount: 50,
      angle: 120,
      spread: 500,
      startVelocity: 45,
      scalar: 1.2,
      origin: {
        x: x / window.innerWidth, // Normalized x
        y: y / window.innerHeight, // Normalized y
      },
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  frame();
};



// 🎯 EVENTS
resetGame.addEventListener('click', resetBtn);
newGameBtn.addEventListener('click', resetBtn);
playAgainBtn.addEventListener('click', resetBtn);
undoBtn.addEventListener('click', undoMove);
