import type { NextPage } from 'next';
import Login from '../components/Login';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: NextPage = () => {
  const { login } = useAuth();
  return <Login onLogin={login} />;
};

export default LoginPage; 