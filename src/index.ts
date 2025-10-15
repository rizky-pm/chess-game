import readline from 'readline';
import { ChessGame } from './chess.js';

const game = new ChessGame();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('Start game');
game.printBoard();

function promptMove() {
  if (game.gameOver) {
    rl.close();
    return;
  }

  rl.question('Enter your move (example: b2,b3): ', (input) => {
    game.movePiece(input);
    game.printBoard();
    promptMove();
  });
}

promptMove();
