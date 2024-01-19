# Battleships Game

This is a simple implementation of the classic game Battleships. The game is played on a 10x10 grid. The computer places a number of ships on the grid at random. The player enters coordinates to target squares on the grid. The game ends when all ships are sunk.

## How to Play

Enter coordinates of the form “A5”, where "A" is the column and "5" is the row, to specify a square to target. The game will indicate whether your shot resulted in a hit, miss, or sink. The game ends when all ships are sunk.

## Code Organization

The code is organized into several JavaScript files, each responsible for a different part of the game.

- `src/index.js`: This is the entry point of the application. It initializes the game by creating an instance of the Game class and calling its start method.

- `src/game.js`: This file exports a class `Game` which manages the game logic. It has methods for starting the game, handling player input, and checking the game status.

- `src/ship.js`: This file exports a class `Ship` which represents a ship on the grid. It has properties for size and position, and methods for checking if the ship is hit or sunk.

- `src/grid.js`: This file exports a class `Grid` which represents the game grid. It has a method for placing ships on the grid and a method for checking if a given coordinate is a hit or a miss.

The game's user interface is defined in `index.html` and styled with `styles.css`.

## Running the Game

To play the game, open `index.html` in your web browser.