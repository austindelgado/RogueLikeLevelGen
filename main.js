const grid = document.getElementById('grid');
const main = document.getElementById('main');
const nav = document.getElementById('navbar');

// Please organize and clean up all X and Y
function Walker(x, y, dir) {
    this.posX = x;
    this.posY = y;
    this.dir = dir;
}

// Find a way to handle dynamic resizing
let height = Math.floor(main.clientHeight / 24.25);
let width = Math.floor(main.clientWidth / 24.25);

// Create grid based off screen size
let gridCells // Used for actual grid object
let board // Used to track state

function BoardSetup(height, width)
{
    gridCells = new Array(height);
    board = new Array(height);

    for (let y = 0; y < height; y++)
    {
        // New table row
        let row = document.createElement('tr');
        gridCells[y] = new Array(width);
        board[y] = new Array(width);
    
        for (let x = 0; x < width; x++)
        {
            board[y][x] = 0;

            // New col in row
            let id = y * width + x;
            let cell = document.createElement('td');
            cell.id = id;
    
            row.appendChild(cell);
            gridCells[y][x] = cell;
        }
        grid.appendChild(row);
    }
}

// Store moves at each step for animating
let moves = [];

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
let noTurnChance;

//Size
let bigRoomChance;
let maxFloor;
let floorNum = 0;

// Theme
let theme;

const timer = ms => new Promise(res => setTimeout(res, ms))

function WalkerSetup() 
{
    // Spawn starting walkers
    for (let i = 0; i < startingWalkers; i++)
    {
        newWalker = new Walker(startingX, startingY, Math.floor(Math.random() * 4));
        walkers.push(newWalker);
    }
}

function Move(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type; // floor, wall, walker, chest, ammo, rad
}

