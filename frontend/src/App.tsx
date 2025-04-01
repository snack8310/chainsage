import React, { useState } from 'react';
import { Box, Tabs } from '@radix-ui/themes';
import IntentAnalysis from './components/IntentAnalysis';
import Chat from './components/Chat';
import CourseMap from './components/CourseMap';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('chat');

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
        onValueChange={setActiveTab} 
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
        </Box>
      </Tabs.Root>
    </Box>
  );
};

export default App; 