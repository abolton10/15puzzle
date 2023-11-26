document.addEventListener('DOMContentLoaded', () => {
    const puzzleContainer = document.getElementById('puzzle-container');
    let tiles = [];
    let emptyIndex = 15; // Index for the empty space

    // Shuffle the array
    const shuffleArray = array => {
        for (let i = array.length - 2; i > 0; i--) { // Only shuffle the first 15 elements
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    };

    // Create initial tiles
    const createTiles = () => {
        tiles = Array.from({ length: 16 }, (_, i) => i);
        shuffleArray(tiles);
        tiles.forEach(index => {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.textContent = index === 15 ? '' : index + 1; // Empty space for index 15
            tile.addEventListener('click', () => moveTile(index));
            puzzleContainer.appendChild(tile);
        });
    };

    // Move a tile
    const moveTile = index => {
        if (isMovable(index)) {
            [tiles[index], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[index]];
            emptyIndex = index;
            updateTiles();
        }
    };

    // Check if a tile is movable
    const isMovable = index => {
        // Check if the tile is next to the empty space
        const row = Math.floor(index / 4);
        const emptyRow = Math.floor(emptyIndex / 4);
        const isAdjacentRow = row === emptyRow && Math.abs(index - emptyIndex) === 1;
        const isAdjacentColumn = Math.abs(row - emptyRow) === 1 && index % 4 === emptyIndex % 4;
        return isAdjacentRow || isAdjacentColumn;
    };

    // Update the tiles display
    const updateTiles = () => {
        puzzleContainer.innerHTML = '';
        tiles.forEach((tileIndex, index) => {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.textContent = tileIndex === 15 ? '' : tileIndex + 1;
            tile.addEventListener('click', () => moveTile(index));
            puzzleContainer.appendChild(tile);
        });
    };

    createTiles();
});
