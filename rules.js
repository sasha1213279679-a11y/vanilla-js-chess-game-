import { controlRound } from "./Chess.js";
import { blackPieces,
    whitePieces,
    state } from "./board.js";
import { renderBoard } from "./renderBoard.js";
import { 
pawnMoves,
RockMoves,
KnightMoves,
BishopMoves,
QueenMoves,
KingMoves
 } from "./simulateMoves.js";
//var 
 let promotionPosition = null;
 let whiteKingRow, whiteKingCol ,blackKingRow, blackKingCol;

 

// functions to simulate moves and check if they put the king in check
export function tryWhitePawnMove(applyMove, undoMove) {
    applyMove();

    const safe = !isKingInCheck('white');

    if (!safe) {
        undoMove();
        return false;
    }

    board.innerHTML = '';
    renderBoard();
    return true;
}

export function tryBlackPawnMove(applyMove, undoMove) {
    applyMove();

    const safe = !isKingInCheck('black');

    if (!safe) {
        undoMove();
        return false;
    }

    board.innerHTML = '';
    renderBoard();
    return true;
}



// function to check if two pieces are of the same color
export function isSameColor(piece1, piece2) {
    if (!piece1 || !piece2) return false;

    return (
        (piece1 === piece1.toLowerCase() && piece2 === piece2.toLowerCase()) ||
        (piece1 === piece1.toUpperCase() && piece2 === piece2.toUpperCase())
    );
}
          
// function to control if the selected piece belongs to the player whose turn it is
          export function controlRounds(SelectedPeace) {

            if (controlRound === 'white' && blackPieces.includes(SelectedPeace)) {
                return false;
            }
        
            if (controlRound === 'black' && whitePieces.includes(SelectedPeace)) {
                return false;
            }
        
        
            return true;
}
// function to check if the piece doesn't jump over other pieces
        export function notToJumpRock(r, c, moveToR, moveToc) {
            if (r !== moveToR && c !== moveToc)
                 return false;
        
            if (c === moveToc) {
                const step = moveToR > r ? 1 : -1;
                for (let i = r + step; i !== moveToR; i += step) {
                    if (!state.board[i] || state.board[i][c] === undefined) return false;
                    if (state.board[i][c] !== null)
                         return false;
                }
            }
        
            if (r === moveToR) {
                const step = moveToc > c ? 1 : -1;
                if (!state.board[r]) return false; 
                for (let i = c + step; i !== moveToc; i += step) {
                    if (state.board[r][i] === undefined) return false; 
                    if (state.board[r][i] !== null) return false; 
                }
            }
        
            return true;
        }

export function notToJumpBishop(r, c, moveToR, moveToc) {
    const diffR = moveToR - r;
    const diffC = moveToc - c;

    if (Math.abs(diffR) !== Math.abs(diffC)) return false;

    const stepR = diffR > 0 ? 1 : -1;
    const stepC = diffC > 0 ? 1 : -1;

    let i = r + stepR;
    let j = c + stepC;

    while (i !== moveToR && j !== moveToc) {
        if (i < 0 || i > 7 || j < 0 || j > 7) return false; 

        if (state.board[i][j] !== null) {
            return false;
        }
        i += stepR;
        j += stepC;
    }

    return true;
}


export function notToJumpQueen(r, c, moveToR, moveToc) {
    const canMoveAsRook = (r === moveToR || c === moveToc) && notToJumpRock(r, c, moveToR, moveToc);
    const canMoveAsBishop = Math.abs(moveToR - r) === Math.abs(moveToc - c) && notToJumpBishop(r, c, moveToR, moveToc);
    return canMoveAsRook || canMoveAsBishop;
}


// functions to handle pawn promotion
export function checkPromotion() {
    for (let c = 0; c < 8; c++) {
        if (state.board[0][c] === 'P') {
            promotionPosition = { r: 0, c };
            state.isPromotionOpen = true;
            showPromotion('black');
            return;
        }

        if (state.board[7][c] === 'p') {
            promotionPosition = { r: 7, c };
            state.isPromotionOpen = true;
            showPromotion('white');
            return;
        }
    }
}

