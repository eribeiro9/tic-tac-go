import { DynamoBase } from '../bases/dynamo.base';
import { TableType } from '../enums/table-type.enum';

export class RequestRepository extends DynamoBase {

  constructor() {
    super('tictacgo');
  }

  public async getAll(): Promise<string[]> {
    try {
      const results = await this.getItems('pk = :pk', { ':pk': TableType.GameRequest });
      return results ? results.map(r => r.connectionId) : [];
    } catch (ex) {
      console.error(ex);
      throw ex;
    }
  }

  public async create(connectionId: string) {
    try {
      await this.putItem({
        pk: TableType.GameRequest,
        sk: connectionId,
        connectionId,
        expires: new Date().getTime() + 30000,
      });
    } catch (ex) {
      console.error(ex);
      throw ex;
    }
  }

  public async delete(connectionId: string) {
    try {
      await this.deleteItem({
        pk: TableType.GameRequest,
        sk: connectionId,
      });
    } catch (ex) {
      console.error(ex);
      throw ex;
    }
  }

}
