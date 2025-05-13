import React from 'react';
import { Box, Button, Text, Container, Flex, Grid, Heading, Card } from '@radix-ui/themes';
import MainLayout from './layout/MainLayout';
import { useRouter } from 'next/router';

const styles = `
  .course-card {
    transition: transform 0.2s;
  }
  .course-card:hover {
    transform: translateY(-4px);
  }
`;

interface CoursesProps {
  username: string;
  onLogout: () => void;
}

const courses = [
  {
    id: 1,
    title: 'Python Basics',
    description: 'Learn Python fundamentals with hands-on projects',
    level: 'Beginner',
    duration: '8 weeks',
    lessons: 24,
    image: '🐍'
  },
  {
    id: 2,
    title: 'Web Development',
    description: 'Master HTML, CSS, and JavaScript',
    level: 'Intermediate',
    duration: '12 weeks',
    lessons: 36,
    image: '🌐'
  },
  {
    id: 3,
    title: 'Data Science',
    description: 'Data analysis and machine learning with Python',
    level: 'Advanced',
    duration: '16 weeks',
    lessons: 48,
    image: '📊'
  },
  {
    id: 4,
    title: 'AI & Machine Learning',
    description: 'Build and train your own AI models',
    level: 'Advanced',
    duration: '20 weeks',
    lessons: 60,
    image: '🤖'
  },
  {
    id: 5,
    title: 'Mobile Development',
    description: 'Create iOS and Android apps',
    level: 'Intermediate',
    duration: '14 weeks',
    lessons: 42,
    image: '📱'
  },
  {
    id: 6,
    title: 'Cloud Computing',
    description: 'Master AWS, Azure, and Google Cloud',
    level: 'Advanced',
    duration: '18 weeks',
    lessons: 54,
    image: '☁️'
  }
];

const Courses: React.FC<CoursesProps> = ({ username, onLogout }) => {
  const router = useRouter();

  const handleCourseClick = (courseId: number) => {
    switch (courseId) {
      case 1:
        router.push('/courses/python');
        break;
      // Add more cases for other courses as they are implemented
      default:
        console.log('Course not implemented yet');
    }
  };

  return (
    <MainLayout username={username} onLogout={onLogout}>
      <style>{styles}</style>
      {/* Hero Section */}
      <Box style={{
        padding: '6rem 0',
        background: 'linear-gradient(135deg, var(--blue-9), var(--indigo-9))',
        color: 'white'
      }}>
        <Container>
          <Flex direction="column" align="center" gap="4">
            <Heading size="8" align="center">Explore Our Courses</Heading>
            <Text size="4" align="center" style={{ maxWidth: '600px' }}>
              Master programming through interactive lessons, real-world projects, and personalized AI guidance
            </Text>
          </Flex>
        </Container>
      </Box>

      {/* Courses Grid */}
      <Container style={{ padding: '4rem 0' }}>
        <Grid columns="3" gap="6">
          {courses.map((course) => (
            <Card
              key={course.id}
              className="course-card"
              style={{
                padding: '2rem',
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                cursor: 'pointer'
              }}
              onClick={() => handleCourseClick(course.id)}
            >
              <Flex direction="column" gap="4">
                <Text size="8" style={{ fontSize: '3rem' }}>{course.image}</Text>
                <Box>
                  <Heading size="4" mb="2">{course.title}</Heading>
                  <Text color="gray" mb="4">{course.description}</Text>
                </Box>
                <Flex justify="between" align="center" style={{ borderTop: '1px solid var(--gray-5)', paddingTop: '1rem' }}>
                  <Flex gap="4">
                    <Text size="2" color="gray">{course.level}</Text>
                    <Text size="2" color="gray">⏱️ {course.duration}</Text>
                  </Flex>
                  <Text size="2" color="gray">📚 {course.lessons} lessons</Text>
                </Flex>
                <Button variant="solid" style={{ background: 'var(--blue-9)' }}>Start Learning</Button>
              </Flex>
            </Card>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Box style={{ background: 'var(--gray-2)', padding: '6rem 0' }}>
        <Container>
          <Grid columns="3" gap="6">
            <Box>
              <Heading size="4" mb="3">AI-Powered Learning</Heading>
              <Text color="gray">
                Get personalized feedback and guidance from our AI tutor that adapts to your learning style
              </Text>
            </Box>
            <Box>
              <Heading size="4" mb="3">Project-Based Learning</Heading>
              <Text color="gray">
                Build real-world projects that you can add to your portfolio while learning
              </Text>
            </Box>
            <Box>
              <Heading size="4" mb="3">Community Support</Heading>
              <Text color="gray">
                Join a community of learners, share your progress, and get help when you need it
              </Text>
            </Box>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container style={{ padding: '6rem 0' }}>
        <Flex direction="column" align="center" gap="4">
          <Heading size="6" align="center">Ready to Start Your Coding Journey?</Heading>
          <Text size="4" color="gray" align="center" style={{ maxWidth: '600px' }}>
            Join thousands of learners who are already building their future with ChainSage
          </Text>
          <Button size="4" variant="solid" style={{ background: 'var(--blue-9)' }}>
            Get Started for Free
          </Button>
        </Flex>
      </Container>
    </MainLayout>
  );
};

export default Courses; 