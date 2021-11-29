import { Injectable } from '@nestjs/common';
import { SocketBase } from '../bases/socket.base';
import { MarkType } from '../enums/mark-type.enum';
import { MatchResult } from '../enums/match-result.enum';
import { GameState } from '../models/game-state.model';
import { PlayerRepository } from '../repositories/player.repository';
import { RequestRepository } from '../repositories/request.repository';
import { GameService } from './game.service';

@Injectable()
export class SocketService extends SocketBase {

  constructor(
    private readonly requestRepo: RequestRepository,
    private readonly playerRepo: PlayerRepository,
    private readonly gameService: GameService,
  ) {
    super();
  }

  public async connect(connectionId: string): Promise<void> {
    try {
      console.log('Connecting', connectionId);
      const requests = await this.requestRepo.getAll();
      if (requests && requests.length > 0) {
        const requestConnectionId = requests[0];
        console.log('Found existing request from', requestConnectionId);

        const { gameId } = await this.gameService.create(connectionId, requestConnectionId);
        console.log('Created new game', gameId);

        await Promise.all([
          this.playerRepo.create(connectionId, gameId),
          this.playerRepo.create(requestConnectionId, gameId),
          this.requestRepo.delete(requestConnectionId),
        ]);
        console.log('Created players and removed request');
      } else {
        console.log('No existing request. Creating new one');
        await this.requestRepo.create(connectionId);
      }
    } catch (ex) {
      console.error(ex);
      throw ex;
    }
  }

  public async getDataOnConnect(connectionId: string): Promise<void> {
    try {
      console.log('Checking In', connectionId);

      const player = await this.playerRepo.get(connectionId);
      if (player && player.gameId) {
        console.log('Found player in game', player.gameId);

        const game = await this.gameService.get(player.gameId);
        if (game && game.state) {
          console.log('Found game. Updating players with state');

          await this.emitState(game.state);
        }
      }
    } catch (ex) {
      console.error(ex);
      throw ex;
    }
  }

  public async tryMakeMove(connectionId: string, x: number, y: number): Promise<void> {
    try {
      console.log('Player trying to make a move', connectionId, x, y);

      const player = await this.playerRepo.get(connectionId);
      if (player) {
        console.log('Found player in game', player.gameId);

        const game = await this.gameService.get(player.gameId);
        if (game && game.state) {
          console.log('Found game. Checking player move');

          const { valid, gameState } = await this.gameService.play(game, connectionId, x, y);
          console.log('valid', valid);

          if (valid && gameState) {
            await this.emitState(gameState);
          }
        }
      }
    } catch (ex) {
      console.error(ex);
      throw ex;
    }
  }

  public async disconnect(connectionId: string): Promise<void> {
    try {
      console.log('Disconnecting', connectionId);

      const player = await this.playerRepo.get(connectionId);
      if (player) {
        console.log('Found player in game', player.gameId);

        const game = await this.gameService.get(player.gameId);
        if (game && game.state) {
          console.log('Found game. Updating players with state');

          if (game.state.result === MatchResult.None) {
            console.log('Game still in progress. Setting winner.');
            const winner = connectionId === game.state.connections.o ? MarkType.X : MarkType.O;
            game.state.result = winner === MarkType.O ? MatchResult.OWon : MatchResult.XWon;
          }

          await Promise.all([
            this.gameService.delete(game.gameId),
            this.playerRepo.delete(game.state.connections.o),
            this.playerRepo.delete(game.state.connections.x),
            this.emitState(game.state),
          ]);
        }
      } else {
        await this.requestRepo.delete(connectionId);
      }
    } catch (ex) {
      console.error(ex);
      throw ex;
    }
  }

  private emitState(state: GameState) {
    if (state && state.connections) {
      return Promise.all([
        this.emit(state.connections.o, GameState.toClientFacing(state, state.connections.o)),
        this.emit(state.connections.x, GameState.toClientFacing(state, state.connections.x)),
      ]);
    }
  }

}
