// Find a way to handle dynamic resizing
let height = Math.floor(document.documentElement.scrollHeight / 30);
let width = Math.floor(document.documentElement.scrollWidth / 25);

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
let startingWalkers;
let maxWalkers;
let walkerTurnChance;
let walkerSpawnChance;
let walkerDeleteChance;
let maxFloor;
let floorNum = 0;

let walkers = [];

function WalkerSetup() 
{
    // Spawn starting walkers
    for (let i = 0; i < startingWalkers; i++)
        walkers.push(new Walker(startingX, startingY, getRandomDir()));
}

function FloorGen()
{
    while (floorNum < maxFloor)
    {
        //Add floors
        walkers.forEach ((currWalker) => {
            if (!cellArray[currWalker.posY][currWalker.posX].classList.contains("floor"))
            {
                cellArray[currWalker.posY][currWalker.posX].classList.add("floor");
                floorNum++;
                console.log("Adding floor");
            }
        });
    
        // Chance to add walkers
        walkers.forEach ((currWalker) => {
            if (Math.random() < walkerSpawnChance)
            {
                walkers.push(new Walker(currWalker.posX, currWalker.posY));
                console.log("New walker");
                // Maybe limit this?
            }
        });
    
        // Chance to destory walkers
        walkers.forEach ((currWalker) => {
            if (Math.random() < walkerDeleteChance && walkers.length > 1)
            {
                walkers.splice(walkers.indexOf(currWalker, 1));
                console.log("Deleting walker");
                console.log(walkers);
            }
        });
    
        // Chance to turn
        walkers.forEach ((currWalker) => {
            if (Math.random() < walkerTurnChance)
            {
                currWalker.dir = getRandomDir();
                console.log("Walker turning");
            }
        });
    
        // Move walkers
        walkers.forEach ((currWalker) => {
            if (currWalker.dir == 0 && currWalker.posY + 1 < height) 
            {
                currWalker.posY++;
            }
            else if (currWalker.dir == 1 && currWalker.posX + 1 < width)
            {
                currWalker.posX++;
            }
            else if (currWalker.dir == 2 && currWalker.posY - 1 > -1)
            {
                currWalker.posY--;
            }
            else if (currWalker.dir == 3 && currWalker.posX - 1 > -1)
            {
                currWalker.posX--;
            }
            console.log("Walker moving");
        });
    }
}

// Potentially change to a flood fill
function WallGen()
{
    for (let y = 0; y < height; y++)
    {
        for (let x = 0; x < width; x++)
        {
            if (!cellArray[y][x].classList.contains("floor"))
            {
                cellArray[y][x].classList.add("wall");
            }
        }
    }
}

function ClearLevel()
{
    // Remove all tiles
    for (let y = 0; y < height; y++)
    {
        for (let x = 0; x < width; x++)
        {
            cellArray[y][x].className = '';
        }
    }

    floorNum = 0;
    walkers = [];
}

function GrabValues()
{
    startingWalkers = document.getElementById('startWalkers').value;
    maxWalkers = document.getElementById('maxWalkers').value;
    walkerTurnChance = document.getElementById('turnChance').value;
    walkerSpawnChance = document.getElementById('spawnChance').value;
    walkerDeleteChance = document.getElementById('deleteChance').value;
    maxFloor = document.getElementById('maxFloor').value;

    if (maxFloor > height * width)
        maxFloor = height * width;
}

function GenerateNewLevel()
{
    ClearLevel();
    
    GrabValues();
    WalkerSetup();
    FloorGen();
    WallGen();
}

function getRandomDir() 
{
    return Math.floor(Math.random() * 4);
}

GrabValues();
WalkerSetup();
FloorGen();
WallGen();

// Grab button? Probably a better way to do this
document.getElementById("generate").onclick = GenerateNewLevel;