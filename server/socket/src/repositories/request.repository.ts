import { Injectable } from '@nestjs/common';
import { DynamoBase } from '../bases/dynamo.base';
import { TableType } from '../enums/table-type.enum';
import { GameRequest } from '../models/request.model';
import { RandomUtils } from '../utils/random.utils';

@Injectable()
export class RequestRepository extends DynamoBase {

  constructor() {
    super('tictacgo');
  }

  public async getPrivate(gameCode: string): Promise<GameRequest> {
    try {
      return await this.getItem('pk = :pk', {
        ':pk': TableType.GameRequest + '#' + gameCode,
      });
    } catch (ex) {
      console.error(ex);
      throw ex;
    }
  }

  public async getAllPublic(): Promise<GameRequest[]> {
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

  public async createPublic(connectionId: string): Promise<void> {
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

  public async createPrivate(connectionId: string): Promise<string> {
    try {
      const gameCode = String.fromCharCode(
        ...[0, 0, 0, 0].map((__, i) => {
          if (i < 2) {
            // A - Z
            return RandomUtils.between(65, 90);
          } else {
            // 0 - 9
            return RandomUtils.between(48, 57);
          }
        })
      );
      await this.putItem({
        pk: TableType.GameRequest + '#' + gameCode,
        sk: connectionId,
        connectionId,
        gameCode,
        expires: new Date().getTime() + 30000,
      });
      return gameCode;
    } catch (ex) {
      console.error(ex);
      throw ex;
    }
  }

  public async delete(connectionId: string, gameCode?: string): Promise<void> {
    try {
      await this.deleteItem({
        pk: TableType.GameRequest + (gameCode ? '#' + gameCode : ''),
        sk: connectionId,
      });
    } catch (ex) {
      console.error(ex);
      throw ex;
    }
  }

}
