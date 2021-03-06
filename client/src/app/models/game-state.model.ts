import { MarkTriple } from '../enums/mark-triple.enum';
import { MarkType } from '../enums/mark-type.enum';
import { MatchResult } from '../enums/match-result.enum';
import { MatchType } from '../enums/match-type.enum';

export class GameState {
  public matchType: MatchType;
  public playerMark: MarkType;
  public playerTurn: boolean;
  public playerColor: string;
  public board: MarkType[][];
  public colors: string[][];
  public result: MatchResult;
  public winningTriples: MarkTriple[];

  constructor() {
    this.matchType = MatchType.Bot;
    this.playerMark = MarkType.O;
    this.playerTurn = true;
    this.playerColor = '';
    this.board = [
      [MarkType.Blank, MarkType.Blank, MarkType.Blank],
      [MarkType.Blank, MarkType.Blank, MarkType.Blank],
      [MarkType.Blank, MarkType.Blank, MarkType.Blank],
    ];
    this.colors = [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ];
    this.result = MatchResult.None;
    this.winningTriples = [];
  }
}
