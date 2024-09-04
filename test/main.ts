import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { Database } from 'database';
import { Debug, MessageType } from 'node-debug';
import * as tableService from 'repository-table-service';
import * as userService from 'repository-user-service';
import { create, delete_, find, findOne, update } from '../dist';

describe('main', (suiteContext) => {
  Debug.initialise(true);
  let database: Database;
  let user: userService.CreatedRow;
  let table: tableService.CreatedRow;
  before(async () => {
    const debug = new Debug(`${suiteContext.name}.before`);
    debug.write(MessageType.Entry);
    database = Database.getInstance();
    user = (await userService.create(
      database.query,
      {},
    )) as userService.CreatedRow;
    table = (await tableService.create(database.query, {
      name: 'widgets',
      singular_name: 'widget',
    })) as tableService.CreatedRow;
    debug.write(MessageType.Exit);
  });
  it('create', async (testContext) => {
    const debug = new Debug(`${suiteContext.name}.test.${testContext.name}`);
    debug.write(MessageType.Entry);
    await database.transaction(async (query) => {
      await create(query, {
        user_uuid: user.uuid,
        table_uuid: table.uuid,
        can_read: true,
      });
    });
    debug.write(MessageType.Exit);
    assert.ok(true);
  });
  it('find', async (testContext) => {
    const debug = new Debug(`${suiteContext.name}.test.${testContext.name}`);
    debug.write(MessageType.Entry);
    await find(database.query);
    debug.write(MessageType.Exit);
    assert.ok(true);
  });
  it('findOne', async (testContext) => {
    const debug = new Debug(`${suiteContext.name}.test.${testContext.name}`);
    debug.write(MessageType.Entry);
    await findOne(database.query, {
      user_uuid: user.uuid,
      table_uuid: table.uuid,
    });
    debug.write(MessageType.Exit);
    assert.ok(true);
  });
  it('update', async (testContext) => {
    const debug = new Debug(`${suiteContext.name}.test.${testContext.name}`);
    debug.write(MessageType.Entry);
    await database.transaction(async (query) => {
      await update(
        query,
        { user_uuid: user.uuid, table_uuid: table.uuid },
        { can_create: true, can_update: true },
      );
    });
    debug.write(MessageType.Exit);
    assert.ok(true);
  });
  it('delete', async (testContext) => {
    const debug = new Debug(`${suiteContext.name}.test.${testContext.name}`);
    debug.write(MessageType.Entry);
    await database.transaction(async (query) => {
      await delete_(query, { user_uuid: user.uuid, table_uuid: table.uuid });
    });
    debug.write(MessageType.Exit);
    assert.ok(true);
  });
  after(async () => {
    const debug = new Debug(`${suiteContext.name}.after`);
    debug.write(MessageType.Entry);
    await database.transaction(async (query) => {
      await userService.delete_(query, { uuid: user.uuid });
      await tableService.delete_(query, { uuid: table.uuid });
    });
    await database.shutdown();
    debug.write(MessageType.Exit);
  });
});
