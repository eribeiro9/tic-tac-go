import { MarkTriple } from '../enums/mark-triple.enum';
import { MarkType } from '../enums/mark-type.enum';
import { MatchType } from '../enums/match-type.enum';

export class GameState {
  public matchType: MatchType;
  public playerMark: MarkType;
  public playerTurn: boolean;
  public board: MarkType[][];
  public ended: boolean;
  public playerWon: boolean;
  public winningTriples: MarkTriple[];

  constructor() {
    this.matchType = MatchType.Bot;
    this.playerMark = MarkType.O;
    this.playerTurn = true;
    this.board = [
      [MarkType.Blank, MarkType.Blank, MarkType.Blank],
      [MarkType.Blank, MarkType.Blank, MarkType.Blank],
      [MarkType.Blank, MarkType.Blank, MarkType.Blank],
    ];
    this.ended = false;
    this.playerWon = false;
    this.winningTriples = [];
  }
}
