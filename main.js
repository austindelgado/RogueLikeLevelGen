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
let walkerTurnChance = .25;
let walkerSpawnChance = .05;
let walkerDeleteChance = .05;
let percentToFill = 0.5;
let floorNum;

let walkers = [];
// Spawn starting walkers
for (let i = 0; i < startingWalkers; i++)
    walkers.push(new Walker(startingX, startingY));

while (floorNum / width * height < percentToFill)
{
    //Add floors
    arrays.foreach ((currWalker) => {
        if (cellArray[currWalker.posY][currWalker.posX].classList.contains("floor"))
        {
            cellArray[currWalker.posY][currWalker.posX].classList.add("floor");
            floorNum++;
        }
    });

    // Chance to add walkers
    arrays.foreach ((currWalker) => {
        if (Math.random() < walkerSpawnChance)
        {
            walkers.push(new Walker(currWalker.posX, currWalker.posY));
            // Maybe limit this?
        }
    });

    // Chance to destory walkers
    arrays.foreach ((currWalker) => {
        if (Math.random() < walkerDeleteChance)
        {
            walkers.splice(walker.indexOf(currWalker));
        }
    });

    // Chance to turn
    arrays.foreach ((currWalker) => {
        if (Math.random() < walkerTurnChance)
        {
            currWalker.dir = getRandomDir();
        }
    });

    // Move walkers
    arrays.foreach ((currWalker) => {
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
    });
}

function getRandomDir() {
    return Math.floor(Math.random() * 4);
  }
