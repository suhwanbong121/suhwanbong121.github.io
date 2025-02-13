const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const tileSize = 20;
const rows = canvas.height / tileSize;
const cols = canvas.width / tileSize;

let pacman = {
    x: tileSize * 2,
    y: tileSize * 2,
    dx: tileSize,
    dy: 0,
    nextDx: tileSize,
    nextDy: 0,
    direction: "right"
};

// Generate food in a square grid pattern
let foodItems = [];
function generateFood() {
    foodItems = [];
    for (let row = 1; row < rows - 1; row += 2) {  
        for (let col = 1; col < cols - 1; col += 2) {
            foodItems.push({
                x: col * tileSize,
                y: row * tileSize
            });
        }
    }
}
generateFood();

function drawPacman() {
    ctx.beginPath();
    let startAngle, endAngle;
    switch (pacman.direction) {
        case "right":
            startAngle = 0.2 * Math.PI;
            endAngle = 1.8 * Math.PI;
            break;
        case "left":
            startAngle = 1.2 * Math.PI;
            endAngle = 0.8 * Math.PI;
            break;
        case "up":
            startAngle = 1.7 * Math.PI;
            endAngle = 1.3 * Math.PI;
            break;
        case "down":
            startAngle = 0.7 * Math.PI;
            endAngle = 0.3 * Math.PI;
            break;
    }

    ctx.arc(pacman.x + tileSize / 2, pacman.y + tileSize / 2, tileSize / 2, startAngle, endAngle);
    ctx.lineTo(pacman.x + tileSize / 2, pacman.y + tileSize / 2);
    ctx.fillStyle = "yellow";
    ctx.fill();
    ctx.closePath();
}

function drawFood() {
    foodItems.forEach(food => {
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(food.x + tileSize / 2, food.y + tileSize / 2, tileSize / 6, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    });
}

function movePacman() {
    pacman.dx = pacman.nextDx;
    pacman.dy = pacman.nextDy;

    pacman.x += pacman.dx;
    pacman.y += pacman.dy;

    // Screen wrapping
    if (pacman.x >= canvas.width) pacman.x = 0;
    if (pacman.x < 0) pacman.x = canvas.width - tileSize;
    if (pacman.y >= canvas.height) pacman.y = 0;
    if (pacman.y < 0) pacman.y = canvas.height - tileSize;
}

function checkCollision() {
    foodItems = foodItems.filter(food => !(pacman.x === food.x && pacman.y === food.y));

    // If all food is eaten, regenerate it
    if (foodItems.length === 0) {
        generateFood();
    }
}

function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFood();
    drawPacman();
    movePacman();
    checkCollision();
}

function changeDirection(event) {
    const keyPressed = event.keyCode;

    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;

    if (keyPressed === LEFT && pacman.dx === 0) {
        pacman.nextDx = -tileSize;
        pacman.nextDy = 0;
        pacman.direction = "left";
    } else if (keyPressed === UP && pacman.dy === 0) {
        pacman.nextDx = 0;
        pacman.nextDy = -tileSize;
        pacman.direction = "up";
    } else if (keyPressed === RIGHT && pacman.dx === 0) {
        pacman.nextDx = tileSize;
        pacman.nextDy = 0;
        pacman.direction = "right";
    } else if (keyPressed === DOWN && pacman.dy === 0) {
        pacman.nextDx = 0;
        pacman.nextDy = tileSize;
        pacman.direction = "down";
    }
}

document.addEventListener("keydown", changeDirection);
setInterval(updateGame, 150);
