import React from 'react';
import { Box, Button, Text } from '@radix-ui/themes';

interface HomeProps {
  username: string;
  onLogout: () => void;
}

const Home: React.FC<HomeProps> = ({ username, onLogout }) => {
  return (
    <Box style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'var(--gray-1)'
    }}>
      <Box style={{
        padding: '2rem',
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center'
      }}>
        <Text as="div" size="6" mb="4">Welcome, {username}!</Text>
        <Text as="div" size="3" mb="4" color="gray">You have successfully logged in.</Text>
        <Button onClick={onLogout} style={{ width: '100%' }}>
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default Home; 