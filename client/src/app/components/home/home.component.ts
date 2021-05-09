import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatchType } from '../../enums/match-type.enum';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {

  constructor(
    private readonly router: Router,
  ) { }

  // TODO: move to routerLink
  vsHuman() {
    this.router.navigate(['lobby'], { queryParams: { match: MatchType.Human } });
  }

  vsBot() {
    this.router.navigate(['lobby'], { queryParams: { match: MatchType.Bot } });
  }

}
