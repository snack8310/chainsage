import React from 'react';
import { Box, Button, Text, Container, Flex, Grid, Heading, Card } from '@radix-ui/themes';
import { useRouter } from 'next/router';

const styles = `
  .lesson-card {
    transition: transform 0.2s;
  }
  .lesson-card:hover {
    transform: translateY(-4px);
  }
`;

const lessons = [
  {
    id: 1,
    title: 'Introduction to Python',
    description: 'Learn what Python is and why it\'s so popular',
    duration: '10 minutes',
    type: 'lesson'
  },
  {
    id: 2,
    title: 'Print Statements',
    description: 'Learn how to display text in Python',
    duration: '15 minutes',
    type: 'lesson'
  },
  {
    id: 3,
    title: 'Variables',
    description: 'Store and manipulate data with variables',
    duration: '20 minutes',
    type: 'lesson'
  },
  {
    id: 4,
    title: 'Data Types',
    description: 'Explore different types of data in Python',
    duration: '25 minutes',
    type: 'lesson'
  },
  {
    id: 5,
    title: 'Strings',
    description: 'Work with text data in Python',
    duration: '30 minutes',
    type: 'lesson'
  },
  {
    id: 6,
    title: 'Numbers',
    description: 'Perform calculations with numbers',
    duration: '25 minutes',
    type: 'lesson'
  },
  {
    id: 7,
    title: 'Booleans',
    description: 'Understand true and false values',
    duration: '20 minutes',
    type: 'lesson'
  },
  {
    id: 8,
    title: 'If Statements',
    description: 'Make decisions in your code',
    duration: '30 minutes',
    type: 'lesson'
  },
  {
    id: 9,
    title: 'Lists',
    description: 'Store multiple items in a single variable',
    duration: '35 minutes',
    type: 'lesson'
  },
  {
    id: 10,
    title: 'For Loops',
    description: 'Repeat actions with loops',
    duration: '30 minutes',
    type: 'lesson'
  },
  {
    id: 11,
    title: 'While Loops',
    description: 'Create loops that run until a condition is met',
    duration: '25 minutes',
    type: 'lesson'
  },
  {
    id: 12,
    title: 'Functions',
    description: 'Create reusable blocks of code',
    duration: '40 minutes',
    type: 'lesson'
  }
];

const PythonCourse: React.FC = () => {
  const router = useRouter();

  const handleLessonClick = (lessonId: number) => {
    router.push(`/courses/python/lesson/${lessonId}`);
  };

  return (
    <>
      <style>{styles}</style>
      {/* Hero Section */}
      <Box style={{
        padding: '6rem 0',
        background: 'linear-gradient(135deg, var(--blue-9), var(--indigo-9))',
        color: 'white'
      }}>
        <Container>
          <Flex direction="column" align="center" gap="4">
            <Text size="8" style={{ fontSize: '3rem' }}>🐍</Text>
            <Heading size="8" align="center">Python Basics</Heading>
            <Text size="4" align="center" style={{ maxWidth: '600px' }}>
              Learn Python programming from scratch with interactive lessons and hands-on projects
            </Text>
            <Flex gap="4" mt="4">
              <Button size="3" variant="solid" style={{ background: 'white', color: 'var(--blue-9)' }}>
                Start Learning
              </Button>
              <Button size="3" variant="outline" style={{ borderColor: 'white', color: 'white' }}>
                View Curriculum
              </Button>
            </Flex>
          </Flex>
        </Container>
      </Box>

      {/* Course Content */}
      <Container style={{ padding: '4rem 0' }}>
        <Grid columns="2" gap="6">
          {/* Left Column - Course Info */}
          <Box>
            <Card style={{ padding: '2rem', marginBottom: '2rem' }}>
              <Flex direction="column" gap="4">
                <Heading size="4">Course Overview</Heading>
                <Text color="gray">
                  Python is one of the most popular programming languages in the world. It's known for its simplicity and readability, making it perfect for beginners. In this course, you'll learn the fundamentals of Python programming through interactive lessons and hands-on projects.
                </Text>
                <Box style={{ borderTop: '1px solid var(--gray-5)', paddingTop: '1rem' }}>
                  <Flex justify="between" mb="2">
                    <Text weight="bold">Level</Text>
                    <Text>Beginner</Text>
                  </Flex>
                  <Flex justify="between" mb="2">
                    <Text weight="bold">Duration</Text>
                    <Text>8 weeks</Text>
                  </Flex>
                  <Flex justify="between" mb="2">
                    <Text weight="bold">Lessons</Text>
                    <Text>12 lessons</Text>
                  </Flex>
                  <Flex justify="between">
                    <Text weight="bold">Projects</Text>
                    <Text>4 hands-on projects</Text>
                  </Flex>
                </Box>
              </Flex>
            </Card>

            <Card style={{ padding: '2rem' }}>
              <Flex direction="column" gap="4">
                <Heading size="4">What You'll Learn</Heading>
                <Grid columns="2" gap="3">
                  <Flex gap="2" align="center">
                    <Text>✓</Text>
                    <Text>Python syntax and basics</Text>
                  </Flex>
                  <Flex gap="2" align="center">
                    <Text>✓</Text>
                    <Text>Variables and data types</Text>
                  </Flex>
                  <Flex gap="2" align="center">
                    <Text>✓</Text>
                    <Text>Control flow</Text>
                  </Flex>
                  <Flex gap="2" align="center">
                    <Text>✓</Text>
                    <Text>Functions and modules</Text>
                  </Flex>
                  <Flex gap="2" align="center">
                    <Text>✓</Text>
                    <Text>Lists and loops</Text>
                  </Flex>
                  <Flex gap="2" align="center">
                    <Text>✓</Text>
                    <Text>Error handling</Text>
                  </Flex>
                </Grid>
              </Flex>
            </Card>
          </Box>

          {/* Right Column - Lessons List */}
          <Box>
            <Heading size="4" mb="4">Course Content</Heading>
            <Flex direction="column" gap="3">
              {lessons.map((lesson) => (
                <Card
                  key={lesson.id}
                  className="lesson-card"
                  style={{
                    padding: '1.5rem',
                    background: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleLessonClick(lesson.id)}
                >
                  <Flex justify="between" align="center">
                    <Box>
                      <Heading size="3" mb="1">{lesson.title}</Heading>
                      <Text color="gray">{lesson.description}</Text>
                    </Box>
                    <Text size="2" color="gray">⏱️ {lesson.duration}</Text>
                  </Flex>
                </Card>
              ))}
            </Flex>
          </Box>
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box style={{ background: 'var(--gray-2)', padding: '6rem 0' }}>
        <Container>
          <Flex direction="column" align="center" gap="4">
            <Heading size="6" align="center">Ready to Start Learning Python?</Heading>
            <Text size="4" color="gray" align="center" style={{ maxWidth: '600px' }}>
              Join thousands of learners who are already building their future with Python
            </Text>
            <Button size="4" variant="solid" style={{ background: 'var(--blue-9)' }}>
              Start Learning for Free
            </Button>
          </Flex>
        </Container>
      </Box>
    </>
  );
};

export default PythonCourse; 