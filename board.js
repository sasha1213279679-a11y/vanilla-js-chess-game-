

//small character is white piece && 
//capital character is black piece

export const board=document.getElementById('board')

export const PIECES={P:'♙',R:'♖',N:'♘',B:'♗',Q:'♕',K:'♔',p:'♟',r:'♜',n:'♞',b:'♝',q:'♛',k:'♚'}

export const state={
  gameOver: false,
  isPromotionOpen: false
,
    board:[
      ['r','n','b','q','k','b','n','r'],
      ['p','p','p','p','p','p','p','p'],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      ['P','P','P','P','P','P','P','P'],
      ['R','N','B','Q','K','B','N','R']
    ],

    boardClone:[
        ['r','n','b','q','k','b','n','r'],
        ['p','p','p','p','p','p','p','p'],
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        ['P','P','P','P','P','P','P','P'],
        ['R','N','B','Q','K','B','N','R']
      ]
,

      lastMove :{ 
        piece: '',
        fromR: 0,
        toR: 0,
        fromC: 0
        ,toC:0
      }
,
didPeacesMoved: {
  whiteKing: false,
  blackKing: false,

  whiteRookLeft: false,
  whiteRookRight: false,

  blackRookLeft: false,
  blackRookRight: false
},
moveHistory: [

  
],
redoStack: []

}
export const whitePieces=['r','n','b','q','k','p']

export const blackPieces=['R','N','B','Q','K','P']

export function getPieceName(piece) {
  const names = {
      p: 'Pawn',
      r: 'Rook',
      n: 'Knight',
      b: 'Bishop',
      q: 'Queen',
      k: 'King',
      P: 'Pawn',
      R: 'Rook',
      N: 'Knight',
      B: 'Bishop',
      Q: 'Queen',
      K: 'King'
  };
  return names[piece] || piece;
}