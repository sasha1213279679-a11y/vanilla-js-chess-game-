import {state,board,} from 'board.js'
import {renderBoard} from 'renderBoard.js'
import {  notToJumpRock,
     notToJumpBishop,
      CastlingForBlackKing,
    tryBlackPawnMove,
    isKingInCheck,
    TouchKings } from "rules.js";    



//pawn 
export function blackPawnMoves(SelectedPeace, r, c, moveToR, moveToc, moveToPeace) {
    
// normal move
    if (SelectedPeace !== 'P') return false;

    const target = state.board[moveToR]?.[moveToc];

    if (
        moveToR === r - 1 &&
        moveToc === c &&
        target === null
    ) {
        const fromPiece = state.board[r][c];

        return tryBlackPawnMove(
            () => {
                state.board[moveToR][moveToc] = 'P';
                state.board[r][c] = null;
            },
            () => {
                state.board[r][c] = fromPiece;
                state.board[moveToR][moveToc] = target;
            }
        );
    }
// double move from starting position
    if (
        moveToR === r - 2 &&
        moveToc === c &&
        target === null &&
        state.board[r - 1]?.[c] === null &&
        state.boardClone?.[r]?.[c] === 'P'
    ) {
        const fromPiece = state.board[r][c];

        return tryBlackPawnMove(
            () => {
                state.board[moveToR][moveToc] = 'P';
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
        piece !== null &&
         piece === piece.toLowerCase() &&
        moveToR === r - 1 &&
        Math.abs(moveToc - c) === 1
    ) {
        const fromPiece = state.board[r][c];
        const capturedPiece = state.board[moveToR][moveToc];

        return tryBlackPawnMove(
            () => {
                state.board[moveToR][moveToc] = 'P';
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
        r === 3 &&
        moveToR === r - 1 &&
        Math.abs(moveToc - c) === 1 &&
        state.board[moveToR][moveToc] === null &&
        state.lastMove &&
        state.lastMove.piece === 'p' &&
        state.lastMove.toR === r &&
        state.lastMove.toC === moveToc &&
        Math.abs(state.lastMove.fromR - state.lastMove.toR) === 2
    ) {
        const fromPiece = state.board[r][c];
        const capturedPawn = state.board[r][moveToc];

        return tryBlackPawnMove(
            () => {
                state.board[moveToR][moveToc] = 'P';
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

//Rock
export function blackRockMoves(SelectedPeace, r, c, moveToR, moveToc, moveToPeace) {
    

    if (
        SelectedPeace !== 'R' ||
        !(moveToc == c || moveToR == r) ||
        !notToJumpRock(r, c, moveToR, moveToc)
    ) {
        return false;
    }

const target = state.board[moveToR]?.[moveToc];
    const fromPiece = state.board[r][c];

    state.board[moveToR][moveToc] = 'R';
    state.board[r][c] = null;

    if (isKingInCheck('black')) {
        state.board[r][c] = fromPiece;
        state.board[moveToR][moveToc] = target;
        return false;
    }

    board.innerHTML = '';
    renderBoard();
    return true;}

//Bishop
export function blackBishopMoves(SelectedPeace, r, c, moveToR, moveToc, moveToPeace) {
    

    if (
        SelectedPeace !== 'B' ||
        Math.abs(moveToR - r) !== Math.abs(moveToc - c) ||
        !notToJumpBishop(r, c, moveToR, moveToc)
    ) {
        return false;
    }

const target = state.board[moveToR]?.[moveToc];
    const fromPiece = state.board[r][c];

    state.board[moveToR][moveToc] = 'B';
    state.board[r][c] = null;

    if (isKingInCheck('black')) {
        state.board[r][c] = fromPiece;
        state.board[moveToR][moveToc] = target;
        return false;
    }

    board.innerHTML = '';
    renderBoard();
    return true;
}
    //Knight
    export function blackKnightMoves(SelectedPeace, r, c, moveToR, moveToc, moveToPeace) {
        
        if (SelectedPeace !== 'N') return false;
    
        const rowDiff = Math.abs(moveToR - r);
        const colDiff = Math.abs(moveToc - c);
    
        const isKnightMove =
            (rowDiff === 2 && colDiff === 1) ||
            (rowDiff === 1 && colDiff === 2);
    
        if (!isKnightMove) return false;
    
    const target = state.board[moveToR]?.[moveToc];
        const fromPiece = state.board[r][c];
    
        state.board[moveToR][moveToc] = 'N';
        state.board[r][c] = null;
    
        if (isKingInCheck('black')) {
            state.board[r][c] = fromPiece;
            state.board[moveToR][moveToc] = target;
            return false;
        }
    
        board.innerHTML = '';
        renderBoard();
        return true;
    }
//Queen
export function blackQueenMoves(SelectedPeace, r, c, moveToR, moveToc, moveToPeace) {
    
    if (SelectedPeace !== 'Q') return false;


    const isRockLike =
        (moveToc == c || moveToR == r) &&
        notToJumpRock(r, c, moveToR, moveToc);

    const isBishopLike =
        Math.abs(moveToR - r) === Math.abs(moveToc - c) &&
        notToJumpBishop(r, c, moveToR, moveToc);

    if (!isRockLike && !isBishopLike) {
        return false;
    }
const target = state.board[moveToR]?.[moveToc];
    const fromPiece = state.board[r][c];

    state.board[moveToR][moveToc] = 'Q';
    state.board[r][c] = null;

    if (isKingInCheck('black')) {
        state.board[r][c] = fromPiece;
        state.board[moveToR][moveToc] = target;
        return false;
    }

    board.innerHTML = '';
    renderBoard();
    return true;
}

//king
export function blackKingMoves(SelectedPiece, r, c, moveToR, moveToC) {


    const rowDiff = Math.abs(moveToR - r);
    const colDiff = Math.abs(moveToC - c);

    if (
        SelectedPiece === 'K' &&
        rowDiff <= 1 &&
        colDiff <= 1
    ) {
        const temp = state.board[moveToR][moveToC];

        state.board[moveToR][moveToC] = 'K';
        state.board[r][c] = null;

        if (TouchKings()) {
            state.board[r][c] = 'K';
            state.board[moveToR][moveToC] = temp;
            return false;
        }
        if (isKingInCheck('black')) {
            state.board[r][c] = 'K';
state.board[moveToR][moveToC] = temp;
            return false;
        }
        board.innerHTML = '';
        renderBoard();
        return true;
    } 
    
    else if (SelectedPiece === 'K') {

        return CastlingForBlackKing(
            SelectedPiece,
            r,
            c,
            moveToR,
            moveToC
        );
    }

    return false;
}
