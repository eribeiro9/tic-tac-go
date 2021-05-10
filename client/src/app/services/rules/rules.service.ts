import { MarkTriple } from '../../enums/mark-triple.enum';
import { MarkType } from '../../enums/mark-type.enum';
import { GameState } from '../../models/game-state.model';
import { WinningInfo } from '../../models/winning-info.model';

export class RulesService {

  public static playerCanMove(state: GameState, x: number, y: number) {
    return !state.ended && state.playerTurn && state.board[x][y] === MarkType.Blank;
  }

  public static botMove(board: MarkType[][], botMark: MarkType): { x: number, y: number } {
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        if (board[x][y] === MarkType.Blank) {
          return { x, y };
        }
      }
    }
    return { x: 0, y: 0 };
  }

  public static getTriples(board: MarkType[][]) {
    return [
      { name: MarkTriple.Row1, value: [board[0][0], board[1][0], board[2][0]] },
      { name: MarkTriple.Row2, value: [board[0][1], board[1][1], board[2][1]] },
      { name: MarkTriple.Row3, value: [board[0][2], board[1][2], board[2][2]] },

      { name: MarkTriple.Column1, value: [board[0][0], board[0][1], board[0][2]] },
      { name: MarkTriple.Column2, value: [board[1][0], board[1][1], board[1][2]] },
      { name: MarkTriple.Column3, value: [board[2][0], board[2][1], board[2][2]] },

      { name: MarkTriple.Diagonal1, value: [board[0][0], board[1][1], board[2][2]] },
      { name: MarkTriple.Diagonal2, value: [board[2][0], board[1][1], board[0][2]] },
    ];
  }

  public static boardComplete(board: MarkType[][]): boolean {
    return this.getTriples(board)
      .some(x => RulesService.tripleComplete(x.value));
  }

  public static getWinningInfo(board: MarkType[][]): WinningInfo | null {
    const winningTriples = this.getTriples(board)
      .filter(x => RulesService.tripleComplete(x.value));

    if (winningTriples && winningTriples.length > 0) {
      return { winningMark: winningTriples[0].value[0], winningTriples: winningTriples.map(w => w.name) };
    }
    return null;
  }

  /**
   * Returns if three marks are marked the same
   * @param threeSlots An array of three marks to check
   */
  public static tripleComplete(threeSlots: MarkType[]): boolean {
    if (!threeSlots || threeSlots.length != 3) {
      return false;
    }

    if (threeSlots.some(s => s === MarkType.Blank)) {
      return false;
    }
    return threeSlots.every(s => s === threeSlots[0]);
  }

}
