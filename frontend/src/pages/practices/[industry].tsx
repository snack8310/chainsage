import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import PracticeDetail from '../../components/PracticeDetail';
import { useAuth } from '../../contexts/AuthContext';

const IndustryPracticePage: NextPage = () => {
  const router = useRouter();
  const { industry } = router.query;
  const { username, logout } = useAuth();

  if (!industry || typeof industry !== 'string') {
    return null;
  }

  return <PracticeDetail username={username} onLogout={logout} />;
};

export default IndustryPracticePage; 