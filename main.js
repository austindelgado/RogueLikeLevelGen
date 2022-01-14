// Find a way to handle dynamic resizing
let height = Math.floor(window.screen.availHeight / 30);
let width = Math.floor(window.screen.availWidth / 25);

const grid = document.getElementById('grid');

// Create grid based off screen size
let cellArray = new Array(height); // Create 2d array for the grid, probably not best practice
for (let y = 0; y < height; y++)
{
    // New table row
    let row = document.createElement('tr');
    cellArray[y] = new Array(width);

    for (let x = 0; x < width; x++)
    {
        // New col in row
        let id = y * width + x;
        let cell = document.createElement('td');
        cell.id = id;

        row.appendChild(cell);
        cellArray[y][x] = cell;
    }
    grid.appendChild(row);
}

// Please organize and clean up all X and Y
function Walker(x, y, dir) {
    this.posX = x;
    this.posY = y;
    this.dir = dir;
}

// Walker variables
let startingY = Math.round(height / 2);
let startingX = Math.round(width / 2);
let startingWalkers = 3;
let maxWalkers = 10;
let chanceWalkerTurn = .25;
let percentToFill = 0.5;
let floorNum;

let walkers = [];
// Spawn starting walkers
for (let i = 0; i < startingWalkers; i++)
    walkers.push(new Walker(startingX, startingY));

while (floorNum / width * height < percentToFill)
{
    cellArray[currWalker.posY][currWalker.posX].classList.add("floor");

    // Limit walker to 50 steps
    for (let j = 0; j < 50; j++)
    {
        if (currWalker.dir == 0 && currWalker.posY + 1 < height)
        {
            currWalker.posY++;
        }
        else if (currWalker.dir == 1 && currWalker.posX + 1 < width)
        {
            currWalker.posX++;
        }
        else if (currWalker.dir == 2 && currWalker.posY - 1 > 0)
        {
            currWalker.posY--;
        }
        else if (currWalker.dir == 3 && currWalker.posX - 1 > 0)
        {
            currWalker.posX--;
        }

        // Need these checks before moving pos
        // Mark move
        if (currWalker.posY > 0 && currWalker.posY < height && currWalker.posX > 0 && currWalker.posX < width)
            cellArray[currWalker.posY][currWalker.posX].classList.add("floor");

        // Roll to change
        if (Math.random() < chanceWalkerTurn)
        {
            // Pick new direction
            currWalker.dir = getRandomDir();
        }
    }
}

function getRandomDir() {
    return Math.floor(Math.random() * 4);
  }
