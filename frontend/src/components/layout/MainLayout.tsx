import React from 'react';
import { Box, Button, Text, Container, Flex } from '@radix-ui/themes';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface MainLayoutProps {
  children: React.ReactNode;
  username: string;
  onLogout: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, username, onLogout }) => {
  const router = useRouter();
  const currentPath = router.pathname;
  return (
    <Box style={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--gray-1)'
    }}>
      {/* Header Section */}
      <Box style={{
        background: 'white',
        padding: '1rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <Container>
          <Flex justify="between" align="center">
            <Flex gap="4" align="center">
              <Link href="/" style={{ textDecoration: 'none' }}>
                <Text size="5" weight="bold">ChainSage</Text>
              </Link>
              <Flex gap="3">
                <Link href="/courses" style={{ textDecoration: 'none' }}>
                  <Text
                    size="3"
                    color="gray"
                    style={{
                      textDecoration: currentPath === '/courses' ? 'underline' : 'none',
                      textUnderlineOffset: '4px'
                    }}
                  >
                    Courses
                  </Text>
                </Link>
                <Link href="/practices" style={{ textDecoration: 'none' }}>
                  <Text
                    size="3"
                    color="gray"
                    style={{
                      textDecoration: currentPath === '/practices' ? 'underline' : 'none',
                      textUnderlineOffset: '4px'
                    }}
                  >
                    Practices
                  </Text>
                </Link>
                <Link href="/chat" style={{ textDecoration: 'none' }}>
                  <Text
                    size="3"
                    color="gray"
                    style={{
                      textDecoration: currentPath === '/chat' ? 'underline' : 'none',
                      textUnderlineOffset: '4px'
                    }}
                  >
                    Chat
                  </Text>
                </Link>
              </Flex>
            </Flex>
            <Flex gap="3" align="center">
              <Box style={{ 
                padding: '0.5rem 1rem',
                background: 'var(--gray-2)',
                borderRadius: '6px'
              }}>
                <Text size="2" color="gray">Welcome, {username}</Text>
              </Box>
              <Button onClick={onLogout}>Logout</Button>
            </Flex>
          </Flex>
        </Container>
      </Box>

      {/* Main Content */}
      <Box style={{ flex: 1 }}>
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout; 