import styled from 'styled-components';
import React, {useCallback, useState, useEffect} from 'react';
import {Task} from '../../models/TodoList';
import {TodoItem} from './TodoItem';
import {AddTodoForm} from './AddTodoForm';
import {io} from 'socket.io-client';
import {ConnectionStatus} from './ConnectionStatus';

const {token} = sessionStorage;

const port = process.env.SERVER_PORT || 3003;
const socket = io(`http://localhost:${port}`, {
    query: {token},
});
socket.connect();

interface Props {
}

export const TodoList: React.FC<Props> = () => {
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        const handleConnect = () => setConnected(true);
        const handleDisconnect = () => setConnected(false);
        if (socket.connected) handleConnect();
        socket.on('disconnect', handleDisconnect);
        socket.on('connect', handleConnect);
        socket.on('receive_todo_list', (tasksV2) => {
            setTasks(tasksV2);
        });
    }, []);

    const [tasks, setTasks] = useState<Task[]>([]);

    const handleSetTasks = useCallback((tasksV2: Task[]) => {
        socket.emit('send_todo_list', tasksV2);
    }, []);

    const addTask = useCallback(
        (name: string, status: string, date: string) => {
            const id = new Date().getTime();
            handleSetTasks([...tasks, {id, name, status, date, isDone: false}]);
        },
        [tasks, handleSetTasks]
    );

    const toggleTaskComplete = useCallback(
        (id: number) => {
            const taskIndex = tasks.findIndex((task) => task.id === id);
            const updatedTasks = [...tasks];
            updatedTasks[taskIndex].isDone = !updatedTasks[taskIndex].isDone;
            handleSetTasks(updatedTasks);
        },
        [tasks, handleSetTasks]
    );

    const deleteTask = useCallback(
        (id: number) => {
            const taskIndex = tasks.findIndex((task) => task.id === id);
            const updatedTasks = [...tasks];
            updatedTasks.splice(taskIndex, 1);
            handleSetTasks(updatedTasks);
        },
        [tasks, handleSetTasks]
    );

    return (
        <>
            <ConnectionStatus connected={connected}></ConnectionStatus>
            <AddTodoForm addTask={addTask}></AddTodoForm>
            <StyledTodoList>
                {tasks.map((task) => (
                    <TodoItem
                        task={task}
                        key={task.id}
                        toggleTaskComplete={toggleTaskComplete}
                        deleteTask={deleteTask}
                    ></TodoItem>
                ))}
            </StyledTodoList>
        </>
    );
};

const StyledTodoList = styled.div`
  background-color: white;
  color: black;
  border: 1px;
`;
