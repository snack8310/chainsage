import React, { useState } from 'react';
import { Box, TextField, Button, Text } from '@radix-ui/themes';

interface LoginProps {
  onLogin: (username: string, password: string) => Promise<void>;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await onLogin(username, password);
    } catch (error) {
      setError('Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box style={{ 
      height: '100vh', 
      display: 'flex', 
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
        maxWidth: '400px'
      }}>
        <Text as="div" size="6" mb="4" style={{ textAlign: 'center' }}>Login</Text>
        <form onSubmit={handleSubmit}>
          <Box mb="3">
            <TextField.Root>
              <TextField.Input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
            </TextField.Root>
          </Box>
          <Box mb="4">
            <TextField.Root>
              <TextField.Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </TextField.Root>
          </Box>
          {error && (
            <Text color="red" mb="3">{error}</Text>
          )}
          <Button type="submit" style={{ width: '100%' }} disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default Login; 