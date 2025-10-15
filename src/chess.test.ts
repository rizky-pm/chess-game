import { ChessGame } from './chess.js';

describe('ChessGame', () => {
  let game: ChessGame;

  beforeEach(() => {
    game = new ChessGame();
  });

  test('initial board should have correct piece setup', () => {
    const board = game.board;

    expect(board[0]).toEqual(['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r']);
    expect(board[1]).toEqual(Array(8).fill('p'));
    expect(board[6]).toEqual(Array(8).fill('P'));
    expect(board[7]).toEqual(['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']);

    for (let i = 2; i <= 5; i++) {
      expect(board[i]).toEqual(Array(8).fill(' '));
    }
  });

  test('should allow valid pawn moves and block invalid ones', () => {
    expect(game.movePiece('a2,a3')).toBe(true);
    game = new ChessGame();
    expect(game.movePiece('a2,a4')).toBe(true);
    game = new ChessGame();
    expect(game.movePiece('a2,a5')).toBe(false);
  });

  test('should validate knight moves correctly', () => {
    expect(game.movePiece('b1,c3')).toBe(true);
    game = new ChessGame();
    expect(game.movePiece('b1,b3')).toBe(false);
  });

  test('should validate rook movement', () => {
    game.movePiece('a2,a4');
    expect(game.movePiece('a1,a3')).toBe(true);
    game = new ChessGame();
    expect(game.movePiece('a1,b2')).toBe(false);
  });

  test('should validate bishop movement', () => {
    game.movePiece('e2,e4');
    expect(game.movePiece('f1,c4')).toBe(true);
    game = new ChessGame();
    expect(game.movePiece('f1,f3')).toBe(false);
  });

  test('should validate queen movement', () => {
    game.movePiece('e2,e4');
    expect(game.movePiece('d1,h5')).toBe(true);
    game = new ChessGame();
    expect(game.movePiece('d1,e3')).toBe(false);
  });

  test('should validate king movement', () => {
    game.board[7]![4] = 'K';
    game.board[6]![4] = ' ';
    expect(game.movePiece('e1,e2')).toBe(true);
    game = new ChessGame();
    expect(game.movePiece('e1,e3')).toBe(false);
  });

  test('should end game when a king is captured', () => {
    game.board = Array(8)
      .fill(null)
      .map(() => Array(8).fill(' '));

    game.board[7]![4] = 'K';
    game.board[0]![4] = 'k';
    game.board[1]![4] = 'Q';

    expect(game.movePiece('e7,e8')).toBe(true);
    expect(game.gameOver).toBe(true);
  });
});
