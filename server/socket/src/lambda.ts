import { APIGatewayProxyEvent, Callback, Context } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import { SocketController } from './controllers/socket.controller';
import { bootstrapNestJS } from './main';

AWS.config.update({ region: 'us-east-1' });

export async function handler(event: APIGatewayProxyEvent, context: Context, callback: Callback): Promise<void> {
  try {
    const nestApp = await bootstrapNestJS();
    const socketController = nestApp.get(SocketController);
    await socketController.handleEvent(event);
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
