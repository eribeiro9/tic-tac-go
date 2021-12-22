import { Injectable } from '@nestjs/common';
import { DynamoBase } from '../bases/dynamo.base';
import { TableType } from '../enums/table-type.enum';
import { GameRequest } from '../models/request.model';

@Injectable()
export class RequestRepository extends DynamoBase {

  constructor() {
    super('tictacgo');
  }

  public async getAll(): Promise<GameRequest[]> {
    try {
      const results = await this.getItems('pk = :pk', { ':pk': TableType.GameRequest });
      return results ? results.map(r => ({
        connectionId: r.connectionId,
        playerColor: r.playerColor,
      })) : [];
    } catch (ex) {
      console.error(ex);
      throw ex;
    }
  }

  public async create(connectionId: string, playerColor: string) {
    try {
      await this.putItem({
        pk: TableType.GameRequest,
        sk: connectionId,
        connectionId,
        playerColor,
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
