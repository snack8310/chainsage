import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import PracticeDetail from '../../components/PracticeDetail';

const IndustryPracticePage: NextPage = () => {
  const router = useRouter();
  const { industry } = router.query;

  if (!industry || typeof industry !== 'string') {
    return null;
  }

  return <PracticeDetail />;
};

export default IndustryPracticePage; 