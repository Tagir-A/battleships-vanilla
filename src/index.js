function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

/**
 * Generates a game board with the specified number of rows and columns.
 * @param {number} rows - The number of rows in the board.
 * @param {number} columns - The number of columns in the board.
 * @returns {Array<Array<null>>} - The generated game board.
 */
function generateBoard(rows, columns) {
  const board = [];

  for (let i = 0; i < rows; i++) {
    board.push([]);
    for (let j = 0; j < columns; j++) {
      const boardCell = {
        row: i,
        column: j,
        hasShip: null,
        isHit: false,
      };
      board[i].push(boardCell);
    }
  }
  return board;
}

/**
 * Renders the game board to the page.
 * @param {Array<Array<null>>} board - The game board to render.
 */
function renderBoard(board) {
  const container = document.getElementById("game-board");
  container.innerHTML = "";
  for (let i = 0; i < board.length; i++) {
    const row = document.createElement("div");
    row.classList.add("row");

    for (let j = 0; j < board[i].length; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      const { hasShip, isHit } = board[i][j];
      if (hasShip) {
        cell.classList.add("ship");
      }
      if (isHit && hasShip) {
        cell.classList.add("hit");
      }
      if (isHit && !hasShip) {
        cell.classList.add("miss");
      }
      row.appendChild(cell);
    }
    container.appendChild(row);
  }
}

const aiBoardContainer = document.getElementById("ai-game-board");
aiBoardContainer.addEventListener("click", function (event) {
  if (event.target.matches(".cell")) {
    const row = event.target.dataset.row;
    const column = event.target.dataset.column;
    handlePlayerGuess(row, column);
  }
});

/**
 * Renders the ai game board to the page.
 * AI board ships are hidden until hit.
 * @param {Array<Array<null>>} board - The game board to render.
 */
function renderAiBoard(board) {
  aiBoardContainer.innerHTML = "";
  for (let i = 0; i < board.length; i++) {
    const row = document.createElement("div");
    row.classList.add("row");

    for (let j = 0; j < board[i].length; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      const { hasShip, isHit } = board[i][j];
      if (hasShip && isHit) {
        cell.classList.add("hit");
      }
      if (isHit && !hasShip) {
        cell.classList.add("miss");
      }
      cell.dataset.row = i;
      cell.dataset.column = j;
      row.appendChild(cell);
    }
    aiBoardContainer.appendChild(row);
  }
}
/**
 * Places the ships on the game board.
 * 1x Battleship (5 squares)
 * 2x Destroyers (4 squares)
 * @param {Array<Array<null>>} board - The game board to place the ships on.
 */
function placeShips(board) {
  function canPlaceShip(board, row, col, length, horizontal) {
    for (let i = 0; i < length; i++) {
      let r = row + (horizontal ? 0 : i);
      let c = col + (horizontal ? i : 0);
      if (r >= board.length || c >= board[0].length || board[r][c] === 1) {
        return false;
      }
    }
    return true;
  }

  const ships = [
    {
      size: 5,
      name: "Battleship",
      hits: 0,
    },
    {
      size: 4,
      name: "Destroyer",
      hits: 0,
    },
    {
      size: 4,
      name: "Destroyer",
      hits: 0,
    },
  ];

  for (let i = 0; i < ships.length; i++) {
    const shipSize = ships[i].size;

    let shipPlaced = false;
    while (!shipPlaced) {
      const randomRow = Math.floor(Math.random() * board.length);
      const randomColumn = Math.floor(Math.random() * board[0].length);

      const isHorizontal = Math.random() < 0.5;

      if (isHorizontal) {
        if (randomColumn + shipSize <= board[0].length) {
          let canPlaceShip = true;
          for (let j = 0; j < shipSize; j++) {
            if (
              board[randomRow][randomColumn + j]?.hasShip !== null ||
              (randomRow > 0 &&
                board[randomRow - 1][randomColumn + j]?.hasShip !== null) ||
              (randomRow < board.length - 1 &&
                board[randomRow + 1][randomColumn + j]?.hasShip !== null) ||
              (randomColumn > 0 &&
                board[randomRow][randomColumn + j - 1]?.hasShip !== null) ||
              (randomColumn < board[0].length - 1 &&
                board[randomRow][randomColumn + j + 1]?.hasShip !== null)
            ) {
              canPlaceShip = false;
              break;
            }
          }
          if (canPlaceShip) {
            for (let j = 0; j < shipSize; j++) {
              board[randomRow][randomColumn + j].hasShip = ships[i];
            }
            shipPlaced = true;
          }
        }
      } else {
        if (randomRow + shipSize <= board.length) {
          let canPlaceShip = true;
          for (let j = 0; j < shipSize; j++) {
            if (
              board[randomRow + j][randomColumn]?.hasShip !== null ||
              (randomColumn > 0 &&
                board[randomRow + j][randomColumn - 1]?.hasShip !== null) ||
              (randomColumn < board[0].length - 1 &&
                board[randomRow + j][randomColumn + 1]?.hasShip !== null) ||
              (randomRow > 0 &&
                board[randomRow + j - 1][randomColumn]?.hasShip !== null) ||
              (randomRow + j + 1 < board.length &&
                board[randomRow + j + 1][randomColumn]?.hasShip !== null)
            ) {
              canPlaceShip = false;
              break;
            }
          }
          if (canPlaceShip) {
            for (let j = 0; j < shipSize; j++) {
              board[randomRow + j][randomColumn].hasShip = ships[i];
            }
            shipPlaced = true;
          }
        }
      }
    }
  }
}

