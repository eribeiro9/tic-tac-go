import * as AWS from 'aws-sdk';

export class SocketBase {
  private socketApi: AWS.ApiGatewayManagementApi;

  constructor() {
    this.socketApi = new AWS.ApiGatewayManagementApi({
      apiVersion: '2018-11-29',
      endpoint: 'c711i0rit4.execute-api.us-east-1.amazonaws.com/Stage',
    });
  }

  protected emit(connection: string, body: any) {
    try {
      const stringifiedBody = JSON.stringify(body);
      return this.socketApi.postToConnection({
        ConnectionId: connection,
        Data: stringifiedBody,
      }).promise();
    } catch (ex) {
      console.error(ex);
      throw ex;
    }
  }
}
