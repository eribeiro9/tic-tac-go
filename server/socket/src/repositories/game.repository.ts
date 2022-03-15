import { Injectable } from '@nestjs/common';
import { DynamoBase } from '../bases/dynamo.base';
import { TableType } from '../enums/table-type.enum';
import { GameState } from '../models/game-state.model';
import { Game } from '../models/game.model';

@Injectable()
export class GameRepository extends DynamoBase {

  constructor() {
    super('tictacgo');
  }

  public async get(gameId: string): Promise<Game | null> {
    try {
      return await this.getItem('pk = :pk AND sk = :sk', {
        ':pk': TableType.Game,
        ':sk': gameId,
      });
    } catch (ex) {
      console.error(ex);
      throw ex;
    }
  }

  public async create(gameId: string, state: GameState) {
    try {
      await this.putItem({
        pk: TableType.Game,
        sk: gameId,
        state,
        gameId,
        expires: new Date().getTime() + 30000,
      });
    } catch (ex) {
      console.error(ex);
      throw ex;
    }
  }

  public async save(gameId: string, state: GameState) {
    try {
      await this.updateItem({
        'pk': TableType.Game,
        'sk': gameId,
      }, 'set #state = :state', {
        '#state': 'state',
      }, {
        ':state': state,
      });
    } catch (ex) {
      console.error(ex);
      throw ex;
    }
  }

  public async delete(gameId: string) {
    try {
      await this.deleteItem({
        pk: TableType.Game,
        sk: gameId,
      });
    } catch (ex) {
      console.error(ex);
      throw ex;
    }
  }

}
