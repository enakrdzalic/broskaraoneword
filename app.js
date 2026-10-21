let words = [];
let currentIndex = 0;
let isPlaying = false;
let intervalId = null;
let wpm = 250;

async function loadBook() {
    try {
        const response = await fetch('brothers-karamazov.txt');
        const text = await response.text();
        
        const chapterStart = "Chapter I.\nFyodor Pavlovitch Karamazov";
        const startIndex = text.indexOf(chapterStart);
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

loadBook();
