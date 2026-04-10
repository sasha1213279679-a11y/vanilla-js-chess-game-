import {state,board,} from './board.js'
import {renderBoard} from './renderBoard.js'
import {
notToJumpRock,
notToJumpBishop,
notToJumpQueen,
TouchKings,
CastlingForWhiteKing,
isKingInCheck,
tryWhitePawnMove

 } from './rules.js'

 //pawn
export function whitePawnMoves(SelectedPeace, r, c, moveToR, moveToc, moveToPeace) {
    
    if (SelectedPeace !== 'p') return false;

    const target = state.board[moveToR]?.[moveToc];

    // regular move
    if (
        moveToR === r + 1 &&
        moveToc === c &&
        target === null
    ) {
        const fromPiece = state.board[r][c];

        return tryWhitePawnMove(
            () => {
                state.board[moveToR][moveToc] = 'p';
                state.board[r][c] = null;
            },
            () => {
                state.board[r][c] = fromPiece;
                state.board[moveToR][moveToc] = target;
            }
        );
    }

    // tow move from starting position
    if (
        moveToR === r + 2 &&
        moveToc === c &&
        target === null &&
        state.board[r + 1]?.[c] === null &&
        state.boardClone?.[r]?.[c] === 'p'
    ) {
        const fromPiece = state.board[r][c];

        return tryWhitePawnMove(
            () => {
                state.board[moveToR][moveToc] = 'p';
                state.board[r][c] = null;
            },
            () => {
                state.board[r][c] = fromPiece;
                state.board[moveToR][moveToc] = target;
            }
        );
    }

    // capture
    if (
        moveToPeace !== null &&
        SelectedPeace !== null &&
         SelectedPeace ===SelectedPeace.toUpperCase() &&
        moveToR === r + 1 &&
        Math.abs(moveToc - c) === 1
    ) {
        const fromPiece = state.board[r][c];
        const capturedPiece = state.board[moveToR][moveToc];

        return tryWhitePawnMove(
            () => {
                state.board[moveToR][moveToc] = 'p';
                state.board[r][c] = null;
            },
            () => {
                state.board[r][c] = fromPiece;
                state.board[moveToR][moveToc] = capturedPiece;
            }
        );
    }

    // en passant
    if (
        r === 4 &&
        moveToR === r + 1 &&
        Math.abs(moveToc - c) === 1 &&
        state.board[moveToR][moveToc] === null &&
        state.lastMove &&
        state.lastMove.piece === 'P' &&
        state.lastMove.toR === r &&
        state.lastMove.toC === moveToc &&
        Math.abs(state.lastMove.fromR - state.lastMove.toR) === 2
    ) {
        const fromPiece = state.board[r][c];
        const capturedPawn = state.board[r][moveToc];

        return tryWhitePawnMove(
            () => {
                state.board[moveToR][moveToc] = 'p';
                state.board[r][c] = null;
                state.board[r][moveToc] = null;
            },
            () => {
                state.board[r][c] = fromPiece;
                state.board[moveToR][moveToc] = null;
                state.board[r][moveToc] = capturedPawn;
            }
        );
    }

    return false;
}
//rock
export function whiteRockMoves(SelectedPeace, r, c, moveToR, moveToc, moveToPeace) {
   
    if (
        SelectedPeace !== 'r' ||
        !(moveToc == c || moveToR == r) ||
        !notToJumpRock(r, c, moveToR, moveToc)
    ) {
        return false;
    }

    const target = state.board[moveToR]?.[moveToc];
    const fromPiece = state.board[r][c];


    state.board[moveToR][moveToc] = 'r';
    state.board[r][c] = null;

    if (isKingInCheck('white')) {
        state.board[r][c] = fromPiece;
        state.board[moveToR][moveToc] = target;
        return false;
    }

    board.innerHTML = '';
    renderBoard();
    return true;
}

