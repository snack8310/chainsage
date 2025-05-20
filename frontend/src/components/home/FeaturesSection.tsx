import React from 'react';
import { Box, Text, Grid, Heading, Container } from '@radix-ui/themes';

const FeaturesSection: React.FC = () => {
  return (
    <Box style={{ background: 'var(--gray-2)', padding: '6rem 0' }}>
      <Container>
        <Grid columns="3" gap="6">
          <Box>
            <Heading size="4" mb="3">AI-Powered Efficiency</Heading>
            <Text color="gray">
              Learn how to leverage AI tools to streamline your workflow and boost productivity
            </Text>
          </Box>
          <Box>
            <Heading size="4" mb="3">Practical Applications</Heading>
            <Text color="gray">
              Master real-world AI applications that solve common workplace challenges
            </Text>
          </Box>
          <Box>
            <Heading size="4" mb="3">Expert Support</Heading>
            <Text color="gray">
              Get guidance from AI experts and share experiences with other professionals
            </Text>
          </Box>
        </Grid>
      </Container>
    </Box>
  );
};

export default FeaturesSection; 