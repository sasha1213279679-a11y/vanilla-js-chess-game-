import { state } from "board.js";
import { notToJumpRock,
     notToJumpBishop,
      WillKingsTouch,
       CastlingForBlackKing,
        CastlingForWhiteKing,
        isKingInCheck,
        isSameColor 
} from "./rules.js";    
import { controlRound } from "Chess.js";

// Simulate moves for each piece type, checking if the move is valid and if it leaves the king in check.



//pawn simulate move
export function pawnMoves(SelectedPeace, r, c, moveToR, moveToC, moveToPeace){
    if (!SelectedPeace) return false;
    if (isSameColor(SelectedPeace, moveToPeace)) return false;

    const isWhite = SelectedPeace === SelectedPeace.toLowerCase();
    const dir = isWhite ? 1 : -1; 

    let valid = false;

    if (moveToC === c &&
         state.board[moveToR][moveToC] === null &&
          moveToR === r + dir) valid = true;

    if (moveToC === c &&
         moveToR === r + 2*dir &&
          state.board[moveToR][moveToC] === null &&
           state.board[r+dir][c] === null&&
           (state.boardClone[r][c]==='p'||state.boardClone[r][c]==='P')) valid = true;

    if (moveToPeace !== null &&
         moveToR === r + dir && 
         Math.abs(moveToC - c) === 1) valid = true;

    if (moveToR === r + dir && Math.abs(moveToC - c) === 1 &&
     state.board[moveToR][moveToC] === null &&
        state.lastMove?.piece.toLowerCase() === 'p' &&
        state.lastMove.toR === r && state.lastMove.toC === moveToC &&
        Math.abs(state.lastMove.fromR - state.lastMove.toR) === 2) {
        valid = true;
    }

    if (valid) {
        const temp = state.board[moveToR][moveToC];
        state.board[moveToR][moveToC] = SelectedPeace;
        state.board[r][c] = null;

        const color = isWhite ? 'white' : 'black';
        const safe = !isKingInCheck(color);

        state.board[r][c] = SelectedPeace;
        state.board[moveToR][moveToC] = temp;
        return safe;
    }

    return false;
}





//rock simulate move

export function RockMoves(SelectedPeace, r, c, moveToR, moveToC, moveToPeace) {
if (isSameColor(SelectedPeace, moveToPeace)) return false;
    if (!SelectedPeace) return false;


    if ((moveToC === c || moveToR === r) &&
     notToJumpRock(r, c, moveToR, moveToC)) {


        const temp = state.board[moveToR][moveToC];
        state.board[moveToR][moveToC] = SelectedPeace;
        state.board[r][c] = null;

        const color = SelectedPeace === SelectedPeace.toLowerCase() ? 'white' : 'black';
        const safe = !isKingInCheck(color);


        state.board[r][c] = SelectedPeace;
        state.board[moveToR][moveToC] = temp;

        return safe;
    }

    return false;
}
//knight simulate move
export function KnightMoves(SelectedPeace, r, c, moveToR, moveToC, moveToPeace) {
    if (!SelectedPeace) return false;
    if (isSameColor(SelectedPeace, moveToPeace)) return false;

    const rowDiff = Math.abs(moveToR - r);
    const colDiff = Math.abs(moveToC - c);

    if ((rowDiff === 2 && colDiff === 1) ||
     (rowDiff === 1 && colDiff === 2)) {

        const temp = state.board[moveToR][moveToC];
        state.board[moveToR][moveToC] = SelectedPeace;
        state.board[r][c] = null;

        const color = SelectedPeace === SelectedPeace.toLowerCase() ? 'white' : 'black';
        const safe = !isKingInCheck(color);

        state.board[r][c] = SelectedPeace;
        state.board[moveToR][moveToC] = temp;

        return safe;
    }

    return false;
}
//knight simulate move
export function BishopMoves(SelectedPeace, r, c, moveToR, moveToC, moveToPeace) {
    if (!SelectedPeace) return false;
    if (isSameColor(SelectedPeace, moveToPeace)) return false;


    const rowDiff = Math.abs(moveToR - r);
    const colDiff = Math.abs(moveToC - c);

    if (rowDiff === colDiff &&
         notToJumpBishop(r, c, moveToR, moveToC)
        )
          {
        const temp = state.board[moveToR][moveToC];
        state.board[moveToR][moveToC] = SelectedPeace;
        state.board[r][c] = null;

        const color = SelectedPeace === SelectedPeace.toLowerCase() ? 'white' : 'black';
        const safe = !isKingInCheck(color);

        state.board[r][c] = SelectedPeace;
        state.board[moveToR][moveToC] = temp;

        return safe;
    }

    return false;
}

