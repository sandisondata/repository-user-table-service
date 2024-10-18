"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.service = void 0;
const class_1 = require("./class");
const service = new class_1.Service('system-user-table-service', '_user_tables', ['user_uuid', 'table_uuid'], ['can_create', 'can_read', 'can_update', 'can_delete'], false);
exports.service = service;
