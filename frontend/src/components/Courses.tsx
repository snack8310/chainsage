import React from 'react';
import { Box, Button, Text, Container, Flex, Grid } from '@radix-ui/themes';
import MainLayout from './layout/MainLayout';

interface CoursesProps {
  username: string;
  onLogout: () => void;
}

const Courses: React.FC<CoursesProps> = ({ username, onLogout }) => {
  return (
    <MainLayout username={username} onLogout={onLogout}>
      {/* Hero Section */}
      <Box style={{
        padding: '4rem 0',
        background: 'linear-gradient(to right, var(--blue-9), var(--indigo-9))',
        color: 'white'
      }}>
        <Container>
          <Flex direction="column" align="center" gap="4">
            <Text size="8" weight="bold">Welcome to ChainSage</Text>
            <Text size="4">Your AI-powered learning journey starts here</Text>
          </Flex>
        </Container>
      </Box>

      {/* Features Section */}
      <Container style={{ padding: '4rem 0' }}>
        <Grid columns="3" gap="4">
          {/* Feature 1 */}
          <Box style={{
            padding: '2rem',
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <Text size="5" weight="bold" mb="2">Interactive Learning</Text>
            <Text color="gray">Learn through hands-on exercises and real-time feedback</Text>
          </Box>

          {/* Feature 2 */}
          <Box style={{
            padding: '2rem',
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <Text size="5" weight="bold" mb="2">AI Assistance</Text>
            <Text color="gray">Get personalized help and guidance from our AI tutor</Text>
          </Box>

          {/* Feature 3 */}
          <Box style={{
            padding: '2rem',
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <Text size="5" weight="bold" mb="2">Progress Tracking</Text>
            <Text color="gray">Monitor your learning journey with detailed analytics</Text>
          </Box>
        </Grid>
      </Container>

      {/* Call to Action Section */}
      <Box style={{
        padding: '4rem 0',
        background: 'var(--gray-2)'
      }}>
        <Container>
          <Flex direction="column" align="center" gap="4">
            <Text size="6" weight="bold">Ready to Start Learning?</Text>
            <Button size="3">Begin Your Journey</Button>
          </Flex>
        </Container>
      </Box>
    </MainLayout>
  );
};

export default Courses; 