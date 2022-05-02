import { Injectable } from '@nestjs/common';
import { DynamoBase } from '../bases/dynamo.base';
import { TableType } from '../enums/table-type.enum';

@Injectable()
export class PlayerRepository extends DynamoBase {

  constructor() {
    super(process.env.DYNAMO_NAME);
  }

  public async get(connectionId: string) {
    try {
      return await this.getItem('pk = :pk AND sk = :sk', {
        ':pk': TableType.Player,
        ':sk': connectionId,
      });
    } catch (ex) {
      console.error(ex);
      throw ex;
    }
  }

  public async updateSettings(connectionId: string, playerColor: string): Promise<void> {
    try {
      await this.updateItem({
        'pk': TableType.Player,
        'sk': connectionId,
      }, 'set #playerColor = :playerColor', {
        '#playerColor': 'playerColor',
      }, {
        ':playerColor': playerColor,
      });
    } catch (ex) {
      console.error(ex);
      throw ex;
    }
  }

  public async updateGameId(connectionId: string, gameId: string): Promise<void> {
    try {
      await this.updateItem({
        'pk': TableType.Player,
        'sk': connectionId,
      }, 'set #gameId = :gameId', {
        '#gameId': 'gameId',
      }, {
        ':gameId': gameId,
      });
    } catch (ex) {
      console.error(ex);
      throw ex;
    }
  }

  public async create(connectionId: string): Promise<void> {
    try {
      await this.putItem({
        pk: TableType.Player,
        sk: connectionId,
        connectionId,
        expires: new Date().getTime() + 30000,
      });
    } catch (ex) {
      console.error(ex);
      throw ex;
    }
  }

  public async delete(connectionId: string): Promise<void> {
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
