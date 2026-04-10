import { controlRound } from "./Chess.js"; 
import { state } from "./board.js";
// all variables 
const gameTim = sessionStorage.getItem('gameTime');
let whiteTime = gameTim * 60; 
let blackTime = gameTim * 60;
let timerInterval;
const player1 = sessionStorage.getItem('player1');
const player2 = sessionStorage.getItem('player2');
// checkmate UI
export function showCheckmateUI(color) {
    state.gameOver = true;

    const winnerColor = color === 'white' ? 'Black' : 'White';
    const loserColor = color === 'white' ? 'White' : 'Black';

    const winnerName = winnerColor === 'White' ? player1 : player2;
    const loserName = loserColor === 'White' ? player1 : player2;

    showGameOverUI({
        title: 'Checkmate!',
        winnerName,
        winnerColor,
        loserName,
        loserColor
    });
}
// general (for every case) game over UI
function showGameOverUI({ title, winnerName, winnerColor, loserName, loserColor, reason }) {
    const overlay = document.createElement("div");
    overlay.classList.add("game-over-overlay");

    overlay.innerHTML = `
        <div class="game-over-box">
            <div class="game-over-badge">♔</div>
            <h1>${title}</h1>
            <p class="winner-line">🏆 ${winnerName} (${winnerColor}) Wins!</p>
            <p class="loser-line">❌ ${loserName} (${loserColor}) Loses${reason ? ` - ${reason}` : ''}!</p>

            <div class="game-over-actions">
                <button class="again-btn" onclick="location.reload()">Play Again</button>
                <button class="settings-btn" onclick="window.location.href='SetUp.html'">Change Settings</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
}
// rotation of the board according to the player color
export function updateBoardRotation() {
    const board = document.getElementById('board');
    if (!board) return;

    if (controlRound === 'white') {
        board.classList.add('rotated');
    } else {
        board.classList.remove('rotated');
    }
}
// music functionality - play and stop music
export function toggleMusic() {
    const playButton = document.getElementById('playMusic');
    let audio = null;
    let stopButton = null;

    playButton.addEventListener('click', () => {
        if (!audio) {
            audio = new Audio('/Sounds.mp3/classic Music.mp3');
            audio.loop = true;
            audio.play();

            stopButton = document.createElement('button');
            stopButton.textContent = 'Stop Music';
            stopButton.style.background = 'red';
            stopButton.style.color = 'white';
            stopButton.style.marginLeft = '10px'; 
            stopButton.style.border = 'none';
            stopButton.style.padding = '10px';
            stopButton.style.borderRadius = '6px';
            stopButton.style.cursor = 'pointer';

            playButton.parentNode.insertBefore(stopButton, playButton.nextSibling);

            stopButton.addEventListener('click', () => {
                audio.pause();
                audio = null;
                stopButton.remove();
            });
        }
    });
}
// shake animation for the piece when it's in check
export function shakeElement(element, intensity = 10, duration = 500) {
    if (!element) return;

    const start = Date.now();

    const computedStyle = window.getComputedStyle(element);
    const originalTransform = computedStyle.transform === "none"
        ? ""
        : computedStyle.transform;

    function frame() {
        const elapsed = Date.now() - start;

        if (elapsed < duration) {
            const progress = elapsed / duration;
            const damping = 1 - progress;

            const x = (Math.random() - 0.5) * intensity * 2 * damping;
            const y = (Math.random() - 0.5) * intensity * 2 * damping;

            element.style.transform =
                `${originalTransform} translate(${x}px, ${y}px)`;

            requestAnimationFrame(frame);
        } else {
            element.style.transform = originalTransform;
        }
    }

    frame();
}
// timer functionality - start the timer and update the UI every second, also check for time over
export function startTimer() {
    document.getElementById('whiteTime-js').textContent = formatTime(whiteTime);
    document.getElementById('blackTime-js').textContent = formatTime(blackTime);

    timerInterval = setInterval(() => {
        if (controlRound === 'white') {
            whiteTime--;
            document.getElementById('whiteTime-js').textContent = formatTime(whiteTime);

            if (whiteTime <= 0) {
                clearInterval(timerInterval);
                showTimeOverUI('white');
                return;
            }
        } else {
            blackTime--;
            document.getElementById('blackTime-js').textContent = formatTime(blackTime);

            if (blackTime <= 0) {
                clearInterval(timerInterval);
                showTimeOverUI('black');
                return;
            }
        }
    }, 1000);
}
// helper function to format time in mm:ss format
function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
}
// when time is over, show the game over UI 
export function showTimeOverUI(expiredColor) {
    const winnerColor = expiredColor === 'white' ? 'Black' : 'White';
    const loserColor = expiredColor === 'white' ? 'White' : 'Black';

    const winnerName = winnerColor === 'White' ? player1 : player2;
    const loserName = loserColor === 'White' ? player1 : player2;

    showGameOverUI({
        title: 'Time Over!',
        winnerName,
        winnerColor,
        loserName,
        loserColor,
        reason: 'Time'
    });
}
// the board sound when the game starts
 export function gameStartSound() {
    const audio = document.getElementById('startGameSound-js');
if (audio) {
    audio.currentTime = 1;
    audio.play();

setTimeout(() => {
    audio.pause();
}, 1000); 
}
}
// stalemate UI
export function showIsStalemateUI() {
    state.gameOver = true;

    const overlay = document.createElement("div");
    overlay.classList.add("game-over-overlay");

    overlay.innerHTML = `
        <div class="game-over-box">
            <h1>Stalemate!</h1>
            <p>⚖️ It's a Draw!</p>
            <div class="game-over-buttons">
                <button class="again-btn">Play Again</button>
                <button class="settings-btn">Change Settings</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    overlay.querySelector('.again-btn').addEventListener('click', () => {
        location.reload();
    });

    overlay.querySelector('.settings-btn').addEventListener('click', () => {
        window.location.href = 'GameSetUp.html'; 
    });
}
            
// select a square on the board and add a highlight to it
export function selectSquare(r, c) {
                const oldSquare = document.querySelector('.square.selected');
                if (oldSquare) oldSquare.classList.remove('selected');
            
                const newSquare = document.querySelector(`.square[data-row='${r}'][data-col='${c}']`);
                if (newSquare) newSquare.classList.add('selected');
            }