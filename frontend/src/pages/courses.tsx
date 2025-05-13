import type { NextPage } from 'next';
import Courses from '../components/Courses';
import { useAuth } from '../contexts/AuthContext';

const CoursesPage: NextPage = () => {
  const { username, logout } = useAuth();
  return <Courses username={username} onLogout={logout} />;
};

export default CoursesPage; 