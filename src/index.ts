import { Service } from './class';

export const service = new Service(
  'system-user-table-service',
  '_user_tables',
  ['user_uuid', 'table_uuid'],
  ['can_create', 'can_read', 'can_update', 'can_delete'],
  false,
);

export { CreateData, Data, PrimaryKey, Query, Row, UpdateData } from './class';
