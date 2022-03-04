import { Injectable } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { delay, filter, take, tap } from 'rxjs/operators';
import { Difficulty } from 'src/app/enums/difficulty.enum';
import { MarkType } from '../../enums/mark-type.enum';
import { MatchResult } from '../../enums/match-result.enum';
import { MatchType } from '../../enums/match-type.enum';
import { GameState } from '../../models/game-state.model';
import { RandomUtils } from '../../utils/random.utils';
import { RulesService } from '../rules/rules.service';
import { SocketService } from '../socket/socket.service';

const DEFAULT_ICON_COLOR = '#000000';

@UntilDestroy()
@Injectable({
  providedIn: 'root'
})
export class GameService {

  private subscriptions: Subscription[] = [];

  public gameState = new BehaviorSubject<GameState>(new GameState());
  public onStart = new Subject<void>();

  constructor(
    private readonly socketService: SocketService,
  ) { }

  public setupBotGame() {
    const { playerColor } = this.getPlayerSettings();
    this.gameState.next({
      matchType: MatchType.Bot,
      playerMark: RandomUtils.ChooseFrom(MarkType.O, MarkType.X),
      playerTurn: RandomUtils.ChooseFrom(false, true),
      playerColor,
      board: [
        [MarkType.Blank, MarkType.Blank, MarkType.Blank],
        [MarkType.Blank, MarkType.Blank, MarkType.Blank],
        [MarkType.Blank, MarkType.Blank, MarkType.Blank],
      ],
      colors: [
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
      ],
      result: MatchResult.None,
      winningTriples: [],
    });

    this.onStart.next();

    this.subscriptions.push(this.gameState.pipe(
      untilDestroyed(this),
      delay(350),
      filter(state => state.result === MatchResult.None && !state.playerTurn),
    ).subscribe(state => this.botTurn(state)));
  }

  public setupHumanGame() {
    this.subscriptions.push(this.socketService.onMessage.pipe(
      tap(message => {
        this.gameState.next({
          matchType: MatchType.Human,
          ...message,
        });
      }),
    ).subscribe());

    const settings = this.getPlayerSettings();
    this.subscriptions.push(this.socketService.connect(settings).pipe(
      take(1),
      tap(() => this.onStart.next()),
    ).subscribe());
  }

  private getPlayerSettings() {
    const playerColor = localStorage.getItem('playerColor') ?? '';
    return {
      playerColor,
    };
  }

  public tryMakeMove(x: number, y: number) {
    const state = this.gameState.value;
    if (RulesService.playerCanMove(state, x, y)) {
      if (state.matchType === MatchType.Bot) {
        this.applyMove(this.gameState.value, x, y, this.gameState.value.playerMark);
      } else {
        this.socketService.send({ x, y });
      }
    }
  }

  public end() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(s => s.unsubscribe());
      this.subscriptions = [];
    }

    this.socketService.disconnect();
  }

  private botTurn(state: GameState) {
    const difficulty: Difficulty = (localStorage.getItem('difficulty') || 'N') as Difficulty;
    const botMark = state.playerMark === MarkType.O ? MarkType.X : MarkType.O;
    const botMove = RulesService.botMove(state.board, botMark, difficulty);
    this.applyMove(state, botMove.x, botMove.y, botMark);
  }

  private applyMove(state: GameState, x: number, y: number, mark: MarkType) {
    state.board[y][x] = mark;
    const color = state.playerColor && mark === state.playerMark
      ? state.playerColor
      : DEFAULT_ICON_COLOR;
    state.colors[y][x] = color;

    state.playerTurn = !state.playerTurn;

    if (RulesService.boardComplete(state.board)) {
      const info = RulesService.getWinningInfo(state.board);
      if (info.tieGame) {
        state.result = MatchResult.Tie;
      } else if (info.winningMark === state.playerMark) {
        state.result = MatchResult.PlayerWon;
      } else {
        state.result = MatchResult.OtherWon;
      }
      state.winningTriples = info.winningTriples || [];
    }

    this.gameState.next(state);
  }

}
