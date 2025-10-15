export type Board = string[][];

export class ChessGame {
  board: Board;
  gameOver: boolean = false;

  constructor() {
    this.board = this.initializeBoard();
  }

  initializeBoard(): Board {
    return [
      ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
      Array(8).fill('p'),
      Array(8).fill(' '),
      Array(8).fill(' '),
      Array(8).fill(' '),
      Array(8).fill(' '),
      Array(8).fill('P'),
      ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
    ];
  }

  printBoard(): void {
    console.log('\n  a b c d e f g h');
    for (let i = 0; i < 8; i++) {
      let rowStr = `${8 - i} `;
      for (let j = 0; j < 8; j++) {
        rowStr += `${this.board[i]![j]} `;
      }
      console.log(rowStr + `${8 - i}`);
    }
    console.log('  a b c d e f g h\n');
  }

  parsePosition(pos: string): [number, number] | null {
    if (!/^[a-h][1-8]$/.test(pos)) return null;
    const [colPosition, rowPosition] = pos;
    const col = colPosition!.charCodeAt(0) - 'a'.charCodeAt(0);
    const row = 8 - parseInt(rowPosition!);
    return [row, col];
  }

  isEnemy(piece: string, target: string): boolean {
    if (target === ' ') return false;
    return piece === piece.toUpperCase()
      ? target === target.toLowerCase()
      : target === target.toUpperCase();
  }

  isPathClear(
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number
  ): boolean {
    const stepRow = Math.sign(toRow - fromRow);
    const stepCol = Math.sign(toCol - fromCol);

    let r = fromRow + stepRow;
    let c = fromCol + stepCol;

    while (r !== toRow || c !== toCol) {
      if (this.board[r]![c] !== ' ') return false;
      r += stepRow;
      c += stepCol;
    }

    const target = this.board[toRow]![toCol];
    return (
      target === ' ' || this.isEnemy(this.board[fromRow]![fromCol]!, target!)
    );
  }

  isMoveValid(
    piece: string,
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number
  ): boolean {
    const diagonalX = toCol - fromCol;
    const diagonalY = toRow - fromRow;
    const positiveDiagonalX = Math.abs(diagonalX);
    const positiveDiagonalY = Math.abs(diagonalY);
    const target = this.board[toRow]![toCol];
    const isWhite = piece === piece.toUpperCase();

    switch (piece.toUpperCase()) {
      case 'P': {
        const direction = isWhite ? -1 : 1;
        const startRow = isWhite ? 6 : 1;

        const oneStep =
          fromCol === toCol && fromRow + direction === toRow && target === ' ';

        const twoStep =
          fromRow === startRow &&
          fromRow + 2 * direction === toRow &&
          fromCol === toCol &&
          this.board[fromRow + direction]![fromCol] === ' ' &&
          target === ' ';

        const capture =
          Math.abs(fromCol - toCol) === 1 &&
          fromRow + direction === toRow &&
          target !== ' ' &&
          this.isEnemy(piece, target!);

        return oneStep || twoStep || capture;
      }

      case 'R':
        if (diagonalX !== 0 && diagonalY !== 0) return false;
        return this.isPathClear(fromRow, fromCol, toRow, toCol);

      case 'B':
        if (positiveDiagonalX !== positiveDiagonalY) return false;
        return this.isPathClear(fromRow, fromCol, toRow, toCol);

      case 'Q':
        if (
          diagonalX === 0 ||
          diagonalY === 0 ||
          positiveDiagonalX === positiveDiagonalY
        ) {
          return this.isPathClear(fromRow, fromCol, toRow, toCol);
        }
        return false;

      case 'N':
        return (
          (positiveDiagonalX === 1 && positiveDiagonalY === 2) ||
          (positiveDiagonalX === 2 && positiveDiagonalY === 1)
        );

      case 'K':
        return positiveDiagonalX <= 1 && positiveDiagonalY <= 1;

      default:
        return false;
    }
  }

  movePiece(input: string): boolean {
    const parts = input.split(',');
    if (parts.length !== 2) {
      console.log('Invalid format. Use b2,b3');
      return false;
    }

    const from = this.parsePosition(parts[0]!.trim());
    const to = this.parsePosition(parts[1]!.trim());
    if (!from || !to) {
      console.log('Invalid coordinates.');
      return false;
    }

    const [fromRow, fromCol] = from;
    const [toRow, toCol] = to;
    const piece = this.board[fromRow]![fromCol];
    if (piece === ' ') {
      console.log('No piece at that position.');
      return false;
    }

    const target = this.board[toRow]![toCol];
    if (target !== ' ' && !this.isEnemy(piece!, target!)) {
      console.log('Cannot capture your own piece.');
      return false;
    }

    if (!this.isMoveValid(piece!, fromRow, fromCol, toRow, toCol)) {
      console.log(`Invalid move for ${piece}`);
      return false;
    }

    const captured = this.board[toRow]![toCol];
    this.board[toRow]![toCol]! = piece!;
    this.board[fromRow]![fromCol] = ' ';

    if (captured!.toLowerCase() === 'k') {
      console.log('King captured! Game over.');
      this.gameOver = true;
    }

    return true;
  }
}
