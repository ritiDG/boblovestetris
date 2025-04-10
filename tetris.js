const canvas = document.getElementById('tetris');
const ctx = canvas.getContext('2d');
const ROWS = 20;
const COLUMNS = 10;
const BLOCK_SIZE = 30;
const colors = ['#ff0', '#f00', '#0f0', '#00f', '#0ff', '#f0f', '#ff7f00'];

canvas.style.backgroundColor = '#000000'; // Set background to dark black

const SHAPES = [
    { shape: [[[1, 1, 1, 1]], [[1], [1], [1], [1]]], color: 1 }, // I shape
    { shape: [[[1, 1], [1, 1]]], color: 2 }, // O shape
    { shape: [[[0, 1, 0], [1, 1, 1]], [[1, 0], [1, 1], [1, 0]], [[1, 1, 1], [0, 1, 0]], [[0, 1], [1, 1], [0, 1]]], color: 3 }, // T shape
    { shape: [[[1, 0, 0], [1, 1, 1]], [[1, 1], [1, 0], [1, 0]], [[1, 1, 1], [0, 0, 1]], [[0, 1], [0, 1], [1, 1]]], color: 4 }, // L shape
    { shape: [[[0, 0, 1], [1, 1, 1]], [[1, 0], [1, 0], [1, 1]], [[1, 1, 1], [1, 0, 0]], [[1, 1], [0, 1], [0, 1]]], color: 5 }, // J shape
    { shape: [[[1, 1, 0], [0, 1, 1]], [[0, 1], [1, 1], [1, 0]]], color: 6 }, // S shape
    { shape: [[[0, 1, 1], [1, 1, 0]], [[1, 0], [1, 1], [0, 1]]], color: 7 }, // Z shape
];

let grid = Array.from({ length: ROWS }, () => Array(COLUMNS).fill(0));
let currentShape, currentPos, currentRotation;
let score = 0;
let fallSpeed = 500;

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLUMNS; c++) {
            if (grid[r][c]) {
                ctx.fillStyle = colors[grid[r][c] - 1];
                ctx.fillRect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
}

function drawShape() {
    currentShape.shape[currentRotation].forEach((row, rIdx) => {
        row.forEach((cell, cIdx) => {
            if (cell) {
                ctx.fillStyle = colors[currentShape.color - 1];
                ctx.fillRect((currentPos.col + cIdx) * BLOCK_SIZE, (currentPos.row + rIdx) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        });
    });
}

function rotateShape() {
    const newRotation = (currentRotation + 1) % currentShape.shape.length;
    if (canMove(currentShape.shape[newRotation], currentPos.row, currentPos.col)) {
        currentRotation = newRotation;
    }
    drawGrid();
    drawShape();
}

function canMove(shape, row, col) {
    return shape.every((r, rIdx) => r.every((cell, cIdx) => !cell || (row + rIdx >= 0 && row + rIdx < ROWS && col + cIdx >= 0 && col + cIdx < COLUMNS && !grid[row + rIdx][col + cIdx])));
}

function moveShape(dr, dc) {
    if (canMove(currentShape.shape[currentRotation], currentPos.row + dr, currentPos.col + dc)) {
        currentPos.row += dr;
        currentPos.col += dc;
    } else if (dr > 0) {
        placeShape();
        spawnShape();
    }
    drawGrid();
    drawShape();
}

function placeShape() {
    currentShape.shape[currentRotation].forEach((row, rIdx) => row.forEach((cell, cIdx) => {
        if (cell) grid[currentPos.row + rIdx][currentPos.col + cIdx] = currentShape.color;
    }));
    drawGrid();
}

function clearLines() {
    grid = grid.filter(row => row.some(cell => !cell));
    while (grid.length < ROWS) grid.unshift(Array(COLUMNS).fill(0));
}

function spawnShape() {
    const randomShape = JSON.parse(JSON.stringify(SHAPES[Math.floor(Math.random() * SHAPES.length)]));
    currentShape = randomShape;
    currentRotation = 0;
    currentPos = { row: 0, col: Math.floor(COLUMNS / 2) - Math.floor(currentShape.shape[0][0].length / 2) };
    if (!canMove(currentShape.shape[currentRotation], currentPos.row, currentPos.col)) {
        grid = Array.from({ length: ROWS }, () => Array(COLUMNS).fill(0));
        score = 0;
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') moveShape(0, -1);
    if (e.key === 'ArrowRight') moveShape(0, 1);
    if (e.key === 'ArrowDown') moveShape(1, 0);
    if (e.key === 'ArrowUp') rotateShape();
});

spawnShape();
setInterval(() => {
    moveShape(1, 0);
    clearLines();
    drawGrid();
    drawShape();
}, fallSpeed);
