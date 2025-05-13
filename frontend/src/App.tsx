import React, { useState } from 'react';
import { Theme } from '@radix-ui/themes';
import { useRouter } from 'next/router';
import Login from './components/Login';
import Home from './components/Home';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const router = useRouter();

  const handleLogin = async (username: string, password: string) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      setIsLoggedIn(true);
      setUsername(data.username);
      router.push('/');
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    router.push('/login');
  };

  return (
    <Theme>
      {isLoggedIn ? (
        <Home username={username} onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </Theme>
  );
};

export default App;

