import React from 'react';
import { useRouter } from 'next/router';
import Login from './components/Login';
import Home from './components/Home';
import { useAuth } from './contexts/AuthContext';

const App: React.FC = () => {
  const { isLoggedIn, username, login, logout } = useAuth();
  const router = useRouter();

  return isLoggedIn ? (
    <Home username={username} onLogout={logout} />
  ) : (
    <Login onLogin={login} />
  );
};

export default App;

