import React, {useState, useEffect} from 'react';
import axios from 'axios';

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

export const App: React.FC = () => {
    const [name, setName] = useState('');
    const [completed, setCompleted] = useState(false);
    const [dueDate, setDueDate] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
    const [filter, setFilter] = useState<'all' | 'complete' | 'incomplete'>('all');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchTasks = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.get('tasks');
            setTasks(response.data);
            setIsLoading(false);
        } catch (error: any) {
            setError(error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    useEffect(() => {
        if (filter === 'all') {
            setFilteredTasks(tasks);
        } else {
            const filtered = tasks.filter(task => filter === 'complete' ? task.completed : !task.completed);
            setFilteredTasks(filtered);
        }
    }, [filter, tasks]);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        try {
            await login(username, password);
            // If login is successful, redirect to the home page
            window.location.href = '/login';
        } catch (error) {
            console.error(error);
            alert('Login failed. Please try again.');
        }
    };

    const login = async (username: string, password: string) => {
        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username, password}),
            });
            if (response.ok) {
                const {token} = await response.json();
                // Save the token to a secure, HttpOnly cookie
                document.cookie = `jwt=${token}; Secure; HttpOnly`;
                return true;
            } else {
                throw new Error('Login failed');
            }
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    const addTask = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!name) {
            alert('Please enter a task name');
            return;
        }

        const formData = new FormData();

        formData.append('name', name);
        formData.append('completed', completed ? 'true' : 'false');

        if (dueDate) {
            formData.append('dueDate', dueDate);
        }

        console.log(file);
        if (file) {
            formData.append('file', file);
        }

        try {
            const response = await axios.post('tasks/', formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            setTasks([...tasks, response.data]);
            setName(name);
            setCompleted(completed);
            setDueDate(dueDate);
            setFile(file);
        } catch (error) {
            console.log(error);
        }
    };

    const deleteTask = async (id: string) => {
        try {
            await axios.delete(`tasks/${id}`);
            const updatedTasks = tasks.filter(task => task.id !== id);
            setTasks(updatedTasks);
        } catch (error) {
            console.log(error);
        }
    };

    const filterTasks = (filter: 'all' | 'complete' | 'incomplete') => {
        setFilter(filter);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        console.log(files);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    return (
        <div>
            <h1>Task List</h1>
            <form onSubmit={addTask}>
                <label>
                    Name:
                    <input type="text" value={name} onChange={e => setName(e.target.value)}/>
                </label>

                <label>
                    Completed:
                    <input type="checkbox" checked={completed} onChange={e => setCompleted(e.target.checked)}/>
                </label>

                <label>
                    Due Date:
                    <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}/>
                </label>

                <label>
                    File:
                    <input type="file" onChange={handleFileChange}/>
                </label>

                <button type="submit">Add Task</button>
            </form>

            <div>
                Filter:
                <button onClick={() => filterTasks('all')}>All</button>
                <button onClick={() => filterTasks('incomplete')}>Incomplete</button>
                <button onClick={() => filterTasks('complete')}>Complete</button>
            </div>

            {isLoading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error.message}</p>
            ) : (
                <table>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Completed</th>
                        <th>Due Date</th>
                        <th>Attachments</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {tasks.map(task => (
                        <tr key={task.id}>
                            <td>{task.name}</td>
                            <td>{task.completed ? 'Yes' : 'No'}</td>
                            <td>{task.dueDate ? formatDate(task.dueDate.toString()) : ''}</td>
                            <td>{task.attachments ? task.attachments.toString() : ''}</td>
                            <td>
                                <button onClick={() => deleteTask(task.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}
