import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import * as PIXI from 'pixi.js';
import { GameService } from '../../services/game/game.service';

@UntilDestroy()
@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayComponent implements AfterViewInit {

  private resources: any = {};
  private sprites: any = {};

  @ViewChild('renderSpace', { read: ElementRef }) private renderSpace!: ElementRef;

  constructor(
    private renderer: Renderer2,
    public gameService: GameService,
  ) { }

  ngAfterViewInit(): void {
    this.setupPIXIApp();
    this.watchGameState();
  }

  private setupPIXIApp() {
    let app = new PIXI.Application({ width: 256, height: 256, backgroundColor: 0xCCCCCC });
    this.renderer.appendChild(this.renderSpace.nativeElement, app.view);
    app.loader
      .add([
        { name: 'board', url: 'assets/img/tictactoe-board.png' },
        { name: 'o', url: 'assets/img/tictactoe-o.png' },
        { name: 'x', url: 'assets/img/tictactoe-x.png' },
      ])
      .load((loader, resources) => {
        this.resources = resources;
        this.setupBoard(app);

        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            this.setupSlot(i, j, app);
          }
        }
      });
  }

  private setupBoard(app: PIXI.Application) {
    this.sprites.board = new PIXI.Sprite(this.resources.board.texture);

    this.sprites.board.width = 256;
    this.sprites.board.height = 256;

    app.stage.addChild(this.sprites.board);
  }

  private setupSlot(x: number, y: number, app: PIXI.Application) {
    const id = (x + 3 * y) + 1;
    const name = 'slot' + id;

    this.sprites[name] = new PIXI.Sprite();

    this.sprites[name].width = 76;
    this.sprites[name].height = 76;

    this.sprites[name].x = 90 * x;
    this.sprites[name].y = 90 * y;

    this.sprites[name].interactive = true;
    this.sprites[name].on('pointertap', () => this.clickSlot(name, x, y));

    app.stage.addChild(this.sprites[name]);
  }

  private clickSlot(name: string, x: number, y: number) {
    console.log(name, x, y);
    // this.sprites[name].texture = this.resources.o.texture;

    // call gameService
  }

  private watchGameState() {
    this.gameService.gameState.pipe(
      untilDestroyed(this),
    ).subscribe(state => {
      console.log('UPDATE', state);
    });
  }

}