function showPromotion(color) {
    const box = document.getElementById('promotion-box');
    const content = box.querySelector('.promotion-content');
    const boardEl = document.getElementById('board');

    box.classList.remove('hidden');
    boardEl.classList.add('board-locked');

    if (color === 'white') {
        content.innerHTML = `
            <h3 class="promotion-title">Choose Promotion Piece</h3>
            <div class="promo-options">
              <button type="button" class="promo-option promo-white" data-piece="q">♕</button>
              <button type="button" class="promo-option promo-white" data-piece="r">♖</button>
              <button type="button" class="promo-option promo-white" data-piece="b">♗</button>
              <button type="button" class="promo-option promo-white" data-piece="n">♘</button>
            </div>
        `;
    } else {
        content.innerHTML = `
            <h3 class="promotion-title">Choose Promotion Piece</h3>
            <div class="promo-options">
              <button type="button" class="promo-option promo-black" data-piece="Q">♛</button>
              <button type="button" class="promo-option promo-black" data-piece="R">♜</button>
              <button type="button" class="promo-option promo-black" data-piece="B">♝</button>
              <button type="button" class="promo-option promo-black" data-piece="N">♞</button>
            </div>
        `;
    }

    choosePromotion();
}

export function choosePromotion() {
    const box = document.getElementById('promotion-box');
    const content = box.querySelector('.promotion-content');
    const boardEl = document.getElementById('board');

    content.onclick = (e) => {
        const el = e.target.closest('[data-piece]');
        if (!el || !promotionPosition) return;

        state.board[promotionPosition.r][promotionPosition.c] = el.dataset.piece;

        promotionPosition = null;
        state.isPromotionOpen = false;

        box.classList.add('hidden');
        boardEl.classList.remove('board-locked');

        renderBoard();
    };
}







// functions to find the kings' positions
export function findWhiteKing () {
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (state.board[r][c] === "k") {
                whiteKingRow = r;
                whiteKingCol = c;
                return;
            }
        }
    }
}

export function findBlackKing() {

    
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (state.board[r][c] === "K") {
                blackKingRow = r;
                blackKingCol = c;
                return;
            }
        }
    }

}




// function to check if the king is in check
export function isKingChecked(SelectedPeace, row, col) {

   findWhiteKing();
   findBlackKing();


    //  black pawn
    if (SelectedPeace === 'P') {

        if (row - 1 < 0) return false;

        if (col - 1 >= 0 && state.board[row - 1][col - 1] === "k") return true;
        if (col + 1 <= 7 && state.board[row - 1][col + 1] === "k") return true;

        return false;
    }

    //  white pawn
    else if (SelectedPeace === "p") {

        if (row + 1 > 7) return false;

        if (col - 1 >= 0 && state.board[row + 1][col - 1] === "K") return true;
        if (col + 1 <= 7 && state.board[row + 1][col + 1] === "K") return true;

        return false;
    }

    //  rook (both colors)
    else if (SelectedPeace.toLowerCase() === "r") {
    return rockForChecked(SelectedPeace, row, col);
    }
    //  Knight
    else if (SelectedPeace.toLowerCase() === 'n') {
        const isBlackPiece = SelectedPeace === SelectedPeace.toUpperCase();
        const targetKingRow = isBlackPiece ? whiteKingRow : blackKingRow;
        const targetKingCol = isBlackPiece ? whiteKingCol : blackKingCol;
    
        const knightMoves = [
            [ -2, -1 ], [ -2, 1 ],
            [ -1, -2 ], [ -1, 2 ],
            [ 1, -2 ],  [ 1, 2 ],
            [ 2, -1 ],  [ 2, 1 ]
        ];
    
        for (const [dr, dc] of knightMoves) {
            if (row + dr === targetKingRow && col + dc === targetKingCol) {
                return true;
            }
        }
        return false;
    }



//bishop

    else if (SelectedPeace.toLowerCase() === "b") {
        return bishopForChecked(SelectedPeace, row, col);
    }
    //Queen
    else if (SelectedPeace.toLowerCase() === "q") {

        if (rockForChecked(SelectedPeace, row, col)||bishopForChecked(SelectedPeace, row, col)) return true;
   
        return false;

    }


}
export function isKingInCheck(color) {

    findWhiteKing();
    findBlackKing();

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {

            const piece = state.board[r][c];
            if (!piece) continue;

            const isEnemy = color === 'white'
                ? piece === piece.toUpperCase()
                : piece === piece.toLowerCase();

            if (!isEnemy) continue;

            if (isKingChecked(piece, r, c)) {
                return true;
            }
        }
    }

    return false;
}

