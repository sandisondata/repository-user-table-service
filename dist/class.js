"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
const base_service_class_1 = require("base-service-class");
const node_debug_1 = require("node-debug");
const system_table_service_1 = require("system-table-service");
const system_user_service_1 = require("system-user-service");
class Service extends base_service_class_1.BaseService {
    preCreate() {
        return __awaiter(this, void 0, void 0, function* () {
            const debug = new node_debug_1.Debug(`${this.debugSource}.preCreate`);
            debug.write(node_debug_1.MessageType.Entry);
            debug.write(node_debug_1.MessageType.Step, 'Finding user...');
            yield system_user_service_1.service.findOne(this.query, { uuid: this.createData.user_uuid });
            debug.write(node_debug_1.MessageType.Step, 'Finding table...');
            yield system_table_service_1.service.findOne(this.query, {
                uuid: this.createData.table_uuid,
            });
            debug.write(node_debug_1.MessageType.Exit);
        });
    }
}
exports.Service = Service;
