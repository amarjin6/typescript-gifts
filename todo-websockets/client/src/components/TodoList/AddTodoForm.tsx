import React, {memo, useState} from 'react';

interface Props {
    addTask: (name: string, status: string, date: string) => void;
}

export const AddTodoForm: React.FC<Props> = memo(({addTask}) => {
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [status, setStatus] = useState('');

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!name.trim()) {
            return;
        }
        addTask(name, status, date);
        setName('');
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setName(e.target.value);
    }

    return (
        <div>
            <h1>Task List</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type='text'
                    id='new-todo-input'
                    name='text'
                    autoComplete='off'
                    value={name}
                    onChange={handleChange}
                />
                <label>
                    Status:
                    <input type="text" value={status} onChange={e => setStatus(e.target.value)}/>
                </label>
                <label>
                    Due Date:
                    <input type="date" value={date} onChange={e => setDate(e.target.value)}/>
                </label>
                <button type='submit'>Add</button>
            </form>

        </div>
    );
});