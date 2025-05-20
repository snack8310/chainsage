import React from 'react';
import { Box, Text, Grid, Heading, Flex } from '@radix-ui/themes';

const PopularPrograms: React.FC = () => {
  const programs = [
    {
      title: '提示词编写练习',
      description: 'AI工具基础课程 - 掌握提示词编写技巧',
      level: '基础',
      duration: '2-4 课时',
      path: 'courses/ai-tools-basic/quiz/2-4'
    },
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
  ];

  return (
    <>
      <Heading size="6" mb="6" align="center">Popular Programs</Heading>
      <Grid columns="2" gap="6">
        {programs.map((course, index) => (
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
            onClick={() => {
              if (course.path) {
                window.location.href = `/${course.path}`;
              }
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
    </>
  );
};

export default PopularPrograms; 