document.addEventListener('DOMContentLoaded', () => {
    const puzzleContainer = document.getElementById('puzzle-container');
    const playGameBtn = document.getElementById('play-game-btn');
    const puzzleSizeSelect = document.getElementById('puzzle-size');
    const buttonContainer = document.getElementById('button-container');

    let puzzleSize = 4; // Default puzzle size
    let tiles = [];
    let emptyIndex = puzzleSize * puzzleSize - 1; // Index for the empty space

    // Function to change puzzle size
    const changePuzzleSize = () => {
        puzzleSize = parseInt(puzzleSizeSelect.value);
        emptyIndex = puzzleSize * puzzleSize - 1; // Update empty index
        createTiles();
    };

    // Function to shuffle the array
    const shuffleArray = array => {
        for (let i = array.length - 2; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    };

    // Function to check if the puzzle is solvable
    const isSolvable = arr => {
        let inversionCount = 0;

        for (let i = 0; i < puzzleSize * puzzleSize - 1; i++) {
            for (let j = i + 1; j < puzzleSize * puzzleSize; j++) {
                if (arr[j] && arr[i] && arr[i] > arr[j]) {
                    inversionCount++;
                }
            }
        }

        // Check if the inversion count is even for a solvable puzzle
        return inversionCount % 2 === 0;
    };

    // Function to create initial tiles with solvability check
    const createTiles = () => {
        do {
            tiles = Array.from({ length: puzzleSize * puzzleSize }, (_, i) => i);
            shuffleArray(tiles);
        } while (!isSolvable(tiles));

        updateTiles();
        buttonContainer.style.display = 'none'; // Hide the button container
    };

    // Function to handle tile click
    const handleTileClick = index => {
        if (isMovable(index)) {
            // Move the empty space into the number tile
            tiles[emptyIndex] = tiles[index];
            tiles[index] = puzzleSize * puzzleSize - 1; // Set the current index to the empty space
            emptyIndex = index;
            updateTiles();
        }
    };

    // Function to check if a tile is movable
    const isMovable = index => {
        const row = Math.floor(index / puzzleSize);
        const emptyRow = Math.floor(emptyIndex / puzzleSize);
        const isAdjacentRow = row === emptyRow && Math.abs(index - emptyIndex) === 1;
        const isAdjacentColumn = Math.abs(row - emptyRow) === 1 && index % puzzleSize === emptyIndex % puzzleSize;
        return isAdjacentRow || isAdjacentColumn;
    };

    // Function to update the tiles display
    const updateTiles = () => {
        puzzleContainer.innerHTML = '';

        for (let i = 0; i < tiles.length; i++) {
            const tileIndex = tiles[i];
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.textContent = tileIndex === puzzleSize * puzzleSize - 1 ? '' : tileIndex + 1;
            tile.addEventListener('click', () => handleTileClick(i));

            if (tileIndex === i) {
                tile.classList.add('in-right-area');
            }

            if (tileIndex === puzzleSize * puzzleSize - 1) {
                tile.classList.add('empty');
            }

            puzzleContainer.appendChild(tile);
        }

        // Set the grid template columns based on the puzzle size
        puzzleContainer.style.gridTemplateColumns = `repeat(${puzzleSize}, 1fr)`;
    };

    // Add event listeners
    playGameBtn.addEventListener('click', createTiles);
    puzzleSizeSelect.addEventListener('change', changePuzzleSize);
});
