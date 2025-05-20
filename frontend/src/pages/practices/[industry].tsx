import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import PracticeDetail from '../../components/PracticeDetail';
import FinancialPractice from '../../components/FinancialPractice';

const IndustryPracticePage: NextPage = () => {
  const router = useRouter();
  const { industry } = router.query;

  if (!industry || typeof industry !== 'string') {
    return null;
  }

  if (industry === 'finance') {
    return <FinancialPractice />;
  }

  return <PracticeDetail />;
};

export default IndustryPracticePage; 