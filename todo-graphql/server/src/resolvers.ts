import {
    MutationCreateItemArgs,
    MutationUpdateItemArgs,
    MutationDeleteItemArgs
} from './graphql-types'
import * as uuid from 'uuid'

const todoList = require('../data.json')

export const resolvers = {
    Query: {
        tasks: () => todoList.items,
    },
    Mutation: {
        createItem(_, {title, description, completed, dueDate}: MutationCreateItemArgs) {
            const item = {id: uuid.v4(), title, description, completed, dueDate}
            todoList.items.push(item)
            return item
        },
        updateItem(_, {id, title, description, completed, dueDate}: MutationUpdateItemArgs) {
            const item = todoList.items.find(i => i.id === id)
            if (item) {
                item.title = title
                item.description = description
                item.completed = completed
                item.dueDate = dueDate
                return item
            }
            throw new Error('An error occurred: Task not found!');
        },
        deleteItem(_, {id}: MutationDeleteItemArgs) {
            const idx = todoList.items.findIndex(i => i.id === id)
            if (idx !== -1) {
                todoList.items.splice(idx, 1)
                return `Task ${id} deleted successfully!`
            }
            throw new Error('An error occurred: Task not found!');
        }
    }
};