let playerTurn = true; // true for player, false for AI

function handlePlayerGuess(row, column) {
  const cell = aiBoard[row][column];
  if (cell.isHit) {
    addLogMessage("You have already targeted this spot!");
    return; // exit the function if the spot has already been targeted
  }
  if (cell.hasShip) {
    addLogMessage("You hit the AI's ship!");
    cell.isHit = true;
    cell.hasShip.hits++;
  } else {
    addLogMessage("You missed!");
    cell.isHit = true;
    playerTurn = false;
  }
  renderAiBoard(aiBoard);
  checkGameOver();
  while (!playerTurn) {
    handleAiGuess();
  }
}

function handleAiGuess() {
  let aiGuessRow, aiGuessColumn;
  // AI makes a guess
  do {
    aiGuessRow = Math.floor(Math.random() * playerBoard.length);
    aiGuessColumn = Math.floor(Math.random() * playerBoard[0].length);
  } while (playerBoard[aiGuessRow][aiGuessColumn]?.isHit === true); // keep guessing until an untargeted spot is found

  if (playerBoard[aiGuessRow][aiGuessColumn]?.hasShip) {
    addLogMessage("AI hit your ship!");
    playerBoard[aiGuessRow][aiGuessColumn].isHit = true;
    playerBoard[aiGuessRow][aiGuessColumn].hasShip.hits++;
    renderBoard(playerBoard);
  } else {
    addLogMessage("AI missed!");
    playerBoard[aiGuessRow][aiGuessColumn].isHit = true;
    renderBoard(playerBoard);
    playerTurn = true;
  }
}

function checkGameOver() {
  const WIN_CONDITION = 13;
  // Check if all ships on AI board have been hit
  let xCount = 0;
  for (let i = 0; i < aiBoard.length; i++) {
    for (let j = 0; j < aiBoard[i].length; j++) {
      if (aiBoard[i][j].isHit && aiBoard[i][j].hasShip) {
        xCount++;
      }
    }
  }

  if (xCount === WIN_CONDITION) {
    alert("You win!");
    return;
  }

  // Check if all ships on player board have been hit
  xCount = 0;
  for (let i = 0; i < playerBoard.length; i++) {
    for (let j = 0; j < playerBoard[i].length; j++) {
      if (playerBoard[i][j].isHit && playerBoard[i][j].hasShip) {
        xCount++;
      }
    }
  }
  if (xCount === WIN_CONDITION) {
    alert("AI wins!");
  }
}

function addLogMessage(message) {
  var logContainer = document.getElementById("log-container");
  var newLogMessage = document.createElement("p");
  newLogMessage.textContent = message;
  logContainer.appendChild(newLogMessage);

  // Scroll to the bottom of the log container
  logContainer.scrollTop = logContainer.scrollHeight;
}

const playerBoard = generateBoard(10, 10);
const aiBoard = generateBoard(10, 10);

placeShips(playerBoard);
placeShips(aiBoard);

renderBoard(playerBoard);
renderAiBoard(aiBoard);
