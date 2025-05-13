import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import IndustryPractice from '../../components/IndustryPractice';
import { useAuth } from '../../contexts/AuthContext';

const IndustryPracticePage: NextPage = () => {
  const router = useRouter();
  const { industry } = router.query;
  const { username, logout } = useAuth();

  if (!industry || typeof industry !== 'string') {
    return null;
  }

  return (
    <IndustryPractice 
      industry={industry} 
      username={username} 
      onLogout={logout} 
    />
  );
};

export default IndustryPracticePage; 