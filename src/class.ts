import { BaseService, Query } from 'base-service-class';
import { Debug, MessageType } from 'node-debug';
import { service as tableService } from 'system-table-service';
import { service as userService } from 'system-user-service';

export { Query };

export type PrimaryKey = {
  user_uuid: string;
  table_uuid: string;
};

export type Data = {
  can_create?: boolean;
  can_read?: boolean;
  can_update?: boolean;
  can_delete?: boolean;
};

export type CreateData = PrimaryKey & Data;
export type Row = Required<PrimaryKey> & Required<Data>;
export type UpdateData = Partial<Data>;

export class Service extends BaseService<
  PrimaryKey,
  CreateData,
  Row,
  UpdateData
> {
  async preCreate() {
    const debug = new Debug(`${this.debugSource}.preCreate`);
    debug.write(MessageType.Entry);
    debug.write(MessageType.Step, 'Finding user...');
    await userService.findOne(this.query, { uuid: this.createData.user_uuid });
    debug.write(MessageType.Step, 'Finding table...');
    await tableService.findOne(this.query, {
      uuid: this.createData.table_uuid,
    });
    debug.write(MessageType.Exit);
  }
}
