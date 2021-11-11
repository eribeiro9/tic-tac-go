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
    switch (event.requestContext.routeKey) {
      case 'getDataOnConnect':
        await this.socketService.getDataOnConnect(event.requestContext.connectionId);
        break;
      case 'sendMessage':
        const body = JSON.parse(event.body);
        console.log('body', body);
        const x = body.x ?? 0;
        const y = body.y ?? 0;
        await this.socketService.sendMessage(event.requestContext.connectionId, x, y);
        break;
      default:
        console.warn('Unhandled Message', event.requestContext.routeKey, event.requestContext.connectionId);
        break;
    }
  }
}
