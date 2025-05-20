import React from 'react';
import { Box, Text, Flex, Avatar, Card, Button } from '@radix-ui/themes';
import { useAuth } from '../../contexts/AuthContext';

const UserSidebar: React.FC = () => {
  const { username } = useAuth();

  return (
    <Card style={{ padding: '1.5rem' }}>
      <Flex direction="column" gap="4">
        <Flex align="center" gap="3">
          <Avatar
            size="3"
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop"
            fallback="JD"
          />
          <Box>
            <Text size="3" weight="bold">{username}</Text>
            <Text size="2" color="gray">Premium Member</Text>
          </Box>
        </Flex>

        <Box style={{ borderTop: '1px solid var(--gray-5)', paddingTop: '1rem' }}>
          <Text size="2" weight="bold" mb="2">Learning Progress</Text>
          <Flex direction="column" gap="2">
            <Box>
              <Flex justify="between" mb="1">
                <Text size="2">Python Basics</Text>
                <Text size="2">75%</Text>
              </Flex>
              <Box style={{ height: '4px', background: 'var(--gray-4)', borderRadius: '2px' }}>
                <Box style={{ width: '75%', height: '100%', background: 'var(--blue-9)', borderRadius: '2px' }} />
              </Box>
            </Box>
            <Box>
              <Flex justify="between" mb="1">
                <Text size="2">Web Development</Text>
                <Text size="2">45%</Text>
              </Flex>
              <Box style={{ height: '4px', background: 'var(--gray-4)', borderRadius: '2px' }}>
                <Box style={{ width: '45%', height: '100%', background: 'var(--blue-9)', borderRadius: '2px' }} />
              </Box>
            </Box>
          </Flex>
        </Box>

        <Box style={{ borderTop: '1px solid var(--gray-5)', paddingTop: '1rem' }}>
          <Text size="2" weight="bold" mb="2">Recent Activity</Text>
          <Flex direction="column" gap="2">
            <Text size="2">Completed Python Basics - Lesson 3</Text>
            <Text size="2">Started Web Development Course</Text>
            <Text size="2">Earned "Quick Learner" Badge</Text>
          </Flex>
        </Box>

        <Button variant="outline" style={{ marginTop: '1rem' }}>View Full Profile</Button>
      </Flex>
    </Card>
  );
};

export default UserSidebar; 