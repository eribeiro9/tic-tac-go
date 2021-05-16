import { APIGatewayProxyEvent, Callback, Context } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import { GameRepository } from './repositories/game.repository';
import { PlayerRepository } from './repositories/player.repository';
import { RequestRepository } from './repositories/request.repository';
import { GameService } from './services/game.service';
import { SocketService } from './services/socket.service';

AWS.config.update({ region: 'us-east-1' });

const gameRepo = new GameRepository();
const playerRepo = new PlayerRepository();
const requestRepo = new RequestRepository();
const gameService = new GameService(gameRepo);
const socketService = new SocketService(requestRepo, playerRepo, gameService);

export async function handler(event: APIGatewayProxyEvent, context: Context, callback: Callback) {
  try {
    switch (event.requestContext.eventType) {
      case 'CONNECT':
        await socketService.connect(event.requestContext.connectionId);
        break;
      case 'MESSAGE':
        console.log(event.body);
        switch (event.requestContext.routeKey) {
          case 'getDataOnConnect':
            await socketService.getDataOnConnect(event.requestContext.connectionId);
            break;
          case 'sendMessage':
            const body = JSON.parse(event.body);
            const x = body.x || 0;
            const y = body.y || 0;
            await socketService.sendMessage(event.requestContext.connectionId, x, y);
            break;
          default:
            console.warn('Unhandled Message', event.requestContext.routeKey, event.requestContext.connectionId);
            break;
        }
        break;
      case 'DISCONNECT':
        await socketService.disconnect(event.requestContext.connectionId);
        break;
      default:
        console.warn('Unhandled Event', event.requestContext.eventType, event.requestContext.connectionId);
        break;
    }
    callback(null, {
      statusCode: 200,
      body: '',
      headers: {},
      isBase64Encoded: false,
    });
  } catch (ex) {
    console.error(ex);
    callback(ex);
  }
}
