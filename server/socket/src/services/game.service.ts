import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { MarkType } from '../enums/mark-type.enum';
import { MatchResult } from '../enums/match-result.enum';
import { DEFAULT_ICON_COLOR, GameState } from '../models/game-state.model';
import { Game } from '../models/game.model';
import { GameRepository } from '../repositories/game.repository';
import { RandomUtils } from '../utils/random.utils';

export class GameCreate {
  id: string;
  color: string;
}

@Injectable()
export class GameService {

  constructor(
    private readonly gameRepo: GameRepository,
  ) { }

  public get(gameId: string): Promise<Game> {
    return this.gameRepo.get(gameId);
  }

  public async create(connectionInfo1: GameCreate, connectionInfo2: GameCreate): Promise<{
    gameId: string,
    gameState: GameState,
  }> {
    try {
      const gameId = uuidv4();
      const conn1IsO = RandomUtils.chooseFrom(true, false);
      const gameState: GameState = {
        turn: RandomUtils.chooseFrom(MarkType.O, MarkType.X),
        connections: {
          o: conn1IsO ? connectionInfo1.id : connectionInfo2.id,
          x: !conn1IsO ? connectionInfo1.id : connectionInfo2.id,
        },
        playerColors: {
          o: conn1IsO ? connectionInfo1.color : connectionInfo2.color,
          x: !conn1IsO ? connectionInfo1.color : connectionInfo2.color,
        },
        board: [
          [MarkType.Blank, MarkType.Blank, MarkType.Blank],
          [MarkType.Blank, MarkType.Blank, MarkType.Blank],
          [MarkType.Blank, MarkType.Blank, MarkType.Blank],
        ],
        colors: [
          ['', '', ''],
          ['', '', ''],
          ['', '', ''],
        ],
        result: MatchResult.None,
        winningTriples: [],
      };

      await this.gameRepo.create(gameId, gameState);

      return { gameId, gameState };
    } catch (ex) {
      console.error(ex);
      throw ex;
    }
  }

  public async play(game: Game, connectionId: string, x: number, y: number): Promise<{
    valid: boolean,
    gameState?: GameState,
  }> {
    try {
      const mark = game.state.connections.o === connectionId ? MarkType.O : MarkType.X;
      const color = mark === MarkType.O ? game.state.playerColors.o : game.state.playerColors.x;
      if (GameState.canPlay(game.state, mark, x, y)) {
        game.state.board[y][x] = mark;
        game.state.colors[y][x] = color || DEFAULT_ICON_COLOR;
        game.state.turn = game.state.turn === MarkType.O ? MarkType.X : MarkType.O;
        if (GameState.boardComplete(game.state.board)) {
          const info = GameState.getWinningInfo(game.state.board);
          if (info.tieGame) {
            game.state.result = MatchResult.Tie;
          } else if (info.winningMark === MarkType.O) {
            game.state.result = MatchResult.OWon;
          } else if (info.winningMark === MarkType.X) {
            game.state.result = MatchResult.XWon;
          }
          game.state.winningTriples = info.winningTriples || [];
        }

        await this.gameRepo.save(game.gameId, game.state);

        return { valid: true, gameState: game.state };
      }
      return { valid: false };
    } catch (ex) {
      console.error(ex);
      throw ex;
    }
  }

  public delete(gameId: string): Promise<void> {
    return this.gameRepo.delete(gameId);
  }

}
