import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-postgame',
  templateUrl: './postgame.component.html',
  styleUrls: ['./postgame.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostgameComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
