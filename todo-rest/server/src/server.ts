import express, {Request, Response} from 'express';
import bodyParser from 'body-parser';
import multer, {FileFilterCallback} from 'multer';
import {v4 as uuidv4} from 'uuid';

// JWT auth dependencies
import jwt from 'jsonwebtoken';
import {Unauthorized, BadRequest} from "@tsed/exceptions";
import "cookie-parser";

interface Task {
    id: string;
    name: string;
    completed: boolean;
    dueDate: Date | null;
    attachments: Attachment[];
}

interface Attachment {
    id: string;
    filename: string;
}

const tasks: Task[] = [];

const JWT_SECRET_KEY = process.env.SECRET_KEY || 'unSecureSecretKey';
const JWT_EXPIRATION_TIME = process.env.EXPIRATION_TIME || '5h';

const app = express();

app.use(bodyParser.json());

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

var cookieParser = require('cookie-parser')

app.use(cookieParser());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        const id = uuidv4();
        const filename = id + '_' + file.originalname;
        cb(null, filename);
    },
});

const fileFilter = (req: Request, file: any, cb: FileFilterCallback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return new Error('Only image files are allowed!');
    }
    cb(null, true);
}

const upload = multer({storage, fileFilter});

interface CustomRequest extends Request {
    file: any;
}

const verifyToken = (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        const error = new Unauthorized("Unauthorized: No token provided");
        throw error;
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        const error = new Unauthorized("Unauthorized: Invalid token");
        throw error;
    }
};

app.get('/tasks', verifyToken, (req: Request, res: Response) => {
    const completed = req.query.completed === 'true';
    const filteredTasks = completed ? tasks.filter(task => task.completed) : tasks;
    res.json(filteredTasks);
});

app.post('/tasks', verifyToken, (req: Request, res: Response) => {
    const {name, completed, dueDate} = req.body;
    const isCompleted = (completed == "true");
    const id = uuidv4();
    console.log(completed);
    const task: Task = {
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

app.put('/tasks/:id', verifyToken, (req: Request, res: Response) => {
    const {id} = req.params;
    const {name, completed, dueDate} = req.body;
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

app.delete('/tasks/:id', verifyToken, (req: Request, res: Response) => {
    const {id} = req.params;
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) {
        res.status(404).send('Task not found');
        return;
    }
    tasks.splice(taskIndex, 1);
    res.status(204).send();
});

app.post('/tasks/:id/attachments', verifyToken, upload.single('file'), (req: CustomRequest, myreq: Request, res: Response) => {
    const {id} = req.params;
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) {
        res.status(404).send('Task not found');
        return;
    }
    const attachment: Attachment = {
        id: uuidv4(),
        filename: req.file.filename,
    };
    tasks[taskIndex].attachments.push(attachment);
    res.json(attachment);
});

app.post('/login', (req, res) => {
    const {username, password} = req.body;
    if (!username || !password) {
        const error = new BadRequest("Bad Request: Username or password missing");
        throw error;
    }
    const user = {username, password};
    const isValidUser = true;
    if (!isValidUser) {
        const error = new Unauthorized("Unauthorized: Invalid username or password");
        throw error;
    }
    const token = jwt.sign(user, JWT_SECRET_KEY, {expiresIn: JWT_EXPIRATION_TIME});
    res.cookie('jwt', token, {httpOnly: true});
    res.json({success: true});
});

const port = 3001;

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
