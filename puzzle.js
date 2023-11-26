document.addEventListener('DOMContentLoaded', () => {
    const puzzleContainer = document.getElementById('puzzle-container');
    const playGameBtn = document.getElementById('play-game-btn');
    const puzzleSizeSelect = document.getElementById('puzzle-size');
    const buttonContainer = document.getElementById('button-container');

    let puzzleSize = 4;
    let tiles = [];
    let emptyIndex = puzzleSize * puzzleSize - 1;
    let moveCount = 0;

    const changePuzzleSize = () => {
        puzzleSize = parseInt(puzzleSizeSelect.value, 10);
        emptyIndex = puzzleSize * puzzleSize - 1;
        createTiles();
    };

    const shuffleArray = array => {
        for (let i = array.length - 2; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    };

    const isSolvable = arr => {
        let inversionCount = 0;

        for (let i = 0; i < puzzleSize * puzzleSize - 1; i++) {
            for (let j = i + 1; j < puzzleSize * puzzleSize; j++) {
                if (arr[j] && arr[i] && arr[i] > arr[j]) {
                    inversionCount++;
                }
            }
        }

        return inversionCount % 2 === 0;
    };

    const createTiles = () => {
        do {
            tiles = Array.from({ length: puzzleSize * puzzleSize }, (_, i) => i);
            shuffleArray(tiles);
        } while (!isSolvable(tiles));

        updateTiles();
        buttonContainer.style.display = 'none';
    };

    const handleTileClick = index => {
        if (isMovable(index)) {
            // Move the empty space into the number tile
            tiles[emptyIndex] = tiles[index];
            tiles[index] = puzzleSize * puzzleSize - 1; // Set the current index to the empty space
            emptyIndex = index;
            
            moveCount++; // Increment the move count before updating tiles
            updateTiles();
        }
    };    

    const isMovable = index => {
        const row = Math.floor(index / puzzleSize);
        const emptyRow = Math.floor(emptyIndex / puzzleSize);
        const isAdjacentRow = row === emptyRow && Math.abs(index - emptyIndex) === 1;
        const isAdjacentColumn = Math.abs(row - emptyRow) === 1 && index % puzzleSize === emptyIndex % puzzleSize;
        return isAdjacentRow || isAdjacentColumn;
    };

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

        puzzleContainer.style.gridTemplateColumns = `repeat(${puzzleSize}, 1fr)`;

        const moveCountElement = document.getElementById('moveCount');
        moveCountElement.textContent = `Moves: ${moveCount}`;
    };

    playGameBtn.addEventListener('click', createTiles);
    puzzleSizeSelect.addEventListener('change', changePuzzleSize);
});
