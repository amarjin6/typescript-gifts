import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import * as core from 'express-serve-static-core';

const app = express();
const upload = multer({ dest: 'public/uploads/' });

interface Task {
  id: number;
  name: string;
  status: string;
  dueDate: string;
  attachment: string;
}

const tasks: Task[] = [];

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req: Request<core.ParamsDictionary, any, any, {status: string}>, res: Response) => {
  const statusFilter = req.query.status;
  let filteredTasks = tasks;
  if (statusFilter) {
    filteredTasks = tasks.filter(task => task.status === statusFilter);
  }
  
  let html = `
    <h1>Task Management</h1>
    <form action="/task" method="post" enctype="multipart/form-data">
      <div>
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" required>
      </div>
      <div>
        <label for="status">Status:</label>
        <select id="status" name="status" required>
          <option value="Unassigned">Unassigned</option>
          <option value="Pending">Pending</option>
          <option value="Accepted">Accepted</option>
          <option value="Started">Started</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
      <div>
        <label for="dueDate">Due date:</label>
        <input type="date" id="dueDate" name="dueDate" required>
      </div>
      <div>
        <label for="attachment">Attachment:</label>
        <input type="file" id="attachment" name="attachment">
      </div>
      <button type="submit">Add task</button>
    </form>
    <h2>Tasks</h2>
    <ul>
  `;

  filteredTasks.forEach(task => {
    html += `
      <li>
        <h3>${task.name}</h3>
        <p>Status: ${task.status}</p>
        <p>Due date: ${task.dueDate}</p>
        ${
          task.attachment
            ? `<p>Attachment: <a href="${task.attachment}">${task.attachment}</a></p>`
            : ''
        }
      </li>
    `;
  });
  html += `</ul>`;
  res.send(html);
});

app.post('/task', upload.single('attachment'), (req, res) => {
  const id = tasks.length + 1;
  const name = req.body.name;
  const status = req.body.status;
  const dueDate = req.body.dueDate;
  let attachment = '';
  if (req.file) {
    attachment = `public/uploads/${req.file.filename}`;
  }
  tasks.push({ id, name, status, dueDate, attachment });
  res.redirect('/');
});

app.use('/public/uploads', express.static(path.join(__dirname, 'public/uploads')));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Task management app listening on port ${port}`);
});
  
