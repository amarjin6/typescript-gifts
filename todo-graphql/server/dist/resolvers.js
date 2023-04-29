"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const uuid = __importStar(require("uuid"));
const todoList = require('../data.json');
exports.resolvers = {
    Query: {
        tasks: () => todoList.items,
    },
    Mutation: {
        createItem(_, { title, description, completed, dueDate }) {
            const item = { id: uuid.v4(), title, description, completed, dueDate };
            todoList.items.push(item);
            return item;
        },
        updateItem(_, { id, title, description, completed, dueDate }) {
            const item = todoList.items.find(i => i.id === id);
            if (item) {
                item.title = title;
                item.description = description;
                item.completed = completed;
                item.dueDate = dueDate;
                return item;
            }
            throw new Error('An error occurred: Task not found!');
        },
        deleteItem(_, { id }) {
            const idx = todoList.items.findIndex(i => i.id === id);
            if (idx !== -1) {
                todoList.items.splice(idx, 1);
                return `Task ${id} deleted successfully!`;
            }
            throw new Error('An error occurred: Task not found!');
        }
    }
};
//# sourceMappingURL=resolvers.js.map