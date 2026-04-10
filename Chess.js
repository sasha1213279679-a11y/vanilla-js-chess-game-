import {
    whiteQueenMoves,
    whiteKnightMoves,
    whitePawnMoves,
    whiteRockMoves,
    whiteBishopMoves,
    whiteKingMoves,
} from './whitePeacessMoves.js';

import {
    blackKingMoves,
    blackPawnMoves,
    blackQueenMoves,
    blackRockMoves,
    blackKnightMoves,
    blackBishopMoves,
} from './blackPeacessMoves.js';

import { renderBoard } from './renderBoard.js';
import { controlRounds, 
    checkPromotion
    ,isKingInCheck,
    isCheckmate,
    isStalemate,

 } from './rules.js';
import { state,getPieceName } from './board.js';
import { showCheckmateUI,
    updateBoardRotation,
    toggleMusic,
    startTimer,
    shakeElement,
    gameStartSound,
    showIsStalemateUI,
    
} from './UI.js';
import { getMoves } from './getMoves.js';

// all variables and functions related to moves for all pieces will be here
let moveSuccess = false;
export let controlRound = 'white';
const moveFunctions = {
    'P': blackPawnMoves,
    'R': blackRockMoves,
    'N': blackKnightMoves,
    'B': blackBishopMoves,
    'Q': blackQueenMoves,
    'K': blackKingMoves,
    'p': whitePawnMoves,
    'r': whiteRockMoves,
    'n': whiteKnightMoves,
    'b': whiteBishopMoves,
    'q': whiteQueenMoves,
    'k': whiteKingMoves
};

// Initialize the game
getMoves();
gameStartSound();
startTimer();
updateBoardRotation();
renderBoard();
toggleMusic();

// Get player names from sessionStorage and display them
const player1 = sessionStorage.getItem('player1');
const player2 = sessionStorage.getItem('player2');
document.getElementById('firstPlayer-js').textContent = `White Player Name: ${player1}`;
document.getElementById('secondPlayer-js').textContent = `Black Player Name: ${player2}`;



// Main function to handle moves for all pieces
export function MovesForAllPIECES(SelectedPeace, r, c, moveToR, moveToc, moveToPeace) {
    if(SelectedPeace===null||SelectedPeace===undefined) return false;
    let color = SelectedPeace === SelectedPeace.toUpperCase() ? 'black' : 'white'; 


    if (!SelectedPeace) return false;

    if (!controlRounds(SelectedPeace)) return false;
   
  

    const moveFunc = moveFunctions[SelectedPeace];
    if (!moveFunc) return false;

    const tempFrom = state.board[r][c];
    const tempTo = state.board[moveToR][moveToc];

    moveSuccess = moveFunc(SelectedPeace, r, c, moveToR, moveToc, moveToPeace);
    if (!moveSuccess) {
        document.querySelectorAll('.dot').forEach(dot => dot.remove());
const audio=document.createElement('audio')
audio.src="wrong move chess sound.mp3";
audio.volume=0.5;

audio.play();
        const fromCell = document.querySelector(
            `.square[data-row="${r}"][data-col="${c}"]`
        );
        const pieceElement = fromCell?.querySelector('.piece');
    
        shakeElement(pieceElement);
    
        const targetCell = document.querySelector(
            `.square[data-row="${moveToR}"][data-col="${moveToc}"]`
        );
    
        if (targetCell) {
            targetCell.classList.add('invalid-move');
    
            setTimeout(() => {
                targetCell.classList.remove('invalid-move');
            }, 400);
        }
    
        return false;
    }else {
         const audio = new Audio('Sound Effects - Chess.com Sounds.mp3');
         audio.currentTime = 2.5;
         audio.volume = 0.5;
         audio.play();
         
         setTimeout(() => {
audio.pause();
        }, 1000);
    }
    if (SelectedPeace === 'k') state.didPeacesMoved.whiteKing = true;
    if (SelectedPeace === 'K') state.didPeacesMoved.blackKing = true;

    if (SelectedPeace === 'r') {
        if (c === 0) state.didPeacesMoved.whiteRookLeft = true;
        if (c === 7) state.didPeacesMoved.whiteRookRight = true;
    }

    if (SelectedPeace === 'R') {
        if (c === 0) state.didPeacesMoved.blackRookLeft = true;
        if (c === 7) state.didPeacesMoved.blackRookRight = true;
    }

    if (isKingInCheck(color)) {

        state.board[r][c] = tempFrom;
        state.board[moveToR][moveToc] = tempTo;


        return false;
    }

    controlRound=controlRound === 'white' ? 'black' : 'white';
    updateBoardRotation();

    const opponentColor =controlRound;

    state.lastMove.piece = SelectedPeace;
    state.lastMove.fromR = r;
    state.lastMove.toR = moveToR;
    state.lastMove.fromC = c;
    state.lastMove.toC = moveToc;

    if (isCheckmate(opponentColor)) {
        showCheckmateUI(opponentColor);
    }
    if (    isStalemate(opponentColor)) {
        showIsStalemateUI();
    }


    checkPromotion();
    if (!state.moveFunctions) {
        
        state.moveHistory.push({
            piece: SelectedPeace,
            from: `${String.fromCharCode(97 + c)}${8 - r}`,
            to: `${String.fromCharCode(97 + moveToc)}${8 - moveToR}`
        });
        
        document.querySelector(".turnFor-js").innerHTML =
            `The Turn is for ${controlRound}`;
        
        let movesHTML = "";
        
        for (let i = 0; i < state.moveHistory.length; i += 2) {
            const whiteMove = state.moveHistory[i];
            const blackMove = state.moveHistory[i + 1];
        
            movesHTML += `
                <div class="move-row">
                    <span class="move-number">${Math.floor(i / 2) + 1}.</span>
                    <span class="white-move">
                        ${whiteMove ? `White ${getPieceName(whiteMove.piece)} ${whiteMove.from} → ${whiteMove.to}` : ""}
                    </span>
                    <span class="black-move">
                        ${blackMove ? `Black ${getPieceName(blackMove.piece)} ${blackMove.from} → ${blackMove.to}` : ""}
                    </span>
                </div>
            `;
        }
        
        document.getElementById("whiteMoves-js").innerHTML = movesHTML;
    return true;
}}
