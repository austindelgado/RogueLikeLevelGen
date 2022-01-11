// Find a way to handle dynamic resizing
let height = Math.floor(window.screen.availHeight / 30);
let width = Math.floor(window.screen.availWidth / 25);

const grid = document.getElementById('grid');

// Create grid based off screen size
for (let y = 0; y < height; y++)
{
    // New table row
    let row = document.createElement('tr');

    for (let x = 0; x < width; x++)
    {
        // New col in row
        let id = y * width + x;
        let cell = document.createElement('td');
        cell.id = id;

        row.appendChild(cell);
    }
    grid.appendChild(row);
}

// Probably better to create an actual 2D array of the elements, rather than this id system
for (let x = 0; x < width; x++)
{
    let y = 10;
    let cell = document.getElementById((y-1) * width + x);
    cell.classList.add("wall");

    cell = document.getElementById(y * width + x);
    cell.classList.add("floor");

    cell = document.getElementById((y+1) * width + x);
    cell.classList.add("wall");
}