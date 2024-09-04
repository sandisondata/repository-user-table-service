import { Query } from 'database';
import * as tableService from 'repository-table-service';
import * as userService from 'repository-user-service';
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
export type CreatedRow = {
    user: userService.Row;
    table: tableService.Row;
} & Required<Data>;
export type Row = PrimaryKey & Required<Data>;
export type UpdateData = Partial<Data>;
export type UpdatedRow = PrimaryKey & Required<Data>;
export declare const create: (query: Query, createData: CreateData) => Promise<CreatedRow>;
export declare const find: (query: Query) => Promise<Row[]>;
export declare const findOne: (query: Query, primaryKey: PrimaryKey) => Promise<Row>;
export declare const update: (query: Query, primaryKey: PrimaryKey, updateData: UpdateData) => Promise<UpdatedRow>;
export declare const delete_: (query: Query, primaryKey: PrimaryKey) => Promise<void>;
