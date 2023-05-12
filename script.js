// Get a reference to the canvas element
const board = document.getElementById("board");

// Get a reference to the canvas context
const ctx = board.getContext("2d");

// Get a reference to the start screen element
const startScreen = document.getElementById("start-screen");

// Get a reference to the start button element
const startButton = document.getElementById("start-button");

// Get a reference to the game over screen element
const gameOverScreen = document.getElementById("game-over-screen");

// Get a reference to the restart button element
const restartButton = document.getElementById("restart-button");

// Get a reference to the score span element
const scoreSpan = document.getElementById("score");

// Define some constants for the game logic
const BOARD_SIZE = 400; // The size of the board in pixels
const CELL_SIZE = 20; // The size of each cell in pixels
const FPS = 10; // The frames per second for the game loop
const SNAKE_COLOR = "lime"; // The color of the snake
const FOOD_COLOR = "red"; // The color of the food
const INITIAL_LENGTH = 3; // The initial length of the snake

// Define some variables for the game state
let snake; // An array of objects representing the snake cells
let direction; // A string representing the current direction of the snake
let food; // An object representing the food cell
let score; // A number representing the current score
let gameOver; // A boolean indicating whether the game is over or not

// Define a function to initialize the game state
function init() {
    // Initialize an empty array for the snake
    snake = [];

    // Initialize the direction as right
    direction = "right";

    // Initialize a random position for the food
    food = {
        x: Math.floor(Math.random() * (BOARD_SIZE / CELL_SIZE)) * CELL_SIZE,
        y: Math.floor(Math.random() * (BOARD_SIZE / CELL_SIZE)) * CELL_SIZE,
    };

    // Initialize the score as zero
    score = 0;

    // Initialize the game over flag as false
    gameOver = false;

    // Loop from zero to initial length minus one
    for (let i = 0; i < INITIAL_LENGTH; i++) {
        // Push an object with x and y coordinates to the snake array
        snake.push({
            x: (INITIAL_LENGTH - i - 1) * CELL_SIZE,
            y: 0,
        });
    }
}

// Define a function to draw the board
function drawBoard() {
    // Clear the canvas with a black background
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, BOARD_SIZE, BOARD_SIZE);

    // Loop through the snake array
    for (let i = 0; i < snake.length; i++) {
        // Draw each snake cell with a lime color and a black border
        ctx.fillStyle = SNAKE_COLOR;
        ctx.fillRect(snake[i].x, snake[i].y, CELL_SIZE, CELL_SIZE);
        ctx.strokeStyle = "black";
        ctx.strokeRect(snake[i].x, snake[i].y, CELL_SIZE, CELL_SIZE);
    }

    // Draw the food cell with a red color and a black border
    ctx.fillStyle = FOOD_COLOR;
    ctx.fillRect(food.x, food.y, CELL_SIZE, CELL_SIZE);
    ctx.strokeStyle = "black";
    ctx.strokeRect(food.x, food.y, CELL_SIZE, CELL_SIZE);
}

// Define a function to update the game logic
function update() {
    // Check if the game is over or not
    if (!gameOver) {
        // Get the next position of the snake head based on the current direction
        let nextX = snake[0].x;
        let nextY = snake[0].y;

        switch (direction) {
            case "right":
                nextX += CELL_SIZE;
                break;
            case "left":
                nextX -= CELL_SIZE;
                break;
            case "up":
                nextY -= CELL_SIZE;
                break;
            case "down":
                nextY += CELL_SIZE;
                break;
        }

        // Check if the next position is out of bounds or collides with the snake body
        if (
            nextX < 0 ||
            nextX >= BOARD_SIZE ||
            nextY < 0 ||
            nextY >= BOARD_SIZE ||
            snake.some((cell) => cell.x === nextX && cell.y === nextY)
        ) {
            // Set the game over flag to true and show the game over screen with the score
            gameOver = true;
            scoreSpan.textContent = score;
            gameOverScreen.style.display = "flex";
        } else {
            // Create a new object for the next position of the snake head and unshift it to the snake array
            let newHead = { x: nextX, y: nextY };
            snake.unshift(newHead);

            // Check if the next position is equal to the food position
            if (nextX === food.x && nextY === food.y) {
                // Increase the score by one and update a new random position for the food
                score++;
                food.x =
                    Math.floor(Math.random() * (BOARD_SIZE / CELL_SIZE)) *
                    CELL_SIZE;
                food.y =
                    Math.floor(Math.random() * (BOARD_SIZE / CELL_SIZE)) *
                    CELL_SIZE;
            } else {
                // Pop out the last element of the snake array as it moves forward
                snake.pop();
            }
        }
    }
}

// Define a function to handle keyboard input from the user
function handleKeydown(event) {
        // Check if the event key is one of the arrow keys and update the direction accordingly if it is not opposite to the current direction
    switch (event.key) {
        case "ArrowRight":
            if (direction !== "left") {
                direction = "right";
            }
            break;
        case "ArrowLeft":
            if (direction !== "right") {
                direction = "left";
            }
            break;
        case "ArrowUp":
            if (direction !== "down") {
                direction = "up";
            }
            break;
        case "ArrowDown":
            if (direction !== "up") {
                direction = "down";
            }
            break;
    }
}

// Define a function to handle touch input from mobile devices
function handleTouch(event) {
    // Prevent the default behavior of the touch event
    event.preventDefault();

    // Get the touch object from the event
    let touch = event.changedTouches[0];

    // Get the x and y coordinates of the touch relative to the board
    let x = touch.pageX - board.offsetLeft;
    let y = touch.pageY - board.offsetTop;

    // Calculate the difference between the touch coordinates and the snake head coordinates
    let dx = x - snake[0].x;
    let dy = y - snake[0].y;

    // Check if the absolute value of dx is greater than or equal to the absolute value of dy
    if (Math.abs(dx) >= Math.abs(dy)) {
        // Check if dx is positive or negative and update the direction accordingly if it is not opposite to the current direction
        if (dx > 0) {
            if (direction !== "left") {
                direction = "right";
            }
        } else {
            if (direction !== "right") {
                direction = "left";
            }
        }
    } else {
        // Check if dy is positive or negative and update the direction accordingly if it is not opposite to the current direction
        if (dy > 0) {
            if (direction !== "up") {
                direction = "down";
            }
        } else {
            if (direction !== "down") {
                direction = "up";
            }
        }
    }
}

// Define a function to handle click events on the start button
function handleStart() {
    // Hide the start screen and initialize the game state
    startScreen.style.display = "none";
    init();
}

// Define a function to handle click events on the restart button
function handleRestart() {
    // Hide the game over screen and initialize the game state
    gameOverScreen.style.display = "none";
    init();
}

// Add an event listener for keydown events on the document
document.addEventListener("keydown", handleKeydown);

// Add an event listener for touchstart events on the board
board.addEventListener("touchstart", handleTouch);

// Add an event listener for click events on the start button
startButton.addEventListener("click", handleStart);

// Add an event listener for click events on the restart button
restartButton.addEventListener("click", handleRestart);

// Call the init function to initialize the game state
init();

// Set an interval for calling the drawBoard and update functions every 1000 / FPS milliseconds
setInterval(() => {
    drawBoard();
    update();
}, 1000 / FPS);


