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

    switch (event.requestContext.routeKey) {
      case 'getDataOnConnect':
        const playerColor = body.playerColor;
        await this.socketService.getDataOnConnect(event.requestContext.connectionId, playerColor);
        break;
      case 'sendMessage':
        const x = body.x ?? 0;
        const y = body.y ?? 0;
        await this.socketService.tryMakeMove(event.requestContext.connectionId, x, y);
        break;
      default:
        console.warn('Unhandled Message', event.requestContext.routeKey, event.requestContext.connectionId);
        break;
    }
  }
}
