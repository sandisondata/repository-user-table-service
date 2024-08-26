import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { Database } from 'database';
import { Debug, MessageType } from 'node-debug';
import * as tableService from 'repository-table-service';
import * as userService from 'repository-user-service';
import { create, delete_, find, findOne, update } from '../dist';

import { v4 as uuidv4 } from 'uuid';

describe('main', (suiteContext) => {
  Debug.initialise(true);
  let database: Database;
  let userUUID: string;
  let tableUUID: string;
  before(async () => {
    const debug = new Debug(`${suiteContext.name}.before`);
    debug.write(MessageType.Entry);
    database = Database.getInstance();
    userUUID = uuidv4();
    await userService.create(database.query, { user_uuid: userUUID });
    tableUUID = uuidv4();
    await tableService.create(database.query, {
      table_uuid: tableUUID,
      table_name: 'widgets',
      singular_table_name: 'widget',
    });
    debug.write(MessageType.Exit);
  });
  it('create', async (testContext) => {
    const debug = new Debug(`${suiteContext.name}.test.${testContext.name}`);
    debug.write(MessageType.Entry);
    await database.transaction(async (query) => {
      await create(query, {
        user_uuid: userUUID,
        table_uuid: tableUUID,
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
      user_uuid: userUUID,
      table_uuid: tableUUID,
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
        { user_uuid: userUUID, table_uuid: tableUUID },
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
      await delete_(query, { user_uuid: userUUID, table_uuid: tableUUID });
    });
    debug.write(MessageType.Exit);
    assert.ok(true);
  });
  after(async () => {
    const debug = new Debug(`${suiteContext.name}.after`);
    debug.write(MessageType.Entry);
    await database.transaction(async (query) => {
      await userService.delete_(query, { user_uuid: userUUID });
      await tableService.delete_(query, { table_uuid: tableUUID });
    });
    await database.shutdown();
    debug.write(MessageType.Exit);
  });
});
