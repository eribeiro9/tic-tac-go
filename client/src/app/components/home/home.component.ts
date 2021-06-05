import { ChangeDetectionStrategy, Component, HostListener, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MatchType } from '../../enums/match-type.enum';
import { PwaService } from '../../services/pwa/pwa.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {

  MatchType = MatchType;

  public promptEvent: any;
  public isConnected = new BehaviorSubject(false);

  constructor(
    private readonly pwaService: PwaService
  ) { }

  ngOnInit() {
    if (this.pwaService.updateAvailable) {
      window.location.reload();
    }

    this.pwaService.watchNetwork().pipe(
      tap(online => this.isConnected.next(online)),
    ).subscribe();
  }

  @HostListener('beforeinstallprompt', ['$event'])
  beforeInstallPrompt(event: any) {
    this.promptEvent = event;
  }

}
