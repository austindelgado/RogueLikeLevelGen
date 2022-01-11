// Find a way to handle dynamic resizing
let height = Math.floor((document.documentElement.scrollHeight));
let width = Math.floor(document.documentElement.scrollWidth);

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
        let id = x*width + y;
        currentHTMLRow += `<td id=${id} >${id}</td>`;
    }
    tableHTML += `${currentHTMLRow}</tr>`;
}

grid.innerHTML = tableHTML;

for (let i = 0; i < width; i++)
{

}