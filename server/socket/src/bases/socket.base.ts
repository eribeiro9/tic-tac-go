import * as AWS from 'aws-sdk';

export class SocketBase {
  private socketApi: AWS.ApiGatewayManagementApi;

  private async prepareApi(): Promise<void> {
    try {
      if (!this.socketApi) {
        const ssm = new AWS.SSM({ apiVersion: '2014-11-06' });
        const endpoint = await ssm.getParameter({
          Name: process.env.SSM_NAME,
        }).promise();
        if (endpoint.$response.data) {
          this.socketApi = new AWS.ApiGatewayManagementApi({
            apiVersion: '2018-11-29',
            endpoint: endpoint.$response.data.Parameter.Value,
          });
        }
      }
    } catch (ex) {
      console.error(ex);
      throw ex;
    }
  }

  protected async emit(connection: string, body: any): Promise<any> {
    try {
      await this.prepareApi();
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
