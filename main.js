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

// Walker variables
let posY = Math.round(height / 2);
let posX = Math.round(width / 2);
const numWalkers = 1;
let dir = 1; // Direction test, should make a walker object
const chanceWalkerTurn = .25;

for (let i = 0; i < numWalkers; i++)
{
    // Starting walker pos
    cellArray[posY][posX].classList.add("floor");

    // Limit walker to 50 steps
    for (let j = 0; j < 50; j++)
    {
        if (dir == 0)
        {
            posY++
        }
        else if (dir == 1)
        {
            posX++;
        }
        else if (dir == 2)
        {
            posY--;
        }
        else // Dir == 3
        {
            posX--;
        }

        // Mark move
        cellArray[posY][posX].classList.add("floor");

        // Roll to change
        if (Math.random() < chanceWalkerTurn)
        {
            // Pick new direction
            dir = getRandomInt(3);
        }
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
