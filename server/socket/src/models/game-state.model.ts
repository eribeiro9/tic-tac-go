import { MarkTriple } from '../enums/mark-triple.enum';
import { MarkType } from '../enums/mark-type.enum';
import { ClientMatchResult, MatchResult } from '../enums/match-result.enum';
import { WinningInfo } from './winning-info.model';

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

export class GameState {
  board: MarkType[][];
  turn: MarkType.O | MarkType.X;
  connections: {
    o: string;
    x: string;
  };
  result: MatchResult;
  winningTriples: MarkTriple[];

  public static toClientFacing(state: GameState, connectionId: string) {
    let playerMark = MarkType.Blank;
    if (connectionId === state.connections.o) {
      playerMark = MarkType.O;
    } else if (connectionId === state.connections.x) {
      playerMark = MarkType.X;
    }

    return {
      board: state.board,
      playerMark,
      playerTurn: state.result === MatchResult.None && state.turn === playerMark,
      result: GameState.resultToClient(state.result, playerMark),
      winningTriples: state.winningTriples,
    };
  }

  public static canPlay(state: GameState, mark: MarkType, x: number, y: number) {
    return state.result === MatchResult.None && state.turn === mark && state.board[y][x] === MarkType.Blank;
  }

  public static resultToClient(result: MatchResult, playerMark: MarkType): ClientMatchResult {
    switch (result) {
      case MatchResult.None:
        return ClientMatchResult.None;
      case MatchResult.Tie:
        return ClientMatchResult.Tie;
      case MatchResult.OWon:
        return playerMark === MarkType.O ? ClientMatchResult.PlayerWon : ClientMatchResult.OtherWon;
      case MatchResult.XWon:
        return playerMark === MarkType.X ? ClientMatchResult.PlayerWon : ClientMatchResult.OtherWon;
    }
  }

  public static boardComplete(board: MarkType[][]): boolean {
    const threeInRow = this.getTriples(board)
      .some(x => GameState.tripleComplete(x.value));

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
      .filter(x => GameState.tripleComplete(x.value));

    if (winningTriples && winningTriples.length > 0) {
      return { winningMark: winningTriples[0].value[0], winningTriples: winningTriples.map(w => w.name), tieGame: false };
    } else {
      return { tieGame: true, winningMark: MarkType.Blank, winningTriples: [] };
    }
  }

  public static tripleComplete(threeSlots: MarkType[]): boolean {
    if (!threeSlots || threeSlots.length != 3) {
      return false;
    }

    if (threeSlots.some(s => s === MarkType.Blank)) {
      return false;
    }
    return threeSlots.every(s => s === threeSlots[0]);
  }

  public static getTriples(board: MarkType[][]): { name: MarkTriple, value: MarkType[], positions: any[] }[] {
    return BOARD_TRIPLES.map(t => ({
      name: t.name,
      positions: t.positions,
      value: t.positions.map(p => board[p.y][p.x]),
    }));
  }
}
