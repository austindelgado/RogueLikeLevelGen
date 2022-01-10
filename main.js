// Find a way to handle dynamic resizing
let height = Math.floor((document.body.scrollHeight) / 28);
let width = Math.floor(document.body.scrollWidth / 25);

let test = document.body.scrollHeight;

console.log(`height: ${height}, width: ${width}`);

const grid = document.getElementById('grid');

// Create grid based off screen size
let tableHTML = "";
for (let x = 0; x < height; x++)
{
    // New table row
    let currentHTMLRow = `<tr>`;

    for (let y = 0; y < width; y++)
    {
        // New col in row
        currentHTMLRow += `<td></td>`;
    }
    tableHTML += `${currentHTMLRow}</tr>`;
}

grid.innerHTML = tableHTML;