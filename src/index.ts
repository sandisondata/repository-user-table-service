import {
  CreateData,
  Data,
  PrimaryKey,
  Query,
  Row,
  Service,
  UpdateData,
} from './class';

export { CreateData, Data, PrimaryKey, Query, Row, UpdateData };

const service = new Service(
  'system-user-table-service',
  '_user_tables',
  ['user_uuid', 'table_uuid'],
  ['can_create', 'can_read', 'can_update', 'can_delete'],
  false,
);

export { service };
