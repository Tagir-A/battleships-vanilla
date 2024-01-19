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
            board[i].push(null);
        }
    }
    return board;
}

/**
 * Renders the game board to the page.
 * @param {Array<Array<null>>} board - The game board to render.
 */
function renderBoard(board) {
    const container = document.getElementById('game-board');
    container.innerHTML = '';
    for (let i = 0; i < board.length; i++) {
        const row = document.createElement('div');
        row.classList.add('row');

        for (let j = 0; j < board[i].length; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.textContent = board[i][j] || '';
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
    const container = document.getElementById('ai-game-board');
    container.innerHTML = '';
    for (let i = 0; i < board.length; i++) {
        const row = document.createElement('div');
        row.classList.add('row');

        for (let j = 0; j < board[i].length; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if (board[i][j] === 'X') {
                cell.textContent = 'X';
            } else if (board[i][j] === 'O') {
                cell.textContent = 'O';
            }
            cell.addEventListener('click', function() {
                handlePlayerGuess(i, j);
            });
            row.appendChild(cell);
        }
        container.appendChild(row);
    }
}
/** 
 * Places the ships on the game board.
 * 1x Battleship (5 squares)
 * 2x Destroyers (4 squares)
 * @param {Array<Array<null>>} board - The game board to place the ships on.
 */
function placeShips(board) {
    const shipSizes = [5, 4, 4];
    const shipSymbols = ['B', 'D', 'D'];

    for (let i = 0; i < shipSizes.length; i++) {
        const shipSize = shipSizes[i];
        const shipSymbol = shipSymbols[i];

        let shipPlaced = false;
        while (!shipPlaced) {
            const randomRow = Math.floor(Math.random() * board.length);
            const randomColumn = Math.floor(Math.random() * board[0].length);

            const isHorizontal = Math.random() < 0.5;

            if (isHorizontal) {
                if (randomColumn + shipSize <= board[0].length) {
                    let canPlaceShip = true;
                    for (let j = 0; j < shipSize; j++) {
                        if (board[randomRow][randomColumn + j] !== null || 
                            (randomRow > 0 && board[randomRow - 1][randomColumn + j] !== null) ||
                            (randomRow < board.length - 1 && board[randomRow + 1][randomColumn + j] !== null) ||
                            (randomColumn > 0 && board[randomRow][randomColumn + j - 1] !== null) ||
                            (randomColumn < board[0].length - 1 && board[randomRow][randomColumn + j + 1] !== null)) {
                            canPlaceShip = false;
                            break;
                        }
                    }
                    if (canPlaceShip) {
                        for (let j = 0; j < shipSize; j++) {
                            board[randomRow][randomColumn + j] = shipSymbol;
                        }
                        shipPlaced = true;
                    }
                }
            } else {
                if (randomRow + shipSize <= board.length) {
                    let canPlaceShip = true;
                    for (let j = 0; j < shipSize; j++) {
                        if (board[randomRow + j][randomColumn] !== null || 
                            (randomColumn > 0 && board[randomRow + j][randomColumn - 1] !== null) ||
                            (randomColumn < board[0].length - 1 && board[randomRow + j][randomColumn + 1] !== null) ||
                            (randomRow > 0 && board[randomRow + j - 1][randomColumn] !== null) ||
                            (randomRow + j + 1 < board.length && board[randomRow + j + 1][randomColumn] !== null)) {
                            canPlaceShip = false;
                            break;
                        }
                    }
                    if (canPlaceShip) {
                        for (let j = 0; j < shipSize; j++) {
                            board[randomRow + j][randomColumn] = shipSymbol;
                        }
                        shipPlaced = true;
                    }
                }
            }
        }
    }
}

function handlePlayerGuess(row, column) {
    if (aiBoard[row][column] !== null) {
        logGameMessage('You hit the AI\'s ship!');
        aiBoard[row][column] = 'X';
    } else {
        logGameMessage('You missed!');
        aiBoard[row][column] = 'O';
    }
    renderAiBoard(aiBoard);
    checkGameOver();
}

function checkGameOver() {

    const WIN_CONDITION = 13;
    // Check if all ships on AI board have been hit
    let xCount = 0
    for (let i = 0; i < aiBoard.length; i++) {
        for (let j = 0; j < aiBoard[i].length; j++) {
            if (aiBoard[i][j] === 'X') {
                xCount++;
            }
        }
    }
    
    if (xCount === WIN_CONDITION) {
        alert('You win!');
        return;
    }

    // AI makes a guess
    const aiGuessRow = Math.floor(Math.random() * playerBoard.length);
    const aiGuessColumn = Math.floor(Math.random() * playerBoard[0].length);

    if (playerBoard[aiGuessRow][aiGuessColumn] !== null) {
        logGameMessage('AI hit your ship!');
        playerBoard[aiGuessRow][aiGuessColumn] = 'X';
        renderBoard(playerBoard);
    } else {
        logGameMessage('AI missed!');
    }

    // Check if all ships on player board have been hit
    xCount = 0
    for (let i = 0; i < playerBoard.length; i++) {
        for (let j = 0; j < playerBoard[i].length; j++) {
            if (playerBoard[i][j] === 'X') {
                xCount++;
            }
        }

    }
    if (xCount === WIN_CONDITION) {
        alert('AI wins!');
    }
}

function logGameMessage(message) {
    const logContainer = document.getElementById('game-log');
    const logMessage = document.createElement('p');
    logMessage.textContent = message;
    logContainer.appendChild(logMessage);
}

const playerBoard = generateBoard(10, 10);
const aiBoard = generateBoard(10, 10);

placeShips(playerBoard);
placeShips(aiBoard);

renderBoard(playerBoard);
renderAiBoard(aiBoard);

