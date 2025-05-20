import React from 'react';
import { Box, Button, Text, Flex, Heading } from '@radix-ui/themes';

const HeroSection: React.FC = () => {
  return (
    <Box style={{
      padding: '3rem',
      background: 'linear-gradient(135deg, var(--blue-9), var(--indigo-9))',
      color: 'white',
      borderRadius: '12px',
      marginBottom: '3rem'
    }}>
      <Flex direction="column" gap="4">
        <Heading size="8">
          Master AI in Your Workplace
        </Heading>
        <Text size="4" style={{ maxWidth: '500px' }}>
          Enhance your productivity with AI tools through practical workplace scenarios, real-world applications, and expert guidance
        </Text>
        <Flex gap="4">
          <Button size="3" variant="solid" style={{ background: 'white', color: 'var(--blue-9)' }}>
            Start Training
          </Button>
          <Button size="3" variant="outline" style={{ borderColor: 'white', color: 'white' }}>
            View Programs
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default HeroSection; 