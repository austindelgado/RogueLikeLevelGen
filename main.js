const grid = document.getElementById('grid');

// Please organize and clean up all X and Y
function Walker(x, y, dir) {
    this.posX = x;
    this.posY = y;
    this.dir = dir;
}

// Find a way to handle dynamic resizing
let height = Math.floor((document.documentElement.clientHeight) / 28);
let width = Math.floor(document.documentElement.clientWidth / 25);

// Create grid based off screen size
let cellArray // Create 2d array for the grid, probably not best practice

function BoardSetup(height, width)
{
    cellArray = new Array(height);

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
}

// Walker
let walkers = [];
let startingY = Math.round(height / 2);
let startingX = Math.round(width / 2);
let startingWalkers;
let maxWalkers;
let walkerSpawnChance;
let walkerDeleteChance;

// Turn
let leftTurnChance;
let rightTurnChance;
let uTurnChance;

//Size
let bigRoomChance;
let maxFloor;
let floorNum = 0;

// Theme
let theme;

function WalkerSetup() 
{
    // Spawn starting walkers
    for (let i = 0; i < startingWalkers; i++)
        walkers.push(new Walker(startingX, startingY, Math.floor(Math.random() * 4)));
}

function FloorGen()
{
    let chestX, chestY, chestMax;
    chestX = chestY = chestMax = 0;
    let ammoX, ammoY, ammoMax;
    ammoX = ammoY = ammoMax = 0;
    let radX, radY, radMax;
    radX = radY = radMax = 0;

    while (floorNum < maxFloor)
    {
        //Add floors
        walkers.forEach ((currWalker) => {
            if (!cellArray[currWalker.posY][currWalker.posX].classList.contains("floor"))
            {
                if (Math.random() < bigRoomChance)
                {
                    cellArray[currWalker.posY][currWalker.posX].classList.add("floor", `${theme}Floor`);
                    floorNum++;

                    if (currWalker.posY + 1 < height - 1) 
                    {
                        cellArray[currWalker.posY + 1][currWalker.posX].classList.add("floor", `${theme}Floor`);
                        floorNum++;
                    }
                    
                    if (currWalker.posX + 1 < width - 1)
                    {
                        cellArray[currWalker.posY][currWalker.posX + 1].classList.add("floor", `${theme}Floor`);
                        floorNum++;
                    }
                    
                    if (currWalker.posX + 1 < width - 1 && currWalker.posY + 1 < height - 1)
                    {
                        cellArray[currWalker.posY + 1][currWalker.posX + 1].classList.add("floor", `${theme}Floor`);
                        floorNum++;
                    }

                    console.log("Adding 2x2 floor");
                }
                else
                {
                    cellArray[currWalker.posY][currWalker.posX].classList.add("floor", `${theme}Floor`);
                    floorNum++;
                    console.log("Adding floor");
                }
            }

            if (floorNum / maxFloor > .8)
            {
                // Check rad distance on last 10% of floor
                newRad = GetDistance(startingX, startingY, currWalker.posX, currWalker.posY);
                if (newRad > radMax && currWalker.posX != ammoX && currWalker.posX != ammoY && currWalker.posX != chestX && currWalker.posY != chestY)
                {
                    radMax = newRad;
                    radX = currWalker.posX;
                    radY = currWalker.posY;
                }
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

                // Spawn ammo
                newAmmo = GetDistance(startingX, startingY, currWalker.posX, currWalker.posY);
                if (newAmmo > ammoMax && currWalker.posX != chestX && currWalker.posX != chestY && currWalker.posX != radX && currWalker.posY != radY)
                {
                    ammoMax = newAmmo;
                    ammoX = currWalker.posX;
                    ammoY = currWalker.posY;
                }
            }
        });
    
        // Chance to turn
        walkers.forEach ((currWalker) => {
            const rng = Math.random();
            console.log(rng);

            if (0 < rng < leftTurnChance)
            {
                console.log("Walker left turn");
                currWalker.dir--;
            }
            else if (leftTurnChance < rng < rightTurnChance + leftTurnChance)
            {
                console.log("Walker right turn");
                currWalker.dir++;
            }
            else if (rightTurnChance + leftTurnChance < rng < uTurnChance + leftTurnChance + rightTurnChance)
            {
                console.log("Walker u turn");
                currWalker.dir += 2;

                // Check chest distance on u-turn
                newChest = GetDistance(startingX, startingY, currWalker.posX, currWalker.posY);
                if (newChest > chestMax && currWalker.posX != ammoX && currWalker.posX != ammoY && currWalker.posX != radX && currWalker.posY != radY)
                {
                    chestMax = newChest;
                    chestX = currWalker.posX;
                    chestY = currWalker.posY;
                }
            }

            if (currWalker.dir > 3)
                currWalker.dir -= 4;
            else if (currWalker.dir < 0)
                currWalker.dir += 4;
        });
    
        // Move walkers
        walkers.forEach ((currWalker) => {
            if (currWalker.dir == 0 && currWalker.posY + 1 < height - 1) 
            {
                currWalker.posY++;
            }
            else if (currWalker.dir == 1 && currWalker.posX + 1 < width - 1)
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
            console.log("Walker moving");
        });
    }

    if (chestX != 0 || chestY != 0)
        SpawnObject(chestX, chestY, 0);

    if (ammoX != 0 || ammoY != 0)
        SpawnObject(ammoX, ammoY, 1);

    if (radX != 0 || radY != 0)
        SpawnObject(radX, radY, 2);
}