function FloorGen()
{
    let chestX, chestY, chestMax;
    chestX = chestY = chestMax = 0;
    let ammoX, ammoY, ammoMax;
    ammoX = ammoY = ammoMax = 0;
    let radX, radY, radMax;
    radX = radY = radMax = 0;

    steps = 0;
    while (floorNum < maxFloor)
    {
        if (steps > 1000)
        {
            console.warn("Max steps reached!");
            break;
        }

        let move = [] // Moves for this loop

        //Add floors
        walkers.forEach ((currWalker) => {
            move.push(new Move(currWalker.posX, currWalker.posY, 'walker'));

            if (board[currWalker.posY][currWalker.posX] == 0)
            {
                if (Math.random() * 100 < bigRoomChance)
                {
                    board[currWalker.posY][currWalker.posX] = 1;
                    move.push(new Move(currWalker.posX, currWalker.posY, 'floor'));
                    floorNum++;

                    if (currWalker.posY + 1 < height - 1) 
                    {
                        board[currWalker.posY + 1][currWalker.posX] = 1;
                        move.push(new Move(currWalker.posX + 1, currWalker.posY, 'floor'));
                        floorNum++;
                    }
                    
                    if (currWalker.posX + 1 < width - 1)
                    {
                        board[currWalker.posY][currWalker.posX + 1] = 1;
                        move.push(new Move(currWalker.posX, currWalker.posY + 1, 'floor'));
                        floorNum++;
                    }
                    
                    if (currWalker.posX + 1 < width - 1 && currWalker.posY + 1 < height - 1)
                    {
                        board[currWalker.posY + 1][currWalker.posX + 1] = 1;
                        move.push(new Move(currWalker.posX + 1, currWalker.posY + 1, 'floor'));
                        floorNum++;
                    }
                }
                else
                {
                    board[currWalker.posY][currWalker.posX] = 1;
                    move.push(new Move(currWalker.posX, currWalker.posY, 'floor'));
                    floorNum++;
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
            if ((walkers.length / maxWalkers) * Math.random() * 100 < walkerSpawnChance && walkers.length < maxWalkers)
            {
                walkers.push(new Walker(currWalker.posX, currWalker.posY, Math.floor(Math.random() * 4)));
            }
        });
        
        // Chance to destroy walkers
        if ((maxWalkers / walkers.length) * Math.random() * 100 < walkerDeleteChance && walkers.length > 1)
        {
            currWalker = walkers[Math.floor(Math.random() * walkers.length)]
            walkers.splice(walkers.indexOf(currWalker, 1));

            // Spawn ammo
            newAmmo = GetDistance(startingX, startingY, currWalker.posX, currWalker.posY);
            if (newAmmo > ammoMax && currWalker.posX != chestX && currWalker.posX != chestY && currWalker.posX != radX && currWalker.posY != radY)
            {
                ammoMax = newAmmo;
                ammoX = currWalker.posX;
                ammoY = currWalker.posY;
            }
        }
    
        // Chance to turn
        walkers.forEach ((currWalker) => {
            const rng = Math.random() * 100;

            // Find a better way maybe?
            if (0 < rng && rng < leftTurnChance)
            {
                currWalker.dir--;
            }
            else if (leftTurnChance < rng && rng < rightTurnChance + leftTurnChance)
            {
                currWalker.dir++;
            }
            else if (rightTurnChance + leftTurnChance < rng && rng < uTurnChance + leftTurnChance + rightTurnChance)
            {
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
        });

        steps++;
        moves.push(move);
    }

    // if (chestX != 0 || chestY != 0)
    //     SpawnObject(chestX, chestY, 0);

    // if (ammoX != 0 || ammoY != 0)
    //     SpawnObject(ammoX, ammoY, 1);

    // if (radX != 0 || radY != 0)
    //     SpawnObject(radX, radY, 2);
}

function SpawnObject(x, y, obj) 
{
    // 0 - Chest
    if (obj == 0)
    {
        gridCells[y][x].classList.add('chest');
        gridCells[y][x].innerHTML = '';
    }
    else if (obj == 1)
    {
        gridCells[y][x].classList.add('ammo');
        gridCells[y][x].innerHTML = '';
    }
    else if (obj == 2)
    {
        gridCells[y][x].classList.add('rad');
        gridCells[y][x].innerHTML = '';
    }
}

// Potentially change to a flood fill
function WallGen()
{
    for (let y = 0; y < height; y++)
    {
        for (let x = 0; x < width; x++)
        {
            move = [];
            if (board[y][x] == 1)
            {
                if (y + 1 < height && !board[y + 1][x] == 1)
                {
                    board[y + 1][x] = 2;
                    move.push(new Move(x, y + 1, 'wall'));
                }
                if (x + 1 < width && !board[y][x + 1] == 1)
                {
                    board[y][x + 1] = 2;
                    move.push(new Move(x + 1, y, 'wall'));
                }
                if (y - 1 > -1 && !board[y - 1][x] == 1)
                {
                    board[y - 1][x] = 2;
                    move.push(new Move(x, y - 1, 'wall'));
                }
                if (x - 1 > -1 && !board[y][x - 1] == 1)
                {
                    board[y][x - 1] = 2;
                    move.push(new Move(x - 1, y, 'wall'));
                }
            }
            if (move.length != 0)
                moves.push(move);
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
            gridCells[y][x].className = '';
            board[y][x] = 0;
        }
    }

    floorNum = 0;
    walkers = [];
    moves = [];

    for (var i=0; i < timeouts.length; i++) 
        clearTimeout(timeouts[i]);
}

var timeouts = []; // Used to store timeouts
function DrawMap()
{
    timeoutTime = animationSpeed * 1000; // Scale this based off user input

    prevWalker = []
    walls = false;
    moves.forEach((move) => {
        // Check if we're doing walls to speed it up
        if (!walls && move[0].type == 'wall')
            walls = true;

        // Apply each step in the move
        timeouts.push(setTimeout(() => {
            prevWalker.forEach((action) => {
                gridCells[action.y][action.x].classList.remove("walker");
            })
            
            move.forEach((action) => {
                if (action.type == 'floor')
                {
                    gridCells[action.y][action.x].classList.add("floor", `${theme}Floor`);
                }
                else if (action.type == 'wall')
                {
                    gridCells[action.y][action.x].classList.add("wall", `${theme}Wall`);
                }
                else if (action.type == 'walker')
                {
                    gridCells[action.y][action.x].classList.add("walker");
                    prevWalker.push(action);
                }

                // Change to switch and add chest, ammo, rad
            });
        }, timeoutTime));

        if (walls)
            timeoutTime += animationSpeed * 250;
        else
            timeoutTime += animationSpeed * 1000;

        prevWalker = [];
    });

    // for (let y = 0; y < height; y++)
    // {
    //     for (let x = 0; x < width; x++)
    //     {
    //         if (board[y][x] == 1)
    //             gridCells[y][x].classList.add("floor", `${theme}Floor`);
    //         else if (board[y][x] == 2)
    //             gridCells[y][x].classList.add("wall", `${theme}Wall`);
    //     }
    // }
}

function GrabValues()
{
    // Walkers
    startingWalkers = document.getElementById('startWalkers').value;
    maxWalkers = document.getElementById('maxWalkers').value;
    walkerSpawnChance = parseFloat(document.getElementById('spawnRange').value);
    walkerDeleteChance = parseFloat(document.getElementById('deleteRange').value);

    // Turn
    leftTurnChance = parseFloat(document.getElementById('leftRange').value);
    rightTurnChance = parseFloat(document.getElementById('rightRange').value);
    uTurnChance = parseFloat(document.getElementById('uTurnRange').value);
    noTurnChance = parseFloat(document.getElementById('noTurnRange').value);

    // Size
    bigRoomChance = parseFloat(document.getElementById('bigRoomRange').value);
    maxFloor = document.getElementById('maxFloor').value;

    // Theme
    GetTheme();

    // Animation
    animationSpeed = parseFloat(document.getElementById('animationRange').value);

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
    DrawMap();
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

window.onclick = function(event)
{
    if (!event.target.matches(['.dropbtn', '.dropdown-content',])) 
    {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
          var openDropdown = dropdowns[i];
          if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
            openDropdown.previousElementSibling.classList.remove('show');
          }
        }
        activeDrop = undefined; 
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
DrawMap();

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


document.getElementById('leftRange').addEventListener('input', updateValue);
document.getElementById('rightRange').addEventListener('input', updateValue);
document.getElementById('uTurnRange').addEventListener('input', updateValue);
document.getElementById('noTurnRange').addEventListener('input', updateValue);

function updateValue (e) {
    var sibling = e.target.previousElementSibling || e.target.nextElementSibling;
    sibling.value = e.target.value;

    leftTurnChance = parseFloat(document.getElementById('leftRange').value);
    rightTurnChance = parseFloat(document.getElementById('rightRange').value);
    uTurnChance = parseFloat(document.getElementById('uTurnRange').value);
    noTurnChance = parseFloat(document.getElementById('noTurnRange').value);

    if (leftTurnChance + rightTurnChance + uTurnChance + noTurnChance != 100)
    {
        if (noTurnChance >= 0)
        {
            noTurnChance = 100 - (leftTurnChance + rightTurnChance + uTurnChance);
            if (noTurnChance < 0)
                noTurnChance = 0                

            document.getElementById('noTurnRange').value = noTurnChance;
            document.getElementById('noTurnRange').onchange();
        }

        if (uTurnChance >= 0)
        {
            uTurnChance = 100 - (leftTurnChance + rightTurnChance + noTurnChance);
            if (uTurnChance < 0)
                uTurnChance = 0

            document.getElementById('uTurnRange').value = uTurnChance;
            document.getElementById('uTurnRange').onchange();
        }

        if (rightTurnChance >= 0)
        {
            rightTurnChance = 100 - (leftTurnChance + uTurnChance + noTurnChance);
            if (rightTurnChance < 0)
                rightTurnChance = 0

            document.getElementById('rightRange').value = rightTurnChance;
            document.getElementById('rightRange').onchange();
        }

        if (leftTurnChance >= 0)
        {
            leftTurnChance = 100 - (uTurnChance + rightTurnChance + noTurnChance);
            if (leftTurnChance < 0)
                leftTurnChance = 0
                
            document.getElementById('leftRange').value = leftTurnChance;
            document.getElementById('leftRange').onchange();
        }
    }
}