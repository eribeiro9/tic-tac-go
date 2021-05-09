import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatchType } from '../../enums/match-type.enum';
import { GameService } from '../../services/game/game.service';
import { SocketService } from '../../services/socket/socket.service';

@UntilDestroy()
@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LobbyComponent implements OnInit {

  public vsHuman = new BehaviorSubject<boolean>(false);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly socketService: SocketService,
    private readonly gameService: GameService,
  ) { }

  ngOnInit(): void {
    this.waitForGameStart();
    this.setupGame();
  }

  back() {
    this.router.navigate(['']);
  }

  private waitForGameStart() {
    this.gameService.onStart.pipe(
      untilDestroyed(this),
    ).subscribe(() => this.router.navigate(['play']));
  }

  private setupGame() {
    this.route.queryParams.pipe(
      untilDestroyed(this),
      map(params => params && params.match === MatchType.Human),
    ).subscribe(isHuman => {
      this.vsHuman.next(isHuman);
      if (isHuman) {
        // start up socket stuff
      } else {
        this.gameService.setupBotGame();
      }
    });
  }

}
