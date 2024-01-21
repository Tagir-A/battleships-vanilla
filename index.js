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

/**
 * Renders the ai game board to the page.
 * AI board ships are hidden until hit.
 * @param {Array<Array<null>>} board - The game board to render.
 */
function renderAiBoard(board) {
  const aiBoardContainer = document.getElementById("ai-game-board");
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
  function canPlaceShip(board, row, col, shipSize, horizontal) {
    for (let i = 0; i < shipSize; i++) {
      let r = row + (horizontal ? 0 : i);
      let c = col + (horizontal ? i : 0);
      if (
        board[r][c]?.hasShip !== null ||
        board[r - 1]?.[c]?.hasShip !== null ||
        board[r + 1]?.[c]?.hasShip !== null ||
        board[r][c - 1]?.hasShip !== null ||
        board[r][c + 1]?.hasShip !== null ||
        board[r - 1]?.[c - 1]?.hasShip !== null ||
        board[r - 1]?.[c + 1]?.hasShip !== null ||
        board[r + 1]?.[c - 1]?.hasShip !== null ||
        board[r + 1]?.[c + 1]?.hasShip !== null
      ) {
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
      const isHorizontal = getRandomIntInclusive(0, 1) === 0;
      const randomRow = isHorizontal
        ? getRandomIntInclusive(0, board.length - 1)
        : getRandomIntInclusive(0, board.length - 1 - shipSize);
      const randomColumn = isHorizontal
        ? getRandomIntInclusive(0, board[0].length - 1 - shipSize)
        : getRandomIntInclusive(0, board[0].length - 1);

      const placeable = canPlaceShip(
        board,
        randomRow,
        randomColumn,
        shipSize,
        isHorizontal
      );

      if (placeable) {
        for (let j = 0; j < shipSize; j++) {
          let r = randomRow + (isHorizontal ? 0 : j);
          let c = randomColumn + (isHorizontal ? j : 0);
          board[r][c].hasShip = ships[i];
          board[r][c].hasShip.start = { row: randomRow, column: randomColumn };
          board[r][c].hasShip.horizontal = isHorizontal;
        }
        shipPlaced = true;
      }
    }
  }
}

const playerBoard = generateBoard(10, 10);
const aiBoard = generateBoard(10, 10);

placeShips(playerBoard);
placeShips(aiBoard);

renderBoard(playerBoard);
renderAiBoard(aiBoard);

let playerTurn = true; // true for player, false for AI

/**
 *
 * @param {Object} ship - The ship that was destroyed.
 * Mark all cells around the ship as hit.
 */
function handleShipDestroyed(ship, board) {
  const { start, horizontal, size } = ship;
  const { row, column } = start;
  if (horizontal) {
    const before = board[row][column - 1] || null;
    if (before) {
      before.isHit = true;
    }
    const after = board[row][column + size] || null;
    if (after) {
      after.isHit = true;
    }

    for (let i = -1; i < size + 1; i++) {
      const above = board[row - 1]?.[column + i] || null;
      if (above) {
        above.isHit = true;
      }
      const below = board[row + 1]?.[column + i] || null;
      if (below) {
        below.isHit = true;
      }
    }
  } else {
    const above = board[row - 1]?.[column] || null;
    if (above) {
      above.isHit = true;
    }
    const below = board[row + size]?.[column] || null;
    if (below) {
      below.isHit = true;
    }
    for (let i = -1; i < size + 1; i++) {
      const left = board[row + i]?.[column - 1] || null;
      if (left) {
        left.isHit = true;
      }
      const right = board[row + i]?.[column + 1] || null;
      if (right) {
        right.isHit = true;
      }
    }
  }
}

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
    if (cell.hasShip.hits === cell.hasShip.size) {
      addLogMessage(`You destroyed the AI's ${cell.hasShip.name}!`);
      handleShipDestroyed(cell.hasShip, aiBoard);
    }
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
    if (
      playerBoard[aiGuessRow][aiGuessColumn].hasShip.hits ===
      playerBoard[aiGuessRow][aiGuessColumn].hasShip.size
    ) {
      addLogMessage(
        `AI destroyed your ${playerBoard[aiGuessRow][aiGuessColumn].hasShip.name}!`
      );
      handleShipDestroyed(
        playerBoard[aiGuessRow][aiGuessColumn].hasShip,
        playerBoard
      );
    }
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

const aiBoardContainer = document.getElementById("ai-game-board");
aiBoardContainer.addEventListener("click", function (event) {
  if (event.target.matches(".cell")) {
    const row = event.target.dataset.row;
    const column = event.target.dataset.column;
    handlePlayerGuess(row, column);
  }
});
