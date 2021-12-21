import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { UntilDestroy } from '@ngneat/until-destroy';
import { MarkTriple } from '../../enums/mark-triple.enum';
import { MarkType } from '../../enums/mark-type.enum';
import { MatchResult } from '../../enums/match-result.enum';
import { MatchType } from '../../enums/match-type.enum';
import { GameService } from '../../services/game/game.service';

@UntilDestroy()
@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayComponent implements OnDestroy {

  MatchResult = MatchResult;
  MatchType = MatchType;
  MarkType = MarkType;
  MarkTriple = MarkTriple;

  constructor(
    private readonly router: Router,
    public readonly gameService: GameService,
  ) { }

  ngOnDestroy() {
    this.gameService.end();
  }

  goHome() {
    this.router.navigate(['']);
  }

}
