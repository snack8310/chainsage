import React, { useState } from 'react';
import { Box, Tabs, Button } from '@radix-ui/themes';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import IntentAnalysis from './components/IntentAnalysis';
import Chat from './components/Chat';
import CourseMap from './components/CourseMap';
import CourseDetail from './components/CourseDetail';
import Login from './components/Login';
import { API_CONFIG } from './config';
import './App.css';

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
  const { isAuthenticated, login, logout } = React.useContext(AuthContext);

  // 根据当前路径设置活动标签
  React.useEffect(() => {
    if (location.pathname.startsWith('/course/')) {
      setActiveTab('course-detail');
    } else if (location.pathname === '/courses') {
      setActiveTab('courses');
    } else if (location.pathname === '/course') {
      setActiveTab('course-detail');
    } else if (location.pathname === '/intent') {
      setActiveTab('intent');
    } else {
      setActiveTab('chat');
    }
  }, [location.pathname]);

  if (!isAuthenticated) {
    return <Login onLogin={async (username, password) => {
      try {
        const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.auth}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          credentials: 'include',
          body: new URLSearchParams({
            username: username,
            password: password,
          }),
        });

        if (!response.ok) {
          throw new Error('Login failed');
        }

        // 登录成功后设置认证状态并导航到主界面
        login(username, password);
        navigate('/');
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
        <Tabs.List style={{ 
          flexShrink: 0, 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1rem',
          padding: '0 1rem',
          position: 'relative'
        }}>
          <Tabs.Trigger value="chat">Chat</Tabs.Trigger>
          <Tabs.Trigger value="intent">Intent Analysis</Tabs.Trigger>
          <Tabs.Trigger value="courses">课程地图</Tabs.Trigger>
          <Tabs.Trigger value="course-detail">课程详情</Tabs.Trigger>
          <div style={{ 
            marginLeft: 'auto',
            paddingLeft: '1rem',
            borderLeft: '1px solid var(--gray-5)'
          }}>
            <Button 
              color="red" 
              variant="soft" 
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="logout-button"
            >
              Logout
            </Button>
          </div>
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.auth}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        credentials: 'include',
        body: new URLSearchParams({
          username: username,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_CONFIG.baseURL}/api/v1/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
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