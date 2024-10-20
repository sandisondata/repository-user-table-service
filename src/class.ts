import { BaseService } from 'base-service-class';
import { Debug, MessageType } from 'node-debug';
import { service as tableService } from 'system-table-service';
import { service as userService } from 'system-user-service';

export type PrimaryKey = {
  user_uuid: string;
  table_uuid: string;
};

type Data = {
  can_create?: boolean;
  can_read?: boolean;
  can_update?: boolean;
  can_delete?: boolean;
};

export type CreateData = PrimaryKey & Data;
export type UpdateData = Partial<Data>;
export type Row = Required<PrimaryKey> & Required<Data>;

export class Service extends BaseService<
  PrimaryKey,
  CreateData,
  UpdateData,
  Row
> {
  async preCreate() {
    const debug = new Debug(`${this.debugSource}.preCreate`);
    debug.write(MessageType.Entry);
    const userPrimaryKey = { uuid: this.createData.user_uuid };
    debug.write(
      MessageType.Value,
      `userPrimaryKey=${JSON.stringify(userPrimaryKey)}`,
    );
    debug.write(MessageType.Step, 'Finding user...');
    await userService.findOne(this.query, userPrimaryKey);
    const tablePrimaryKey = { uuid: this.createData.table_uuid };
    debug.write(
      MessageType.Value,
      `tablePrimaryKey=${JSON.stringify(tablePrimaryKey)}`,
    );
    debug.write(MessageType.Step, 'Finding table...');
    await tableService.findOne(this.query, tablePrimaryKey);
    debug.write(MessageType.Exit);
  }
}
