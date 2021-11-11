import { Module } from '@nestjs/common';
import { SocketController } from './controllers/socket.controller';
import { GameRepository } from './repositories/game.repository';
import { PlayerRepository } from './repositories/player.repository';
import { RequestRepository } from './repositories/request.repository';
import { GameService } from './services/game.service';
import { SocketService } from './services/socket.service';

const SHARED_COMPONENTS = [
  SocketController,
  GameService,
  SocketService,
  GameRepository,
  PlayerRepository,
  RequestRepository,
];

@Module({
  providers: [...SHARED_COMPONENTS],
})
export class AppModule { }
