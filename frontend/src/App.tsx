import React, { useState } from 'react';
import { Box, Tabs, Button } from '@radix-ui/themes';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import IntentAnalysis from './components/IntentAnalysis';
import Chat from './components/Chat';
import CourseMap from './components/CourseMap';
import CourseDetail from './components/CourseDetail';
import Login from './components/Login';

// 创建一个简单的认证上下文
interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = React.createContext<AuthContextType>({
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
});

const MainContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = React.useContext(AuthContext);

  // 根据当前路径设置活动标签
  React.useEffect(() => {
    if (location.pathname.startsWith('/course/')) {
      setActiveTab('course-detail');
    } else if (location.pathname === '/courses') {
      setActiveTab('courses');
    } else if (location.pathname === '/course') {
      setActiveTab('course-detail');
    }
  }, [location.pathname]);

  if (!isAuthenticated) {
    return <Login onLogin={async (username, password) => {
      try {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        const response = await fetch('http://localhost:8000/api/v1/token', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Login failed');
        }

        const data = await response.json();
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('isAuthenticated', 'true');
        window.location.reload();
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    }} />;
  }

  return (
    <Box style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      overflow: 'hidden',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    }}>
      <Tabs.Root 
        value={activeTab} 
        onValueChange={(value) => {
          setActiveTab(value);
          if (value === 'chat') {
            navigate('/');
          } else if (value === 'intent') {
            navigate('/intent');
          } else if (value === 'courses') {
            navigate('/courses');
          } else if (value === 'course-detail') {
            navigate('/course');
          }
        }}
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          height: '100%', 
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <Tabs.List style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Tabs.Trigger value="chat">Chat</Tabs.Trigger>
          <Tabs.Trigger value="intent">Intent Analysis</Tabs.Trigger>
          <Tabs.Trigger value="courses">课程地图</Tabs.Trigger>
          <Tabs.Trigger value="course-detail">课程详情</Tabs.Trigger>
          <Button 
            color="red" 
            variant="soft" 
            onClick={() => {
              logout();
              navigate('/');
            }}
          >
            Logout
          </Button>
        </Tabs.List>

        <Box pt="3" style={{ 
          flex: 1, 
          overflow: 'hidden', 
          minHeight: 0,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Tabs.Content value="chat" style={{ 
            height: '100%', 
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            visibility: activeTab === 'chat' ? 'visible' : 'hidden'
          }}>
            <Chat />
          </Tabs.Content>
          <Tabs.Content value="intent" style={{ 
            height: '100%', 
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            visibility: activeTab === 'intent' ? 'visible' : 'hidden'
          }}>
            <IntentAnalysis />
          </Tabs.Content>
          <Tabs.Content value="courses" style={{ 
            height: '100%', 
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            visibility: activeTab === 'courses' ? 'visible' : 'hidden'
          }}>
            <CourseMap />
          </Tabs.Content>
          <Tabs.Content value="course-detail" style={{ 
            height: '100%', 
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            visibility: activeTab === 'course-detail' ? 'visible' : 'hidden'
          }}>
            <CourseDetail />
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </Box>
  );
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true' && localStorage.getItem('token') !== null;
  });

  const login = async (username: string, password: string) => {
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);

      const response = await fetch('http://localhost:8000/api/v1/token', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('isAuthenticated', 'true');
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainContent />} />
          <Route path="/intent" element={<MainContent />} />
          <Route path="/courses" element={<MainContent />} />
          <Route path="/course" element={<MainContent />} />
          <Route path="/course/:id" element={<MainContent />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App; 