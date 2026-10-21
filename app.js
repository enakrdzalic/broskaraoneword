let words = [];
let currentIndex = 0;
let isPlaying = false;
let intervalId = null;
let wpm = 250;

async function loadBook() {
    try {
        const response = await fetch('brothers-karamazov.txt');
        const text = await response.text();
        
        const startMarker = "Part I";
        const startIndex = text.indexOf(startMarker);
        const bookText = startIndex !== -1 ? text.substring(startIndex) : text;
        
        words = bookText
            .replace(/[\r\n]+/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 0);
        
        console.log(`Loaded ${words.length} words`);
        
        const savedPosition = localStorage.getItem('karamazovPosition');
        if (savedPosition) {
            currentIndex = parseInt(savedPosition);
        }
        
        displayCurrentWord();
    } catch (error) {
        console.error('Error loading book:', error);
        document.getElementById('wordDisplay').textContent = 'Error loading book';
    }
}

function displayCurrentWord() {
    if (currentIndex < words.length) {
        document.getElementById('wordDisplay').textContent = words[currentIndex];
        document.getElementById('wordCounter').textContent = currentIndex + 1;
        localStorage.setItem('karamazovPosition', currentIndex);
    } else {
        pause();
        document.getElementById('wordDisplay').textContent = '[ END ]';
    }
}

function play() {
    if (words.length === 0) return;
    
    isPlaying = true;
    document.getElementById('playPause').textContent = '⏸ Pause';
    
    const interval = 60000 / wpm;
    
    intervalId = setInterval(() => {
        currentIndex++;
        displayCurrentWord();
        
        if (currentIndex >= words.length) {
            pause();
        }
    }, interval);
}

function pause() {
    isPlaying = false;
    document.getElementById('playPause').textContent = '▶ Play';
    
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
}

function togglePlayPause() {
    if (isPlaying) {
        pause();
    } else {
        play();
    }
}

function changeSpeed(delta) {
    wpm = Math.max(50, Math.min(600, wpm + delta));
    document.getElementById('wpm').textContent = wpm;
    
    if (isPlaying) {
        pause();
        play();
    }
}

function jumpToWord() {
    const input = document.getElementById('jumpInput');
    const wordNumber = parseInt(input.value);
    
    if (wordNumber >= 1 && wordNumber <= words.length) {
        currentIndex = wordNumber - 1;
        displayCurrentWord();
        input.value = '';
    }
}

function drawPixelArt() {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 150;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#e8dcc8';
    ctx.fillRect(0, 0, 600, 150);
    
    const pixelSize = 3;
    
    function drawPixel(x, y, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
    }
    
    const brown = '#8B4513';
    const skin = '#FDBCB4';
    const darkBrown = '#654321';
    const black = '#000000';
    const white = '#FFFFFF';
    const gray = '#808080';
    
    function drawFigure(startX, startY, hairColor, beardColor) {
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                drawPixel(startX + x, startY + y, hairColor);
            }
        }
        
        for (let y = 2; y < 7; y++) {
            for (let x = 1; x < 7; x++) {
                drawPixel(startX + x, startY + y, skin);
            }
        }
        
        drawPixel(startX + 2, startY + 3, black);
        drawPixel(startX + 5, startY + 3, black);
        
        for (let x = 2; x < 6; x++) {
            drawPixel(startX + x, startY + 5, beardColor);
        }
        
        for (let y = 8; y < 16; y++) {
            for (let x = 1; x < 7; x++) {
                drawPixel(startX + x, startY + y, gray);
            }
        }
        
        for (let y = 16; y < 22; y++) {
            drawPixel(startX + 1, startY + y, gray);
            drawPixel(startX + 2, startY + y, gray);
            drawPixel(startX + 5, startY + y, gray);
            drawPixel(startX + 6, startY + y, gray);
        }
    }
    
    drawFigure(60, 20, darkBrown, darkBrown);
    
    drawFigure(95, 20, brown, brown);
    
    drawFigure(130, 20, '#D2691E', '#8B4513');
    
    ctx.fillStyle = '#333';
    ctx.font = 'bold 12px "Courier New"';
    ctx.fillText('DMITRI', 52, 100);
    ctx.fillText('IVAN', 92, 100);
    ctx.fillText('ALYOSHA', 118, 100);
    
    document.getElementById('pixelArt').appendChild(canvas);
}

document.getElementById('playPause').addEventListener('click', togglePlayPause);
document.getElementById('slower').addEventListener('click', () => changeSpeed(-25));
document.getElementById('faster').addEventListener('click', () => changeSpeed(25));
document.getElementById('jumpBtn').addEventListener('click', jumpToWord);

document.getElementById('jumpInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        jumpToWord();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
    } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        changeSpeed(25);
    } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        changeSpeed(-25);
    }
});

drawPixelArt();
loadBook();
