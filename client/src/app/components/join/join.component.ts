import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import * as QRCode from 'qrcode';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { GameService } from '../../services/game/game.service';

@UntilDestroy()
@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JoinComponent implements OnInit {

  public gameCode = new BehaviorSubject<string>('');
  public joinUrl = new BehaviorSubject<string>('');
  public qrUrl = new BehaviorSubject<string>('');
  public code = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly gameService: GameService,
  ) { }

  ngOnInit(): void {
    this.waitForGameStart();
    this.setupGame();
  }

  back() {
    this.gameService.end();
    this.router.navigate(['']);
  }

  type(event: string) {
    if (event.length === 4) {
      this.gameService.joinPrivateGame(event);
    }
  }

  copy(url: string) {
    if (url && navigator?.clipboard) {
      navigator.clipboard.writeText(url);
    }
  }

  private waitForGameStart() {
    this.gameService.onStart.pipe(
      untilDestroyed(this),
    ).subscribe(() => this.router.navigate(['play']));
  }

  private setupGame() {
    this.route.queryParams.pipe(
      untilDestroyed(this),
      map(params => params?.code),
    ).subscribe(code => {
      if (code?.length === 4) {
        this.gameService.joinPrivateGame(code);
      } else {
        this.gameService.setupPrivateGame().subscribe(newCode => {
          this.gameCode.next(newCode);
          const url = environment.baseUrl + '/join?code=' + newCode;
          this.joinUrl.next(url);
          this.qrUrl.next('');
          QRCode.toDataURL(url, {}, (err, qrDataUrl) => {
            if (!err) {
              this.qrUrl.next(qrDataUrl);
            }
          });
        });
      }
    });
  }

}
