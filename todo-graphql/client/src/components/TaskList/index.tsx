import { useQuery} from '@apollo/client';
import {QUERY_LAUNCH_LIST} from './query'

interface Task {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    dueDate: string;
}
export function TaskList() {
    const { loading, error, data } = useQuery(QUERY_LAUNCH_LIST);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    return (
        <ul>
            {data.tasks.map((task: Task) => (
                <li key={task.id}>
                    <h3>{task.title}</h3>
                    <p>Id: {task.id}</p>
                    <p>Description: {task.description}</p>
                    <p>Due Date: {task.dueDate}</p>
                    <p>Completed: {task.completed ? 'Yes' : 'No'}</p>
                </li>
            ))}
        </ul>
    );
}