function SpawnObject(x, y, obj) 
{
    console.log(`${x}, ${y}`);
    // 0 - Chest
    if (obj == 0)
    {
        console.log("Spawning Chest");
        cellArray[y][x].classList.add('chest');
    }
    else if (obj == 1)
    {
        console.log("Spawning Ammo");
        cellArray[y][x].classList.add('ammo');
    }
    else if (obj == 2)
    {
        console.log("Spawning Rad");
        cellArray[y][x].classList.add('rad');
    }
}

// Potentially change to a flood fill
function WallGen()
{
    for (let y = 0; y < height; y++)
    {
        for (let x = 0; x < width; x++)
        {
            if (cellArray[y][x].classList.contains("floor"))
            {
                if (y + 1 < height && !cellArray[y + 1][x].classList.contains("floor"))
                {
                    cellArray[y + 1][x].classList.add("wall", `${theme}Wall`);
                }
                if (x + 1 < width && !cellArray[y][x + 1].classList.contains("floor"))
                {
                    cellArray[y][x + 1].classList.add("wall", `${theme}Wall`);
                }
                if (y - 1 > -1 && !cellArray[y - 1][x].classList.contains("floor"))
                {
                    cellArray[y - 1][x].classList.add("wall", `${theme}Wall`);
                }
                if (x - 1 > -1 && !cellArray[y][x - 1].classList.contains("floor"))
                {
                    cellArray[y][x - 1].classList.add("wall", `${theme}Wall`);
                }
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
    // Walkers
    startingWalkers = document.getElementById('startWalkers').value;
    maxWalkers = document.getElementById('maxWalkers').value;
    walkerSpawnChance = parseFloat(document.getElementById('spawnChance').value);
    walkerDeleteChance = parseFloat(document.getElementById('deleteChance').value);

    // Turn
    leftTurnChance = parseFloat(document.getElementById('leftTurnChance').value);
    rightTurnChance = parseFloat(document.getElementById('rightTurnChance').value);
    uTurnChance = parseFloat(document.getElementById('uTurnChance').value);

    // Size
    bigRoomChance = parseFloat(document.getElementById('bigRoomChance').value);
    maxFloor = document.getElementById('maxFloor').value;

    // Theme
    GetTheme();
    // Animation

    if (maxFloor > height * width)
        maxFloor = height * width;
}

function GetTheme() {
    var options = document.getElementsByName('theme');
              
    for(i = 0; i < options.length; i++) {
        if(options[i].checked)
            theme = options[i].value;
    }
}

function ChangeTheme(newTheme)
{
    theme = newTheme;
    console.log(theme);

    // Change all floor and wall themes
    let floors = document.getElementsByClassName('floor');
    for (let i = 0; i < floors.length; i++)
    {
        if (floors[i].classList.contains('chest') || floors[i].classList.contains('rad') || floors[i].classList.contains('ammo'))
            continue;

        floors[i].className = `floor ${theme}Floor`;
    }

    let walls = document.getElementsByClassName('wall');
    for (let i = 0; i < walls.length; i++)
    {
        walls[i].className = `wall ${theme}Wall`;
    }
}

function GetDistance(x1, y1, x2, y2)
{
    return Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2));
}

function GenerateNewLevel()
{
    ClearLevel();
    
    GrabValues();
    WalkerSetup();
    FloorGen();
    WallGen();
}

let activeDrop;

function Dropdown(obj, dropdown) 
{  
    obj.classList.toggle("show");
    document.getElementById(dropdown).classList.toggle("show");

    if (activeDrop == undefined)
        activeDrop = dropdown;
    else if (activeDrop == dropdown)
        activeDrop = undefined;
    else if (activeDrop != dropdown)
    {
        // Close previously open 
        document.getElementById(activeDrop).previousElementSibling.classList.toggle("show");
        document.getElementById(activeDrop).classList.toggle("show");
        activeDrop = dropdown;
    }
}

function ChangeStyle(selector, prop, value) {
    var style = document.styleSheets[0].cssRules || document.styleSheets[0].rules;
    for (var i = 0; i < style.length; i++) {
        if (style[i].selectorText == selector) {
        style[i].style[prop] = value;
        }
    }
}

BoardSetup(height, width);
GrabValues();
WalkerSetup();
FloorGen();
WallGen();

document.getElementById("generate").onclick = GenerateNewLevel;

// Generate new level on space bar press
document.addEventListener('keypress', (event) => {
    if (event.code == 'Space')
        GenerateNewLevel();
}, false);

// Get customFloor color
document.getElementById('floorPicker').addEventListener('change', UpdateFloorValue);
function UpdateFloorValue(input) {
  let customFloor = input.target.value;
  ChangeStyle('.customFloor', 'background-color', customFloor);
  ChangeStyle('#custom', 'background-color', customFloor);
}

// Get custom wall color
document.getElementById('wallPicker').addEventListener('change', UpdateWallValue);
function UpdateWallValue(input) {
  let customWall = input.target.value;
  ChangeStyle('.customWall', 'background-color', customWall);
  ChangeStyle('#custom', 'border', customWall);
  ChangeStyle('#custom', 'border-width', '15px');
  ChangeStyle('#custom', 'border-style', 'solid');
}