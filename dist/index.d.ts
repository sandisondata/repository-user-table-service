import { Query } from 'database';
import * as tableService from 'repository-table-service';
import * as userService from 'repository-user-service';
export type PrimaryKey<Populate extends boolean = false> = Populate extends false ? {
    user_uuid: string;
    table_uuid: string;
} : {
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
export type Row<Populate extends boolean = false> = PrimaryKey<Populate> & Required<Data>;
export type UpdateData = Partial<Data>;
export type UpdatedRow = Row;
export declare const create: (query: Query, createData: CreateData) => Promise<CreatedRow>;
export declare const find: (query: Query) => Promise<Row<false>[]>;
export declare const findOne: (query: Query, primaryKey: PrimaryKey) => Promise<Row<false>>;
export declare const update: (query: Query, primaryKey: PrimaryKey, updateData: UpdateData) => Promise<UpdatedRow>;
export declare const delete_: (query: Query, primaryKey: PrimaryKey) => Promise<void>;
