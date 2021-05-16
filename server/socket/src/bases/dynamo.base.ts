import * as AWS from 'aws-sdk';

const { marshall, unmarshall } = AWS.DynamoDB.Converter;

export class DynamoBase {

  protected table: AWS.DynamoDB;

  private tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
    this.table = new AWS.DynamoDB({ apiVersion: '2012-08-10' });
  }

  protected async getItems(condition: string, values: any): Promise<any[]> {
    try {
      const results = await this.table.query({
        TableName: this.tableName,
        KeyConditionExpression: condition,
        ExpressionAttributeValues: marshall(values),
      }).promise();
      return results.Items ? results.Items.map(i => unmarshall(i)) : [];
    } catch (ex) {
      console.error(ex);
      throw ex;
    }
  }

  protected putItem(item: {
    [key: string]: any;
  }) {
    try {
      return this.table.putItem({
        TableName: this.tableName,
        Item: marshall(item),
      }).promise();
    } catch (ex) {
      console.error(ex);
      throw ex;
    }
  }

  protected updateItem(key: {
    [key: string]: any;
  }, expression: string, names: {
    [key: string]: string;
  }, values: {
    [key: string]: any;
  }) {
    try {
      for (const key in values) {
        if (typeof values[key] === 'object') {
          values[key] = { 'M': marshall(values[key]) };
        }
      }

      return this.table.updateItem({
        TableName: this.tableName,
        Key: marshall(key),
        UpdateExpression: expression,
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
      }).promise();
    } catch (ex) {
      console.error(ex);
      throw ex;
    }
  }

  protected deleteItem(item: {
    [key: string]: any;
  }) {
    try {
      return this.table.deleteItem({
        TableName: this.tableName,
        Key: marshall(item),
      }).promise();
    } catch (ex) {
      console.error(ex);
      throw ex;
    }
  }

}
