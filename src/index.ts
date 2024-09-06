import { Query } from 'database';
import {
  checkPrimaryKey,
  createRow,
  deleteRow,
  findByPrimaryKey,
  updateRow,
} from 'database-helpers';
import { Debug, MessageType } from 'node-debug';
import { objectsEqual, pick } from 'node-utilities';
import * as tableService from 'repository-table-service';
import * as userService from 'repository-user-service';

const debugSource = 'user-table.service';
const debugRows = 3;

const tableName = '_user_tables';
const instanceName = 'user_table';

const primaryKeyColumnNames = ['user_uuid', 'table_uuid'];
const dataColumnNames = ['can_create', 'can_read', 'can_update', 'can_delete'];
const columnNames = [...primaryKeyColumnNames, ...dataColumnNames];

export type PrimaryKey<Populate extends boolean = false> =
  Populate extends false
    ? {
        user_uuid: string;
        table_uuid: string;
      }
    : {
        user: userService.Row;
        table: tableService.Row;
      };

export type Data = {
  can_create?: boolean;
  can_read?: boolean;
  can_update?: boolean;
  can_delete?: boolean;
};

export type CreateData = PrimaryKey & Data;
export type CreatedRow = Row<true>;

export type Row<Populate extends boolean = false> = PrimaryKey<Populate> &
  Required<Data>;

export type UpdateData = Partial<Data>;
export type UpdatedRow = Row;

export const create = async (
  query: Query,
  createData: CreateData,
): Promise<CreatedRow> => {
  const debug = new Debug(`${debugSource}.create`);
  debug.write(MessageType.Entry, `createData=${JSON.stringify(createData)}`);
  const primaryKey: PrimaryKey = {
    user_uuid: createData.user_uuid,
    table_uuid: createData.table_uuid,
  };
  debug.write(MessageType.Value, `primaryKey=${JSON.stringify(primaryKey)}`);
  debug.write(MessageType.Step, 'Checking primary key...');
  await checkPrimaryKey(query, tableName, instanceName, primaryKey);
  debug.write(MessageType.Step, 'Finding user...');
  const user = (await userService.findOne(query, {
    uuid: createData.user_uuid,
  })) as userService.Row;
  debug.write(MessageType.Step, 'Finding table...');
  const table = (await tableService.findOne(query, {
    uuid: createData.table_uuid,
  })) as tableService.Row;
  debug.write(MessageType.Step, 'Creating row...');
  const row = (await createRow(
    query,
    tableName,
    createData,
    columnNames,
  )) as Row;
  const createdRow: CreatedRow = Object.assign(
    { user: user, table: table },
    pick(row, dataColumnNames) as Required<Data>,
  );
  debug.write(MessageType.Exit, `createdRow=${JSON.stringify(createdRow)}`);
  return createdRow;
};

// TODO: query parameters + add actual query to helpers
export const find = async (query: Query) => {
  const debug = new Debug(`${debugSource}.find`);
  debug.write(MessageType.Entry);
  debug.write(MessageType.Step, 'Finding rows...');
  const rows = (
    await query(`SELECT * FROM ${tableName} ORDER BY user_uuid, table_uuid`)
  ).rows as Row[];
  debug.write(
    MessageType.Exit,
    `rows(${debugRows})=${JSON.stringify(rows.slice(0, debugRows))}`,
  );
  return rows;
};

export const findOne = async (query: Query, primaryKey: PrimaryKey) => {
  const debug = new Debug(`${debugSource}.findOne`);
  debug.write(MessageType.Entry, `primaryKey=${JSON.stringify(primaryKey)}`);
  debug.write(MessageType.Step, 'Finding row by primary key...');
  const row = (await findByPrimaryKey(
    query,
    tableName,
    instanceName,
    primaryKey,
    { columnNames: columnNames },
  )) as Row;
  debug.write(MessageType.Exit, `row=${JSON.stringify(row)}`);
  return row;
};

export const update = async (
  query: Query,
  primaryKey: PrimaryKey,
  updateData: UpdateData,
): Promise<UpdatedRow> => {
  const debug = new Debug(`${debugSource}.update`);
  debug.write(
    MessageType.Entry,
    `primaryKey=${JSON.stringify(primaryKey)};` +
      `updateData=${JSON.stringify(updateData)}`,
  );
  debug.write(MessageType.Step, 'Finding row by primary key...');
  const row = (await findByPrimaryKey(
    query,
    tableName,
    instanceName,
    primaryKey,
    { columnNames: columnNames, forUpdate: true },
  )) as Row;
  debug.write(MessageType.Value, `row=${JSON.stringify(row)}`);
  const mergedRow: Row = Object.assign({}, row, updateData);
  debug.write(MessageType.Value, `mergedRow=${JSON.stringify(mergedRow)}`);
  let updatedRow: Row = Object.assign({}, mergedRow);
  if (
    !objectsEqual(pick(mergedRow, dataColumnNames), pick(row, dataColumnNames))
  ) {
    debug.write(MessageType.Step, 'Updating row...');
    updatedRow = (await updateRow(
      query,
      tableName,
      primaryKey,
      updateData,
      columnNames,
    )) as Row;
  }
  debug.write(MessageType.Exit, `updatedRow=${JSON.stringify(updatedRow)}`);
  return updatedRow;
};

export const delete_ = async (query: Query, primaryKey: PrimaryKey) => {
  const debug = new Debug(`${debugSource}.delete`);
  debug.write(MessageType.Entry, `primaryKey=${JSON.stringify(primaryKey)}`);
  debug.write(MessageType.Step, 'Finding row by primary key...');
  await findByPrimaryKey(query, tableName, instanceName, primaryKey, {
    forUpdate: true,
  });
  debug.write(MessageType.Step, 'Deleting row...');
  await deleteRow(query, tableName, primaryKey);
  debug.write(MessageType.Exit);
};
