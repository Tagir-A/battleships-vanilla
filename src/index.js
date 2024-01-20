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

const aiBoardContainer = document.getElementById('ai-game-board');
aiBoardContainer.addEventListener('click', function(event) {
    if (event.target.matches('.cell')) {
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
    aiBoardContainer.innerHTML = '';
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

let playerTurn = true; // true for player, false for AI

function handlePlayerGuess(row, column) {
    if (aiBoard[row][column] === 'X' || aiBoard[row][column] === 'O') {
        addLogMessage('You have already targeted this spot!');
        return; // exit the function if the spot has already been targeted
    }
    if (aiBoard[row][column] !== null) {
        addLogMessage('You hit the AI\'s ship!');
        aiBoard[row][column] = 'X';
    } else {
        addLogMessage('You missed!');
        aiBoard[row][column] = 'O';
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
    } while (playerBoard[aiGuessRow][aiGuessColumn] === 'X' || playerBoard[aiGuessRow][aiGuessColumn] === 'O'); // keep guessing until an untargeted spot is found

    if (playerBoard[aiGuessRow][aiGuessColumn] !== null) {
        addLogMessage('AI hit your ship!');
        playerBoard[aiGuessRow][aiGuessColumn] = 'X';
        renderBoard(playerBoard);
    } else {
        addLogMessage('AI missed!');
        playerTurn = true;
    }
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

function addLogMessage(message) {
    var logContainer = document.getElementById('log-container');
    var newLogMessage = document.createElement('p');
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

