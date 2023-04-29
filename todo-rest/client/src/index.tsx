import * as React from 'react';
import * as ReactDOM from 'react-dom';
import{LoginForm} from "./components/LoginForm";
import{App} from "./components/App";
import { useState } from 'react';

const Index = () => {
    const [loggedIn, setLoggedIn] = useState(false);

    const login = async (username: string, password: string) => {
        try {
          const response = await fetch('/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
          });
          if (response.ok) {
            const { token } = await response.json();
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
      
    const handleLogin = async (username: string, password: string) => {
      const token = await login(username, password);
      if (token) {
        setLoggedIn(true);
      } else {
        alert('Login failed. Please try again.');
      }
    };
  
    return loggedIn ? <App /> : <LoginForm handleLogin={handleLogin} />;
  };
  
  ReactDOM.render(<Index />, document.getElementById('root'));