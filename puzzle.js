document.addEventListener('DOMContentLoaded', () => {
    const puzzleContainer = document.getElementById('puzzle-container');
    const playGameBtn = document.getElementById('play-game-btn');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const puzzleSizeSelect = document.getElementById('puzzle-size');
    const buttonContainer = document.getElementById('button-container');
    const moveCountElement = document.getElementById('moveCount');
    const bgMusic = document.getElementById('bgMusic');
    
    const imageUrl = 'images/background.png';

    document.body.style.backgroundImage = `url('${imageUrl}')`;    
    const cheatBtn = document.getElementById('cheat-btn');

    let puzzleSize = 4;
    let tiles = [];
    let emptyIndex = puzzleSize * puzzleSize - 1;
    let moveCount = 0;
    let timer;
    let startTime;

    const displayResults = () => {
        const currentTime = new Date().getTime();
        const elapsedTime = Math.floor((currentTime - startTime) / 1000);
        alert(`Congratulations! You finished the puzzle in ${elapsedTime} seconds and ${moveCount} moves.`);
    };

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

        // Show the button container
        buttonContainer.style.display = 'block';
        shuffleBtn.style.display = 'inline-block';
        startTimer();
    };

const handleTileClick(index) {
    if (isMovable(index)) {
        tiles[emptyIndex] = tiles[index];
        tiles[index] = puzzleSize * puzzleSize - 1;
        emptyIndex = index;
        moveCount++;

        // Add a spin transition effect to move the tile
        const tileElement = document.querySelector(`.tile:nth-child(${index + 1})`);
        tileElement.style.transition = 'transform 0.5s ease-in-out';
        tileElement.style.transform = 'rotate(360deg)';

        setTimeout(() => {
            tileElement.style.transition = ''; // Clear the transition after animation
            tileElement.style.transform = '';
            updateTiles();

            if (checkWin()) {
                stopTimer();
                displayResults();
            }
        }, 500); // Adjust the timeout to match the transition duration
    }
}


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

            // Check if it's the empty tile
            if (tileIndex === puzzleSize * puzzleSize - 1) {
                tile.classList.add('empty');
            } else {
                const image = document.createElement('img');
                image.src = getImagePath(tileIndex + 1, puzzleSize);
                tile.appendChild(image);
            }

            tile.addEventListener('click', () => handleTileClick(i));

            if (tileIndex === i) {
                tile.classList.add('in-right-area');
            }

            puzzleContainer.appendChild(tile);
        }

        puzzleContainer.style.gridTemplateColumns = `repeat(${puzzleSize}, 1fr)`;
        moveCountElement.textContent = `Moves: ${moveCount}`;
    };

    const getImagePath = (number, size) => {
        return `images/${size}x${size}/${number}.jpg`;
    };    

    const startTimer = () => {
        startTime = new Date().getTime();
        timer = setInterval(updateTimer, 1000);
    };

    const updateTimer = () => {
        const currentTime = new Date().getTime();
        const elapsedTime = Math.floor((currentTime - startTime) / 1000);
        document.getElementById('timer').textContent = `Time: ${elapsedTime} seconds`;
    };

    const stopTimer = () => {
        clearInterval(timer);
    };

    const checkWin = () => {
        for (let i = 0; i < tiles.length - 1; i++) {
            if (tiles[i] !== i) {
                return false;
            }
        }
        return true;
    };

    const shuffleTiles = () => {
        if (!startTime) {
            // Game hasn't started yet, start the timer
            startTimer();
        }

        const tilesWithoutEmpty = tiles.filter(tile => tile !== puzzleSize * puzzleSize - 1);
        shuffleArray(tilesWithoutEmpty);

        let index = 0;
        for (let i = 0; i < tiles.length; i++) {
            if (tiles[i] !== puzzleSize * puzzleSize - 1) {
                tiles[i] = tilesWithoutEmpty[index];
                index++;
            }
        }

        updateTiles();
    };

    const cheat = () => {
        // Arrange tiles in solved order
        for (let i = 0; i < puzzleSize * puzzleSize - 1; i++) {
            tiles[i] = i;
        }
        emptyIndex = puzzleSize * puzzleSize - 1; // The last tile should be the empty one

        // Update UI to reflect the solved state
        updateTiles();

        // Stop the timer and display the results
        stopTimer();
        displayResults();
    };

    cheatBtn.addEventListener('click', cheat);

    playGameBtn.addEventListener('click', () => {
        createTiles();
        bgMusic.play();
        buttonContainer.style.display = 'none';
        shuffleBtn.style.display = 'inline-block';
    });

    shuffleBtn.addEventListener('click', shuffleTiles);
    puzzleSizeSelect.addEventListener('change', changePuzzleSize);
});

document.getElementById('bgMusic').addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);

