"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const multer_1 = __importDefault(require("multer"));
const uuid_1 = require("uuid");
// JWT auth dependencies
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const exceptions_1 = require("@tsed/exceptions");
require("cookie-parser");
const tasks = [];
const JWT_SECRET_KEY = process.env.SECRET_KEY || 'unSecureSecretKey';
const JWT_EXPIRATION_TIME = process.env.EXPIRATION_TIME || '5h';
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use((err, req, res, next) => {
    if (err.status === 401) {
        res.set('WWW-Authenticate', 'Basic realm="Task Manager"');
    }
    next(err);
});
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message,
        },
    });
});
var cookieParser = require('cookie-parser');
app.use(cookieParser());
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        const id = (0, uuid_1.v4)();
        const filename = id + '_' + file.originalname;
        cb(null, filename);
    },
});
const fileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return new Error('Only image files are allowed!');
    }
    cb(null, true);
};
const upload = (0, multer_1.default)({ storage, fileFilter });
const verifyToken = (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        const error = new exceptions_1.Unauthorized("Unauthorized: No token provided");
        throw error;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET_KEY);
        req.user = decoded;
        next();
    }
    catch (err) {
        const error = new exceptions_1.Unauthorized("Unauthorized: Invalid token");
        throw error;
    }
};
app.get('/tasks', verifyToken, (req, res) => {
    const completed = req.query.completed === 'true';
    const filteredTasks = completed ? tasks.filter(task => task.completed) : tasks;
    res.json(filteredTasks);
});
app.post('/tasks', verifyToken, (req, res) => {
    const { name, completed, dueDate } = req.body;
    const isCompleted = (completed == "true");
    const id = (0, uuid_1.v4)();
    console.log(completed);
    const task = {
        id,
        name,
        completed: isCompleted,
        dueDate: dueDate ? new Date(dueDate) : dueDate,
        attachments: [],
    };
    tasks.push(task);
    console.log(task);
    res.status(201).json(task);
});
app.put('/tasks/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    const { name, completed, dueDate } = req.body;
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) {
        res.status(404).send('Task not found');
        return;
    }
    tasks[taskIndex].name = name;
    tasks[taskIndex].completed = !!completed;
    tasks[taskIndex].dueDate = dueDate ? new Date(dueDate) : dueDate;
    res.json(tasks[taskIndex]);
});
app.delete('/tasks/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) {
        res.status(404).send('Task not found');
        return;
    }
    tasks.splice(taskIndex, 1);
    res.status(204).send();
});
app.post('/tasks/:id/attachments', verifyToken, upload.single('file'), (req, myreq, res) => {
    const { id } = req.params;
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) {
        res.status(404).send('Task not found');
        return;
    }
    const attachment = {
        id: (0, uuid_1.v4)(),
        filename: req.file.filename,
    };
    tasks[taskIndex].attachments.push(attachment);
    res.json(attachment);
});
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        const error = new exceptions_1.BadRequest("Bad Request: Username or password missing");
        throw error;
    }
    const user = { username, password };
    const isValidUser = true;
    if (!isValidUser) {
        const error = new exceptions_1.Unauthorized("Unauthorized: Invalid username or password");
        throw error;
    }
    const token = jsonwebtoken_1.default.sign(user, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRATION_TIME });
    res.cookie('jwt', token, { httpOnly: true });
    res.json({ success: true });
});
const port = 3001;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
//# sourceMappingURL=server.js.map