function rockForChecked(SelectedPeace, row, col) {
    
    const isBlackPiece = SelectedPeace === SelectedPeace.toUpperCase();

    const targetKingRow = isBlackPiece ? whiteKingRow : blackKingRow;
    const targetKingCol = isBlackPiece ? whiteKingCol : blackKingCol;

    if (col === targetKingCol) {
        const step = targetKingRow > row ? 1 : -1;

        for (let r = row + step; r !== targetKingRow; r += step) {
            if (state.board[r][col] != null) return false;
        }

        return true;
    }

    if (row === targetKingRow) {
        const step = targetKingCol > col ? 1 : -1;

        for (let c = col + step; c !== targetKingCol; c += step) {
            if (state.board[row][c] != null) return false;
        }

        return true;
    }

    return false;
}
function bishopForChecked(SelectedPeace, row, col) {

    const isBlackPiece = SelectedPeace === SelectedPeace.toUpperCase();

    const targetKingRow = isBlackPiece ? whiteKingRow : blackKingRow;
    const targetKingCol = isBlackPiece ? whiteKingCol : blackKingCol;

    const diffR = targetKingRow - row;
    const diffC = targetKingCol - col;

    if (Math.abs(diffR) !== Math.abs(diffC)) return false;

    const stepR = diffR > 0 ? 1 : -1;
    const stepC = diffC > 0 ? 1 : -1;

    let i = row + stepR;
    let j = col + stepC;

    while (i !== targetKingRow) {

        if (state.board[i][j] !== null) return false;

        i += stepR;
        j += stepC;
    }

    return true;
}








// function to check if the kings are touching each other
export function TouchKings() {
    findBlackKing();
    findWhiteKing();

    const diffR = Math.abs(whiteKingRow - blackKingRow);
    const diffC = Math.abs(whiteKingCol - blackKingCol);

    return (diffR <= 1 && diffC <= 1);
}
//simulate king move to check if it touches the other king

export function WillKingsTouch(SelectedPiece, fromR, fromC, toR, toC) {
   
    findBlackKing();
    findWhiteKing();
   
    let blackR = blackKingRow;
    let blackC = blackKingCol;
    let whiteR = whiteKingRow;
    let whiteC = whiteKingCol;

    if (SelectedPiece === 'K') {
        blackR = toR;
        blackC = toC;
    } else if (SelectedPiece === 'k') {
        whiteR = toR;
        whiteC = toC;
    }

    const diffR = Math.abs(whiteR - blackR);
    const diffC = Math.abs(whiteC - blackC);

    return (diffR <= 1 && diffC <= 1);
}

// castling for kings
export function CastlingForBlackKing(SelectedPeace, r, c, moveToR, moveToC) {

    if (SelectedPeace !== 'K') return false;

    if (r !== moveToR || Math.abs(moveToC - c) !== 2) return false;

    const step = moveToC > c ? 1 : -1;

    if (state.didPeacesMoved.blackKing) return false;

    const rookCol = step === 1 ? 7 : 0;
    const rook = state.board[r][rookCol];

    if (rook !== 'R') return false;

    if (step === 1 && state.didPeacesMoved.blackRookRight) return false;
    if (step === -1 && state.didPeacesMoved.blackRookLeft) return false;

    for (let i = c + step; i !== rookCol; i += step) {
        if (state.board[r][i] !== null) return false;
    }

    const color = 'black';

    if (isKingInCheck(color)) return false;

    state.board[r][c] = null;
    state.board[r][c + step] = 'K';

    if (isKingInCheck(color)) {
        state.board[r][c] = 'K';
        state.board[r][c + step] = null;
        return false;
    }

    state.board[r][c + step] = null;
    state.board[moveToR][moveToC] = 'K';

    if (isKingInCheck(color)) {
        state.board[r][c] = 'K';
        state.board[moveToR][moveToC] = null;
        return false;
    }

    state.board[r][c] = 'K';
    state.board[moveToR][moveToC] = null;

    state.board[moveToR][moveToC] = 'K';
    state.board[r][c] = null;

    const newRookCol = moveToC - step;

    state.board[r][newRookCol] = 'R';
    state.board[r][rookCol] = null;

    board.innerHTML = '';
    renderBoard();

    return true;
}




