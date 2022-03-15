import { Injectable } from '@nestjs/common';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { SocketService } from '../services/socket.service';

@Injectable()
export class SocketController {

  constructor(
    private readonly socketService: SocketService,
  ) { }

  async handleEvent(event: APIGatewayProxyEvent) {
    switch (event.requestContext.eventType) {
      case 'CONNECT':
        await this.socketService.connect(event.requestContext.connectionId);
        break;
      case 'MESSAGE':
        await this.handleMessage(event);
        break;
      case 'DISCONNECT':
        await this.socketService.disconnect(event.requestContext.connectionId);
        break;
      default:
        console.warn('Unhandled Event', event.requestContext.eventType, event.requestContext.connectionId);
        break;
    }
  }

  private async handleMessage(event: APIGatewayProxyEvent) {
    const body = JSON.parse(event.body);
    console.log('body', body);

    if (event.requestContext.routeKey === 'sendMessage') {
      switch (body.type) {
        case 'settings':
          const playerColor = body.playerColor;
          await this.socketService.updateSettings(event.requestContext.connectionId, playerColor);
          break;
        case 'random':
          await this.socketService.joinPublic(event.requestContext.connectionId);
          break;
        case 'host':
          await this.socketService.hostPrivate(event.requestContext.connectionId);
          break;
        case 'join':
          const gameCode = this.cleanGameCode(body.gameCode);
          await this.socketService.joinPrivate(event.requestContext.connectionId, gameCode);
          break;
        case 'play':
          const x = body.x ?? 0;
          const y = body.y ?? 0;
          await this.socketService.tryMakeMove(event.requestContext.connectionId, x, y);
          break;
        default:
          console.warn('Unhandled Message Body', body.type, event.requestContext.connectionId);
          break;
      }
    } else {
      console.warn('Unhandled Message', event.requestContext.routeKey, event.requestContext.connectionId);
    }
  }

  private cleanGameCode(dirtyCode: string): string {
    return dirtyCode.trim().substring(0, 4).toUpperCase();
  }
}
