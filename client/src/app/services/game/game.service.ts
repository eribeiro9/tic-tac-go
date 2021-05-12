import { Injectable } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, Subject } from 'rxjs';
import { delay, filter, tap } from 'rxjs/operators';
import { MarkType } from '../../enums/mark-type.enum';
import { MatchType } from '../../enums/match-type.enum';
import { GameState } from '../../models/game-state.model';
import { RandomUtils } from '../../utils/random.utils';
import { RulesService } from '../rules/rules.service';
import { SocketService } from '../socket/socket.service';

@UntilDestroy()
@Injectable({
  providedIn: 'root'
})
export class GameService {

  public gameState = new BehaviorSubject<GameState>(new GameState());
  public onStart = new Subject<void>();

  constructor(
    private readonly socketService: SocketService,
  ) { }

  public setupBotGame() {
    this.gameState.next({
      matchType: MatchType.Bot,
      playerMark: RandomUtils.ChooseFrom(MarkType.O, MarkType.X),
      playerTurn: RandomUtils.ChooseFrom(false, true),
      board: [
        [MarkType.Blank, MarkType.Blank, MarkType.Blank],
        [MarkType.Blank, MarkType.Blank, MarkType.Blank],
        [MarkType.Blank, MarkType.Blank, MarkType.Blank],
      ],
      ended: false,
      playerWon: false,
      winningTriples: [],
    });

    this.onStart.next();

    this.gameState.pipe(
      untilDestroyed(this),
      delay(350),
      filter(state => !state.ended && !state.playerTurn),
      tap(() => console.log('bot taking turn'))
    ).subscribe(state => this.botTurn(state));
  }

  public setupHumanGame() {
    // socket service
  }

  public tryMakeMove(x: number, y: number) {
    const state = this.gameState.value;
    if (RulesService.playerCanMove(state, x, y)) {
      if (state.matchType === MatchType.Bot) {
        this.applyMove(this.gameState.value, x, y, this.gameState.value.playerMark);
      } else {
        // human game, call websockets
      }
    }
  }

  private botTurn(state: GameState) {
    const botMark = state.playerMark === MarkType.O ? MarkType.X : MarkType.O;
    const botMove = RulesService.botMove(state.board, botMark);
    this.applyMove(state, botMove.x, botMove.y, botMark);
  }

  private applyMove(state: GameState, x: number, y: number, mark: MarkType) {
    state.board[y][x] = mark;
    state.playerTurn = !state.playerTurn;
    if (RulesService.boardComplete(state.board)) {
      const info = RulesService.getWinningInfo(state.board);
      state.ended = true;
      state.playerWon = state.playerMark === info?.winningMark;
      state.winningTriples = info?.winningTriples || [];
    }
    this.gameState.next(state);
  }

}
