import type { NextPage } from 'next';
import Courses from '../components/Courses';

const CoursesPage: NextPage = () => {
  return <Courses username="User" onLogout={() => {}} />;
};

export default CoursesPage; 