import { Injectable } from '@nestjs/common';
import { SocketBase } from '../bases/socket.base';
import { MarkType } from '../enums/mark-type.enum';
import { MatchResult } from '../enums/match-result.enum';
import { GameState } from '../models/game-state.model';
import { GameRequest } from '../models/request.model';
import { PlayerRepository } from '../repositories/player.repository';
import { RequestRepository } from '../repositories/request.repository';
import { RandomUtils } from '../utils/random.utils';
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
      await this.playerRepo.create(connectionId);
    } catch (ex) {
      console.error(ex);
      throw ex;
    }
  }

  public async updateSettings(connectionId: string, playerColor: string): Promise<void> {
    try {
      console.log('Update Settings', connectionId);
      const player = await this.playerRepo.get(connectionId);
      if (player) {
        console.log('Found player record. Saving color', playerColor);
        await this.playerRepo.updateSettings(connectionId, playerColor);
      } else {
        console.warn('No player record found');
      }
    } catch (ex) {
      console.error(ex);
      throw ex;
    }
  }

  public async joinPublic(connectionId: string): Promise<void> {
    try {
      console.log('Join public', connectionId);
      const requests = await this.requestRepo.getAllPublic();
      if (requests && requests.length > 0) {
        const request = RandomUtils.chooseFrom(...requests);
        console.log('Found existing request from', request.connectionId);
        await this.setupGame(connectionId, request);
      } else {
        console.log('No existing request. Creating new one');
        await this.requestRepo.createPublic(connectionId);
      }
    } catch (ex) {
      console.error(ex);
      throw ex;
    }
  }

  public async hostPrivate(connectionId: string): Promise<void> {
    try {
      console.log('Host private', connectionId);
      const gameCode = await this.requestRepo.createPrivate(connectionId);
      await this.emit(connectionId, { type: 'host', gameCode });
    } catch (ex) {
      console.error(ex);
      throw ex;
    }
  }

  public async joinPrivate(connectionId: string, gameCode: string): Promise<void> {
    try {
      console.log('Join private', connectionId, gameCode);
      const request = await this.requestRepo.getPrivate(gameCode);
      await this.setupGame(connectionId, request);
    } catch (ex) {
      console.error(ex);
      throw ex;
    }
  }

  private async setupGame(connectionId: string, request: GameRequest) {
    try {
      if (request) {
        const [player, requestPlayer] = await Promise.all([
          this.playerRepo.get(connectionId),
          this.playerRepo.get(request.connectionId),
        ]);
        if (player && requestPlayer) {
          const { gameId, gameState } = await this.gameService.create({
            id: player.connectionId,
            color: player.playerColor,
          }, {
            id: requestPlayer.connectionId,
            color: requestPlayer.playerColor,
          });
          console.log('Created new game', gameId);

          await Promise.all([
            this.playerRepo.updateGameId(player.connectionId, gameId),
            this.playerRepo.updateGameId(requestPlayer.connectionId, gameId),
            this.requestRepo.delete(request.connectionId, request.gameCode),
            this.emitState(gameState, true),
          ]);
          console.log('Updated players and removed request');
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
        if (player.gameId) {
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
          await this.playerRepo.delete(connectionId);
          await this.requestRepo.delete(connectionId);
        }
      } else {
        await this.requestRepo.delete(connectionId);
      }
    } catch (ex) {
      console.error(ex);
      throw ex;
    }
  }

  private async emitState(state: GameState, sendStart = false) {
    if (state && state.connections) {
      if (sendStart) {
        await Promise.all([
          this.emit(state.connections.o, { type: 'start' }),
          this.emit(state.connections.x, { type: 'start' }),
        ]);
      }

      return Promise.all([
        this.emit(state.connections.o, GameState.toClientFacing(state, state.connections.o)),
        this.emit(state.connections.x, GameState.toClientFacing(state, state.connections.x)),
      ]);
    }
  }

}
