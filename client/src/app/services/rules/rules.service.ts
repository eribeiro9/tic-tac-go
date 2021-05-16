import { MarkTriple } from '../../enums/mark-triple.enum';
import { MarkType } from '../../enums/mark-type.enum';
import { MatchResult } from '../../enums/match-result.enum';
import { GameState } from '../../models/game-state.model';
import { WinningInfo } from '../../models/winning-info.model';

const BOARD_TRIPLES = [
  { name: MarkTriple.Row1, positions: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }] },
  { name: MarkTriple.Row2, positions: [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }] },
  { name: MarkTriple.Row3, positions: [{ x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }] },

  { name: MarkTriple.Column1, positions: [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }] },
  { name: MarkTriple.Column2, positions: [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }] },
  { name: MarkTriple.Column3, positions: [{ x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 2 }] },

  { name: MarkTriple.Diagonal1, positions: [{ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 2 }] },
  { name: MarkTriple.Diagonal2, positions: [{ x: 2, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 2 }] },
];

export class RulesService {

  /**
   * Gets the "opposite" mark. O -> X, X -> O, Blank -> Blank.
   */
  public static oppositeMark(mark: MarkType): MarkType {
    switch (mark) {
      case MarkType.O:
        return MarkType.X;
      case MarkType.X:
        return MarkType.O;
      default:
        return MarkType.Blank;
    }
  }

  public static playerCanMove(state: GameState, x: number, y: number): boolean {
    return state.result === MatchResult.None && state.playerTurn && state.board[y][x] === MarkType.Blank;
  }

  public static botMove(board: MarkType[][], botMark: MarkType): { x: number, y: number } {
    // Get all triples with atleast one blank
    const triples = RulesService.getTriples(board).filter(t => t.value.includes(MarkType.Blank));

    // Get any doubles that can win the game
    const botDoubles = triples.filter(t => t.value.filter(x => x === botMark).length === 2);
    if (botDoubles && botDoubles.length > 0) {
      return botDoubles[0].positions[botDoubles[0].value.indexOf(MarkType.Blank)];
    }

    // Get any player doubles that can prevent losing
    const playerDoubles = triples.filter(t => t.value.filter(x => x === RulesService.oppositeMark(botMark)).length === 2);
    if (playerDoubles && playerDoubles.length > 0) {
      return playerDoubles[0].positions[playerDoubles[0].value.indexOf(MarkType.Blank)];
    }

    // Get any singles that can become doubles
    const botSingles = triples.filter(t => t.value.filter(x => x === botMark).length === 1 && t.value.filter(x => x === MarkType.Blank).length === 2);
    if (botSingles && botSingles.length > 0) {
      return botSingles[0].positions[botSingles[0].value.indexOf(MarkType.Blank)];
    }

    // Otherwise, place a random mark
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        if (board[y][x] === MarkType.Blank) {
          return { x, y };
        }
      }
    }
    return { x: 0, y: 0 };
  }

  public static getTriples(board: MarkType[][]): { name: MarkTriple, value: MarkType[], positions: any[] }[] {
    return BOARD_TRIPLES.map(t => ({
      name: t.name,
      positions: t.positions,
      value: t.positions.map(p => board[p.y][p.x]),
    }));
  }

  /**
   * Checks if a game board is complete or not
   * @param board Game board to check
   * @returns True/false if at least one three-in-a-row
   */
  public static boardComplete(board: MarkType[][]): boolean {
    const threeInRow = this.getTriples(board)
      .some(x => RulesService.tripleComplete(x.value));

    if (threeInRow) {
      return true;
    }

    const boardFull = board
      .reduce((acc, val) => acc.concat(val), [])
      .every(b => b !== MarkType.Blank);

    return boardFull;
  }

  public static getWinningInfo(board: MarkType[][]): WinningInfo {
    const winningTriples = this.getTriples(board)
      .filter(x => RulesService.tripleComplete(x.value));

    if (winningTriples && winningTriples.length > 0) {
      return { winningMark: winningTriples[0].value[0], winningTriples: winningTriples.map(w => w.name), tieGame: false };
    } else {
      return { tieGame: true, winningMark: MarkType.Blank, winningTriples: [] };
    }
  }

  /**
   * Checks if three marks are marked the same
   * @param threeSlots An array of three marks to check
   * @returns True/false if all three marks are same and not blank
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
