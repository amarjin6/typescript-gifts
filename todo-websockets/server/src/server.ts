const express = require('express');
const http = require('http');
const cors = require('cors');
const errorHandler = require('errorhandler');
const jwt = require('jsonwebtoken');
const {Server} = require('socket.io');

let cookieParser = require('cookie-parser')

const app = express();
app.use(cors());
app.use(errorHandler({
    dumpExceptions: true,
    showStack: true,
}));
app.use(cookieParser());

const server = http.createServer(app);
const port = process.env.PORT || 3003;

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});

let tasksSaved: any = [];

io.on('connection', (socket) => {
    socket.emit('receive_todo_list', tasksSaved);
    socket.on('send_todo_list', (tasks: any) => {
        tasksSaved = tasks;
        io.emit('receive_todo_list', tasks);
        console.log(tasks);
    });
});

server.listen(port, () =>
    console.log(`🚀 Server is running at http://localhost:${port}`)
);
