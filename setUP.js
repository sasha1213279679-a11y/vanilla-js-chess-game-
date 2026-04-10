// This file handles the setup of the chess game, including player name input, time control selection, and starting the game.

const startBtn = document.getElementById('startBtn');
const setupMusic = document.getElementById('setupMusic');

document.addEventListener('click', function startMusicOnce() {
  setupMusic.volume = 0.35;
  setupMusic.play().catch(() => {});
}, { once: true });

startBtn.addEventListener('click', () => {
  const player1 = document.getElementById('player1').value.trim();
  const player2 = document.getElementById('player2').value.trim();
  const time = document.getElementById('time').value;

  if (!player1 || !player2) {
    alert('Please enter names for both players!');
    return;
  }

  sessionStorage.setItem('player1', player1);
  sessionStorage.setItem('player2', player2);
  sessionStorage.setItem('gameTime', time);

  startBtn.classList.add('pressed');

  setTimeout(() => {
    window.location.href = 'chess.html';
  }, 350);
});