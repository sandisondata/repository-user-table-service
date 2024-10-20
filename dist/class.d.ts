import { BaseService } from 'base-service-class';
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
export declare class Service extends BaseService<PrimaryKey, CreateData, UpdateData, Row> {
    preCreate(): Promise<void>;
}
export {};
