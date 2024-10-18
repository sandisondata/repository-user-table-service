import { BaseService, Query } from 'base-service-class';
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
export declare class Service extends BaseService<PrimaryKey, CreateData, Row, UpdateData> {
    preCreate(): Promise<void>;
}
