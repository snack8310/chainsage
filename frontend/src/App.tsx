import React, { useState } from 'react';
import { Box, Tabs } from '@radix-ui/themes';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import IntentAnalysis from './components/IntentAnalysis';
import Chat from './components/Chat';
import CourseMap from './components/CourseMap';
import CourseDetail from './components/CourseDetail';
import CourseList from './components/CourseList';

const MainContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const location = useLocation();
  const navigate = useNavigate();

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
        <Tabs.List style={{ flexShrink: 0 }}>
          <Tabs.Trigger value="chat">Chat</Tabs.Trigger>
          <Tabs.Trigger value="intent">Intent Analysis</Tabs.Trigger>
          <Tabs.Trigger value="courses">课程地图</Tabs.Trigger>
          <Tabs.Trigger value="course-detail">课程详情</Tabs.Trigger>
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
            <Routes>
              <Route path="/course" element={<CourseList />} />
              <Route path="/course/:id" element={<CourseDetail />} />
            </Routes>
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </Box>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainContent />} />
        <Route path="/intent" element={<MainContent />} />
        <Route path="/courses" element={<MainContent />} />
        <Route path="/course" element={<MainContent />} />
        <Route path="/course/:id" element={<MainContent />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App; 