//Bishop
export function whiteBishopMoves(SelectedPeace, r, c, moveToR, moveToc, moveToPeace) {
   

    if (
        SelectedPeace !== 'b' ||
        Math.abs(moveToR - r) !== Math.abs(moveToc - c) ||
        !notToJumpBishop(r, c, moveToR, moveToc)
    ) {
        return false;
    }

    const target = state.board[moveToR]?.[moveToc];
    const fromPiece = state.board[r][c];

    if (target !== null && target === target.toLowerCase()) {
        return false;
    }

    state.board[moveToR][moveToc] = 'b';
    state.board[r][c] = null;

    if (isKingInCheck('white')) {
        state.board[r][c] = fromPiece;
        state.board[moveToR][moveToc] = target;
        return false;
    }

    board.innerHTML = '';
    renderBoard();
    return true;
}

//Knight
export function whiteKnightMoves(SelectedPeace, r, c, moveToR, moveToc, moveToPeace) {
  

    if (SelectedPeace !== 'n') return false;

    const rowDiff = Math.abs(moveToR - r);
    const colDiff = Math.abs(moveToc - c);

    const isKnightMove =
        (rowDiff === 2 && colDiff === 1) ||
        (rowDiff === 1 && colDiff === 2);

    if (!isKnightMove) return false;

    const target = state.board[moveToR]?.[moveToc];
    const fromPiece = state.board[r][c];


    state.board[moveToR][moveToc] = 'n';
    state.board[r][c] = null;

    if (isKingInCheck('white')) {
        state.board[r][c] = fromPiece;
        state.board[moveToR][moveToc] = target;
        return false;
    }

    board.innerHTML = '';
    renderBoard();
    return true;
}
    //Queen
    export function whiteQueenMoves(SelectedPeace, r, c, moveToR, moveToc, moveToPeace) {
       
        if (SelectedPeace !== 'q') return false;
    
        const isRockLike =
            (moveToc === c || moveToR === r) &&
            notToJumpRock(r, c, moveToR, moveToc);
    
        const isBishopLike =
            Math.abs(moveToR - r) === Math.abs(moveToc - c) &&
            notToJumpBishop(r, c, moveToR, moveToc);
    
        if (!isRockLike && !isBishopLike) {
            return false;
        }
    
        const target = state.board[moveToR]?.[moveToc];
        const fromPiece = state.board[r][c];
    
    
        state.board[moveToR][moveToc] = 'q';
        state.board[r][c] = null;
    
        if (isKingInCheck('white')) {
            state.board[r][c] = fromPiece;
            state.board[moveToR][moveToc] = target;
            return false;
        }
    
        board.innerHTML = '';
        renderBoard();
        return true;
    }
    //King
    export function whiteKingMoves(SelectedPiece, r, c, moveToR, moveToC) {
       
        const rowDiff = Math.abs(moveToR - r);
        const colDiff = Math.abs(moveToC - c);
    
        if (SelectedPiece === 'k' && rowDiff <= 1 && colDiff <= 1) {
            const target = state.board[moveToR]?.[moveToC];
    
    
            const temp = target;
    
            state.board[moveToR][moveToC] = 'k';
            state.board[r][c] = null;
    
            if (WillKingsTouch()) {
                state.board[r][c] = 'k';
                state.board[moveToR][moveToC] = temp;
                return false;
            }
    
            if (isKingInCheck('white')) {
                state.board[r][c] = 'k';
                state.board[moveToR][moveToC] = temp;
                return false;
            }
    
            board.innerHTML = '';
            renderBoard();
            return true;
        } else if (SelectedPiece === 'k') {
            if (CastlingForWhiteKing(SelectedPiece, r, c, moveToR, moveToC)) {
                const step = moveToC > c ? 1 : -1;
                const rookCol = step === 1 ? 7 : 0;
                const newRookCol = moveToC - step;
        
                state.board[r][c] = null;
                state.board[moveToR][moveToC] = 'k';
        
                state.board[r][rookCol] = null;
                state.board[r][newRookCol] = 'r';
        
                state.didPeacesMoved.whiteKing = true;
                if (rookCol === 7) {
                    state.didPeacesMoved.whiteRookRight = true;
                } else {
                    state.didPeacesMoved.whiteRookLeft = true;
                }
        
                board.innerHTML = '';
                renderBoard();
        
                return true;
            }
                else {return false;}
        }}
