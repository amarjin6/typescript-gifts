import React, {useState} from 'react';

export function LoginForm(props: any) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        props.handleLogin(username, password);
    };

    return (
        <div>
            <h1>Welcome to Task List!</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    <b>Username:</b>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
                </label>
                <br/>
                <label>
                    <b>Password: </b>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                </label>
                <br/>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}
