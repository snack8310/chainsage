import React from 'react';
import { Box, Text, Flex, Heading, Button, Container } from '@radix-ui/themes';

const CTASection: React.FC = () => {
  return (
    <Container style={{ padding: '6rem 0' }}>
      <Flex direction="column" align="center" gap="4">
        <Heading size="6" align="center">Ready to Transform Your Workplace with AI?</Heading>
        <Text size="4" color="gray" align="center" style={{ maxWidth: '600px' }}>
          Join professionals who are already enhancing their productivity with ChainSage AI training
        </Text>
        <Button size="4" variant="solid" style={{ background: 'var(--blue-9)' }}>
          Get Started for Free
        </Button>
      </Flex>
    </Container>
  );
};

export default CTASection; 