import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import PracticeDetail from '../../components/PracticeDetail';
import MainLayout from '../../components/layout/MainLayout';
import { useAuth } from '../../contexts/AuthContext';

const IndustryPracticePage: NextPage = () => {
  const router = useRouter();
  const { industry } = router.query;
  const { username, logout } = useAuth();

  if (!industry || typeof industry !== 'string') {
    return null;
  }

  return (
    <MainLayout username={username} onLogout={logout}>
      <PracticeDetail 
        username={username} 
        onLogout={logout} 
      />
    </MainLayout>
  );
};

export default IndustryPracticePage; 