import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { Database } from 'database';
import { Debug, MessageType } from 'node-debug';
import { Row as Table, service as tableService } from 'system-table-service';
import { Row as User, service as userService } from 'system-user-service';
import { CreateData, PrimaryKey, service, UpdateData } from '../dist';

describe('main', (suiteContext) => {
  Debug.initialize(true);
  let database: Database;
  let user: User;
  let table: Table;
  let primaryKey: PrimaryKey;
  before(async () => {
    const debug = new Debug(`${suiteContext.name}.before`);
    debug.write(MessageType.Entry);
    database = Database.getInstance();
    user = (await userService.create(database.query, {})) as User;
    table = (await tableService.create(database.query, {
      name: 'widgets',
      singular_name: 'widget',
    })) as Table;
    primaryKey = {
      user_uuid: user.uuid,
      table_uuid: table.uuid,
    };
    debug.write(MessageType.Exit);
  });
  it('create', async (testContext) => {
    const debug = new Debug(`${suiteContext.name}.test.${testContext.name}`);
    debug.write(MessageType.Entry);
    const createData: CreateData = {
      user_uuid: user.uuid,
      table_uuid: table.uuid,
      can_read: true,
    };
    await database.transaction(async (query) => {
      await service.create(query, createData);
    });
    debug.write(MessageType.Exit);
    assert.ok(true);
  });
  it('find', async (testContext) => {
    const debug = new Debug(`${suiteContext.name}.test.${testContext.name}`);
    debug.write(MessageType.Entry);
    await service.find(database.query);
    debug.write(MessageType.Exit);
    assert.ok(true);
  });
  it('findOne', async (testContext) => {
    const debug = new Debug(`${suiteContext.name}.test.${testContext.name}`);
    debug.write(MessageType.Entry);
    await service.findOne(database.query, primaryKey);
    debug.write(MessageType.Exit);
    assert.ok(true);
  });
  it('update', async (testContext) => {
    const debug = new Debug(`${suiteContext.name}.test.${testContext.name}`);
    debug.write(MessageType.Entry);
    await database.transaction(async (query) => {
      const updateData: UpdateData = {
        can_create: true,
        can_update: true,
      };
      await service.update(query, primaryKey, updateData);
    });
    debug.write(MessageType.Exit);
    assert.ok(true);
  });
  it('delete', async (testContext) => {
    const debug = new Debug(`${suiteContext.name}.test.${testContext.name}`);
    debug.write(MessageType.Entry);
    await database.transaction(async (query) => {
      await service.delete(query, primaryKey);
    });
    debug.write(MessageType.Exit);
    assert.ok(true);
  });
  after(async () => {
    const debug = new Debug(`${suiteContext.name}.after`);
    debug.write(MessageType.Entry);
    await database.transaction(async (query) => {
      await userService.delete(query, { uuid: user.uuid });
      await tableService.delete(query, { uuid: table.uuid });
    });
    await database.disconnect();
    debug.write(MessageType.Exit);
  });
});
