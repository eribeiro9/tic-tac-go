import { MarkType } from '../enums/mark-type.enum';
import { MatchType } from '../enums/match-type.enum';

export class GameState {
  public matchType: MatchType;
  public playerMark: MarkType;
  public playerTurn: boolean;

  constructor() {
    this.matchType = MatchType.Bot;
    this.playerMark = MarkType.O;
    this.playerTurn = true;
  }
}
