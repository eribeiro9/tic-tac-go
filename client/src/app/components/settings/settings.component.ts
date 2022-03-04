import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Difficulty } from '../../enums/difficulty.enum';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent implements OnInit {

  playerColor: string = '';
  difficulty: Difficulty = Difficulty.Normal;

  Difficulty = Difficulty;

  constructor() { }

  ngOnInit(): void {
    this.playerColor = localStorage.getItem('playerColor') ?? '';
    this.difficulty = (localStorage.getItem('difficulty') ?? 'N') as Difficulty;
  }

  changeColor(hexColor: string) {
    this.playerColor = hexColor;
    localStorage.setItem('playerColor', hexColor);
  }

  changeDifficulty(level: Difficulty) {
    this.difficulty = level;
    localStorage.setItem('difficulty', level);
  }

}
