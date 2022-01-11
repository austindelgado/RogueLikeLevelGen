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
        cell.addEventListener('click', () => {cell.classList.add("floor")})

        row.appendChild(cell);
    }
    grid.appendChild(row);
}