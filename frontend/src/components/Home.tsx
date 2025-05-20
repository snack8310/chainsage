import React from 'react';
import { Box, Button, Text, Container, Flex, Grid, Heading, Avatar, Card } from '@radix-ui/themes';
import { useAuth } from '../contexts/AuthContext';

const styles = `
  .course-card:hover {
    transform: translateY(-4px);
  }
`;

const Home: React.FC = () => {
  const { username } = useAuth();

  return (
    <>
      <style>{styles}</style>
      <Container style={{ padding: '4rem 0' }}>
        <Flex gap="6">
          {/* Main Content */}
          <Box style={{ flex: 1 }}>
            {/* Hero Section */}
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

            {/* Popular Programs Section */}
            <Heading size="6" mb="6" align="center">Popular Programs</Heading>
            <Grid columns="2" gap="6">
              {[
                {
                  title: 'AI for Business Analysis',
                  description: 'Leverage AI for data analysis and business insights',
                  level: 'Beginner',
                  duration: '6 weeks'
                },
                {
                  title: 'AI-Powered Productivity',
                  description: 'Master AI tools for workplace efficiency',
                  level: 'Intermediate',
                  duration: '8 weeks'
                },
                {
                  title: 'Advanced AI Integration',
                  description: 'Implement AI solutions in your organization',
                  level: 'Advanced',
                  duration: '12 weeks'
                }
              ].map((course, index) => (
                <Box
                  key={index}
                  className="course-card"
                  style={{
                    padding: '2rem',
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    transition: 'transform 0.2s',
                    cursor: 'pointer'
                  }}
                >
                  <Heading size="4" mb="2">{course.title}</Heading>
                  <Text color="gray" mb="4">{course.description}</Text>
                  <Flex justify="between" align="center">
                    <Text size="2" color="gray">{course.level}</Text>
                    <Text size="2" color="gray">{course.duration}</Text>
                  </Flex>
                </Box>
              ))}
            </Grid>
          </Box>

          {/* Sidebar */}
          <Box style={{ width: '300px' }}>
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
          </Box>
        </Flex>
      </Container>

      {/* Features Section */}
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

      {/* CTA Section */}
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
    </>
  );
};

export default Home; 