export function CastlingForWhiteKing(SelectedPeace, r, c, moveToR, moveToC) {

    if (SelectedPeace !== 'k') return false;

    if (r !== moveToR || Math.abs(moveToC - c) !== 2) return false;

    const step = moveToC > c ? 1 : -1;

    if (state.didPeacesMoved.whiteKing) return false;

    const rookCol = step === 1 ? 7 : 0;
    const rook = state.board[r][rookCol];

    if (rook !== 'r') return false;

    if (step === 1 && state.didPeacesMoved.whiteRookRight) return false;
    if (step === -1 && state.didPeacesMoved.whiteRookLeft) return false;

    for (let i = c + step; i !== rookCol; i += step) {
        if (state.board[r][i] !== null) return false;
    }

    const color = 'white';

    if (isKingInCheck(color)) return false;

    state.board[r][c] = null;
    state.board[r][c + step] = 'k';

    if (isKingInCheck(color)) {
        state.board[r][c] = 'k';
        state.board[r][c + step] = null;
        return false;
    }

    state.board[r][c + step] = null;
    state.board[moveToR][moveToC] = 'k';

    if (isKingInCheck(color)) {
        state.board[r][c] = 'k';
        state.board[moveToR][moveToC] = null;
        return false;
    }

    state.board[r][c] = 'k';
    state.board[moveToR][moveToC] = null;

    state.board[moveToR][moveToC] = 'k';
    state.board[r][c] = null;

    const newRookCol = moveToC - step;

    state.board[r][newRookCol] = 'r';
    state.board[r][rookCol] = null;

    board.innerHTML = '';
    renderBoard();

    return true;
}

// function to check if the player has any legal moves left
function HasLegalMoves(color) {
    for(let r = 0; r < 8; r++){
        for(let c = 0; c < 8; c++){

            const piece = state.board[r][c];
            if (!piece) continue;

            const isWhite = piece === piece.toLowerCase();
            const isBlack = piece === piece.toUpperCase();

            if (controlRound === 'white' && isBlack) continue;
            if (controlRound === 'black' && isWhite) continue;

            for (let moveToR = 0; moveToR < 8; moveToR++) {
                for (let moveToC = 0; moveToC < 8; moveToC++) {

                    const targetPiece = state.board[moveToR][moveToC];

                    switch (piece.toLowerCase()) {
                        case 'p':
                            if (pawnMoves(piece, r, c, moveToR, moveToC, targetPiece)) return true;
                            break;

                        case 'r':
                            if (RockMoves(piece, r, c, moveToR, moveToC, targetPiece)) return true;
                            break;

                        case 'n':
                            if (KnightMoves(piece, r, c, moveToR, moveToC, targetPiece)) return true;
                            break;

                        case 'b':
                            if (BishopMoves(piece, r, c, moveToR, moveToC, targetPiece)) return true;
                            break;

                        case 'q':
                            if (QueenMoves(piece, r, c, moveToR, moveToC, targetPiece)) return true;
                            break;

                        case 'k':
                            if (KingMoves(piece, r, c, moveToR, moveToC, targetPiece)) return true;
                            break;
                    }
                }
            }
        }
    }
    console.log("No legal moves available");
    return false;
}


// functions to check for checkmate and stalemate
export function isCheckmate(color) {
    return isKingInCheck(color) && !HasLegalMoves(color);
}

export function isStalemate(color) {
    return !isKingInCheck(color) && !HasLegalMoves(color);
}