//queen simulate move, combines rock and bishop moves
export function QueenMoves(SelectedPeace, r, c, moveToR, moveToc, moveToPeace) {
    if (!SelectedPeace) return false;
    if (isSameColor(SelectedPeace, moveToPeace)) return false;

if (BishopMoves(SelectedPeace, r, c, moveToR, moveToc, moveToPeace) 
|| RockMoves(SelectedPeace, r, c, moveToR, moveToc)) {
        return true;
    }
    else {
        return false;
    }
}
//king simulate move, checks if the move is valid and if it leaves the king in check, also checks for castling
export function KingMoves(SelectedPiece, r, c, moveToR, moveToC, moveToPeace) {
    if (!SelectedPiece) return false;
    if (isSameColor(SelectedPiece, moveToPeace)) return false;

    const rowDiff = Math.abs(moveToR - r);
    const colDiff = Math.abs(moveToC - c);

    if (rowDiff <= 1 && 
        colDiff <= 1) {
        if (WillKingsTouch(SelectedPiece, r, c, moveToR, moveToC)) {
            return false;
        }

        const boardCopy = state.board.map(row => [...row]);
        boardCopy[moveToR][moveToC] = boardCopy[r][c];
        boardCopy[r][c] = null;

        const color = SelectedPiece === SelectedPiece.toLowerCase() ? 'white' : 'black';

        const originalBoard = state.board;
        state.board = boardCopy;

        const inCheck = isKingInCheck(color);

        state.board = originalBoard;

        if (inCheck) {
            console.log('Move would put king in check');
            return false;
        }

        return true;
    }

    if (SelectedPiece === 'K') {
        return CastlingForBlackKing(SelectedPiece, r, c, moveToR, moveToC);
    } else if (SelectedPiece === 'k') {
        return CastlingForWhiteKing(SelectedPiece, r, c, moveToR, moveToC);
    }

    return false;
}

// show dots on the board for legal moves of the selected piece, also check if the piece belongs to the current player
export function showLegalMoves(r, c) {
    const piece = state.board[r][c];
    if (!piece) return;

    const isWhite = piece === piece.toLowerCase();
    const isBlack = piece === piece.toUpperCase();

    if ((controlRound=== 'white' && isBlack) || (controlRound=== 'black' && isWhite)) return;

    document.querySelectorAll('.dot').forEach(dot => dot.remove());

    for (let moveToR = 0; moveToR < 8; moveToR++) {
        for (let moveToC = 0; moveToC < 8; moveToC++) {
            const targetPiece = state.board[moveToR][moveToC];

            let canMove = false;
            switch (piece.toLowerCase()) {
                case 'p': canMove = pawnMoves(piece, r, c, moveToR, moveToC, targetPiece); break;
                case 'r': canMove = RockMoves(piece, r, c, moveToR, moveToC); break;
                case 'n': canMove = KnightMoves(piece, r, c, moveToR, moveToC); break;
                case 'b': canMove = BishopMoves(piece, r, c, moveToR, moveToC, targetPiece); break;
                case 'q': canMove = QueenMoves(piece, r, c, moveToR, moveToC, targetPiece); break;
                case 'k': canMove = KingMoves(piece, r, c, moveToR, moveToC, targetPiece); break;
            }if (canMove) {
                const cell = board.querySelector(
                    `.square[data-row='${moveToR}'][data-col='${moveToC}']`
                );
            
                if (cell) {
                    const dot = document.createElement('div');
                    dot.classList.add('dot');
            
                    cell.appendChild(dot); 
                }
            }}}}



