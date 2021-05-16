import { DynamoBase } from '../bases/dynamo.base';
import { TableType } from '../enums/table-type.enum';

export class PlayerRepository extends DynamoBase {

  constructor() {
    super('tictacgo');
  }

  public async get(connectionId: string) {
    try {
      const results = await this.getItems('pk = :pk AND sk = :sk', {
        ':pk': TableType.Player,
        ':sk': connectionId,
      });
      return results && results.length > 0 ? results[0] : null;
    } catch (ex) {
      console.error(ex);
      throw ex;
    }
  }

  public async create(connectionId: string, gameId: string) {
    try {
      await this.putItem({
        pk: TableType.Player,
        sk: connectionId,
        connectionId,
        gameId,
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
        pk: TableType.Player,
        sk: connectionId,
      });
    } catch (ex) {
      console.error(ex);
      throw ex;
    }
  }

}
