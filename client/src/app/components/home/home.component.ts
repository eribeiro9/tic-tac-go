import { ChangeDetectionStrategy, Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatchType } from '../../enums/match-type.enum';
import { PwaService } from '../../services/pwa/pwa.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {

  public promptEvent: any;

  constructor(
    private readonly router: Router,
    public readonly pwaService: PwaService
  ) { }

  ngOnInit() {
    if (this.pwaService.updateAvailable) {
      window.location.reload();
    }
  }

  @HostListener('beforeinstallprompt', ['$event'])
  beforeInstallPrompt(event: any) {
    this.promptEvent = event;
  }

  // TODO: move to routerLink
  vsHuman() {
    this.router.navigate(['lobby'], { queryParams: { match: MatchType.Human } });
  }

  vsBot() {
    this.router.navigate(['lobby'], { queryParams: { match: MatchType.Bot } });
  }

}
