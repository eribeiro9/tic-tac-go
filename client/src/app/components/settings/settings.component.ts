import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent implements OnInit {

  playerColor: string = '';

  constructor() { }

  ngOnInit(): void {
    this.playerColor = localStorage.getItem('playerColor') ?? '';
  }

  changeColor(hexColor: string) {
    this.playerColor = hexColor;
    localStorage.setItem('playerColor', hexColor);
  }

}
