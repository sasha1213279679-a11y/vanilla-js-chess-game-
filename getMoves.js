import { state } from './board.js';
import { MovesForAllPIECES } from './Chess.js';
import { renderBoard } from './renderBoard.js';
import { isSameColor, } from './rules.js';
import{ selectSquare } from './UI.js';



// Main function to the selected pieces and what pieces to move to on the board
export function getMoves() {
    const boardEl = document.getElementById('board');
    boardEl.addEventListener('click', e => {
        if (state.isPromotionOpen) return;
        if (state.gameOver) return;
        const square = e.target.closest('.square');
        if (!square) return;
    
        const r = Number(square.dataset.row);
        const c = Number(square.dataset.col);
        const moveToPeace = state.board[r][c];
        selectSquare(r, c);

        const oldSquare = document.querySelector('.square.selected');
        if (oldSquare) oldSquare.classList.remove('selected');
    
        if (!state.selectedPeace && moveToPeace) {
            state.selectedPeace = moveToPeace;
            state.selectedRow = r;
            state.selectedCol = c;
            square.classList.add('selected');
            return;
        }
    
        if (moveToPeace && isSameColor(state.selectedPeace, moveToPeace)) {
            state.selectedPeace = moveToPeace;
            state.selectedRow = r;
            state.selectedCol = c;
            square.classList.add('selected');
            return;
        }
    
        MovesForAllPIECES(
            state.selectedPeace,
            state.selectedRow,
            state.selectedCol,
            r,
            c,
            moveToPeace
        );
    
        state.selectedPeace = null;
        state.selectedRow = null;
        state.selectedCol = null;
        const success = MovesForAllPIECES(
            state.selectedPeace,
            state.selectedRow,
            state.selectedCol,
            r,
            c,
            moveToPeace
        );
        
        state.selectedPeace = null;
        state.selectedRow = null;
        state.selectedCol = null;
        
        if (success) {
            renderBoard();
        }
    })};
