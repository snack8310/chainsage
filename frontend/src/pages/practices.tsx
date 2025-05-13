import type { NextPage } from 'next';
import IndustrySelection from '../components/IndustrySelection';
import { useAuth } from '../contexts/AuthContext';

const PracticesPage: NextPage = () => {
  const { username, logout } = useAuth();
  return <IndustrySelection username={username} onLogout={logout} />;
};

export default PracticesPage; 