import type { NextPage } from 'next';
import PracticePacks from '../components/PracticePacks';
import MainLayout from '../components/layout/MainLayout';
import { useAuth } from '../contexts/AuthContext';

const PracticesPage: NextPage = () => {
  const { username, logout } = useAuth();
  return (
    <MainLayout username={username} onLogout={logout}>
      <PracticePacks username={username} onLogout={logout} />
    </MainLayout>
  );
};

export default PracticesPage; 