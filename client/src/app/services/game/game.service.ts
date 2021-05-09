import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { MarkType } from '../../enums/mark-type.enum';
import { MatchType } from '../../enums/match-type.enum';
import { GameState } from '../../models/game-state.model';
import { RulesService } from '../rules/rules.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  public gameState = new BehaviorSubject<GameState>(new GameState());
  public onStart = new Subject<void>();

  constructor(
    private readonly rulesService: RulesService,
  ) { }

  setupBotGame() {
    this.gameState.next({
      matchType: MatchType.Bot,
      playerMark: MarkType.O, // RandomUtils.ChooseFrom(MarkType.O, MarkType.X),
      playerTurn: true, // RandomUtils.ChooseFrom(false, true),
    });

    this.onStart.next();
  }

  // make move

}
