import React, {useState} from 'react';
import './App.css';
import {TaskList} from './components/TaskList'
import {useMutation, gql} from '@apollo/client';

const DeleteTask = gql`
    mutation DeleteTask{
        deleteItem(
            id: "6beda137-cff7-4c85-b062-3902913ecf5c"
        )
    }
`;

export const App: React.FC = () => {
    const [name, setName] = useState('');
    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    }

    const [deleteTaskMutation, {loading, error}] = useMutation(DeleteTask);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        deleteTaskMutation();
    }
    return (
        <div>
            <h1>Task List</h1>
            <TaskList/>
            <br/>
            <h3>Available actions</h3>
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Enter Id: </label>
                <input type="text" id="name" name="name" required value={name} onChange={handleNameChange}/>
                <button type="submit">Delete Task</button>
            </form>
        </div>
    );
};