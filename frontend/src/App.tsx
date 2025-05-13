import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Login from './components/Login';
import Home from './components/Home';
import { ApiFactory } from './services/api/factory';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const router = useRouter();
  const authService = ApiFactory.getInstance().getAuthService();

  const handleLogin = async (username: string, password: string) => {
    try {
      const response = await authService.login({ username, password });
      setIsLoggedIn(true);
      setUsername(response.username);
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

  return isLoggedIn ? (
    <Home username={username} onLogout={handleLogout} />
  ) : (
    <Login onLogin={handleLogin} />
  );
};

export default App;

