import { state, PIECES, board,  } from './board.js';
import { isKingInCheck,} from './rules.js';
import { shakeElement,} from './UI.js';
import { showLegalMoves } from './simulateMoves.js';

// Renders the chess board and pieces based on the current state
export function renderBoard() {
    board.innerHTML = '';

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {

            const cell = document.createElement('button');
            cell.className = 'square ' + ((r + c) % 2 ? 'light' : 'dark');
            cell.dataset.row = r;
            cell.dataset.col = c;

            const piece = state.board[r][c];

            if (piece) {
                const span = document.createElement('span');
                span.classList.add('piece');

                if (piece === piece.toLowerCase()) {
                    span.classList.add('white-piece');

                } else {
                    span.classList.remove('black-piece');

                }

                span.textContent = PIECES[piece];
                cell.appendChild(span);

                if (piece.toLowerCase() === 'k') {
                    const color = piece === 'k' ? 'white' : 'black';

                    if (isKingInCheck(color)) {

                        if (!state.checkSoundPlayed) {
                            state.checkSoundPlayed = true;

                            const audio = new Audio('/Sounds.mp3/Jumpscare Sound Effect.mp3');
                            audio.volume = 0.5;
                            audio.currentTime = 0.5;
                            audio.play();
                        }

                        cell.classList.add('in-check');
                        shakeElement(cell);

                        span.classList.add('king-glow');
                    } else {
                        state.checkSoundPlayed = false;
                        cell.classList.remove('in-check');
                        span.classList.remove('king-glow');
                    }
                }
            }

            cell.addEventListener('click', () => {
                showLegalMoves(r, c);
            });

            board.appendChild(cell);
        }
    }

}
    

