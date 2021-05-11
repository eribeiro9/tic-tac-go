import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import * as PIXI from 'pixi.js';
import { MarkTriple } from 'src/app/enums/mark-triple.enum';
import { MarkType } from '../../enums/mark-type.enum';
import { GameService } from '../../services/game/game.service';

@UntilDestroy()
@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayComponent implements AfterViewInit {

  private app?: PIXI.Application;
  private resources: any = {};
  private sprites: any = {};

  @ViewChild('renderSpace', { read: ElementRef }) private renderSpace!: ElementRef;

  constructor(
    private readonly router: Router,
    private readonly renderer: Renderer2,
    public readonly gameService: GameService,
  ) { }

  ngAfterViewInit(): void {
    this.setupPIXIApp();
  }

  goHome() {
    this.router.navigate(['']);
  }

  /** Sets up the PIXI.js canvas. One board with nine slots */
  private setupPIXIApp() {
    this.app = new PIXI.Application({ width: 256, height: 256, backgroundColor: 0xAAAAAA });
    this.renderer.appendChild(this.renderSpace.nativeElement, this.app.view);
    this.app.loader
      .add([
        { name: 'board', url: 'assets/img/tictactoe-board.png' },
        { name: 'o', url: 'assets/img/tictactoe-o.png' },
        { name: 'x', url: 'assets/img/tictactoe-x.png' },
      ])
      .load((loader, resources) => {
        this.resources = resources;

        this.setupBoard();
        this.forEachSlot((x, y, name) => this.setupSlot(x, y, name));

        this.watchGameState();
      });
  }

  /** Sets up the TicTacToe background board */
  private setupBoard() {
    this.sprites.board = new PIXI.Sprite(this.resources.board.texture);

    this.sprites.board.width = 256;
    this.sprites.board.height = 256;

    this.app?.stage.addChild(this.sprites.board);
  }

  /** Sets up an empty slot within the board */
  private setupSlot(x: number, y: number, name: string) {
    this.sprites[name] = new PIXI.Sprite();

    this.sprites[name].width = 76;
    this.sprites[name].height = 76;

    this.sprites[name].x = 90 * x;
    this.sprites[name].y = 90 * y;

    this.sprites[name].interactive = true;
    this.sprites[name].on('pointertap', () => this.gameService.tryMakeMove(x, y));

    this.app?.stage.addChild(this.sprites[name]);
  }

  /** Watches the global game state for updates */
  private watchGameState() {
    this.gameService.gameState.pipe(
      untilDestroyed(this),
    ).subscribe(state => {
      this.forEachSlot((x, y, name) => {
        switch (state.board[x][y]) {
          case MarkType.Blank:
            this.sprites[name].texture = null;
            break;
          case MarkType.O:
            this.sprites[name].texture = this.resources.o.texture;
            break;
          case MarkType.X:
            this.sprites[name].texture = this.resources.x.texture;
            break;
        }
      });

      for (const triple of state.winningTriples) {
        const lineInfo = this.getInfo(triple);
        const line = new PIXI.Graphics();
        line.lineStyle(6, 0x000000, 1);
        line.moveTo(0, 0);
        line.lineTo(lineInfo.deltaX, lineInfo.deltaY);
        line.x = lineInfo.posX;
        line.y = lineInfo.posY;
        this.app?.stage.addChild(line);
      }
    });
  }

  private forEachSlot(callback: (x: number, y: number, name: string) => void) {
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        const id = (x + 3 * y) + 1;
        const name = 'slot' + id;
        callback(x, y, name);
      }
    }
  }

  private getInfo(triple: MarkTriple) {
    switch (triple) {
      case MarkTriple.Row1:
        return { deltaX: 250, deltaY: 0, posX: 3, posY: 38 };
      case MarkTriple.Row2:
        return { deltaX: 250, deltaY: 0, posX: 3, posY: 128 };
      case MarkTriple.Row3:
        return { deltaX: 250, deltaY: 0, posX: 3, posY: 218 };
      case MarkTriple.Column1:
        return { deltaX: 0, deltaY: 250, posX: 38, posY: 3 };
      case MarkTriple.Column2:
        return { deltaX: 0, deltaY: 250, posX: 128, posY: 3 };
      case MarkTriple.Column3:
        return { deltaX: 0, deltaY: 250, posX: 218, posY: 3 };
      case MarkTriple.Diagonal1:
        return { deltaX: 250, deltaY: 250, posX: 3, posY: 3 };
      case MarkTriple.Diagonal2:
        return { deltaX: 250, deltaY: -250, posX: 3, posY: 253 };
      default:
        return { deltaX: 0, deltaY: 0, posX: 0, posY: 0 };
    }
  }

}
