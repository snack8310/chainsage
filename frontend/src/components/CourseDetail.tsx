import React from 'react';
import { Box, Container, Heading, Text, Flex, Grid, Card, Badge, Button } from '@radix-ui/themes';

interface CourseDetailProps {
  course: {
    title: string;
    description: string;
    duration: string;
    level: string;
    skills: string[];
    modules: {
      title: string;
      description: string;
      lessons: {
        title: string;
        duration: string;
        type: 'video' | 'practice' | 'quiz';
      }[];
    }[];
  };
}

const CourseDetail: React.FC<CourseDetailProps> = ({ course }) => {
  return (
    <Container style={{ padding: '4rem 0' }}>
      {/* Course Header */}
      <Box mb="8">
        <Flex direction="column" gap="4">
          <Heading size="8">{course.title}</Heading>
          <Text size="4" color="gray">{course.description}</Text>
          <Flex gap="4" align="center">
            <Badge color={course.level === "入门" ? "green" : course.level === "中级" ? "blue" : "purple"}>
              {course.level}
            </Badge>
            <Text color="gray">课程时长：{course.duration}</Text>
          </Flex>
          <Flex gap="2" wrap="wrap">
            {course.skills.map((skill, index) => (
              <Badge key={index} color="blue">{skill}</Badge>
            ))}
          </Flex>
        </Flex>
      </Box>

      {/* Course Content */}
      <Grid columns="3" gap="6">
        {/* Main Content */}
        <Box style={{ gridColumn: 'span 2' }}>
          {course.modules.map((module, index) => (
            <Card key={index} style={{ marginBottom: '2rem', padding: '2rem' }}>
              <Heading size="4" mb="4">{module.title}</Heading>
              <Text color="gray" mb="4">{module.description}</Text>
              
              <Box>
                {module.lessons.map((lesson, lessonIndex) => (
                  <Flex 
                    key={lessonIndex}
                    justify="between"
                    align="center"
                    style={{
                      padding: '1rem',
                      borderBottom: '1px solid var(--gray-4)',
                      cursor: 'pointer'
                    }}
                  >
                    <Flex gap="3" align="center">
                      <Badge color={
                        lesson.type === 'video' ? 'red' :
                        lesson.type === 'practice' ? 'green' :
                        'blue'
                      }>
                        {lesson.type === 'video' ? '视频' :
                         lesson.type === 'practice' ? '练习' :
                         '测验'}
                      </Badge>
                      <Text>{lesson.title}</Text>
                    </Flex>
                    <Text color="gray">{lesson.duration}</Text>
                  </Flex>
                ))}
              </Box>
            </Card>
          ))}
        </Box>

        {/* Sidebar */}
        <Box>
          <Card style={{ padding: '2rem', position: 'sticky', top: '2rem' }}>
            <Flex direction="column" gap="4">
              <Heading size="4">课程概览</Heading>
              <Box>
                <Text weight="bold" mb="2">你将学到：</Text>
                <Flex direction="column" gap="2">
                  {course.skills.map((skill, index) => (
                    <Text key={index}>• {skill}</Text>
                  ))}
                </Flex>
              </Box>
              <Box>
                <Text weight="bold" mb="2">课程包含：</Text>
                <Flex direction="column" gap="2">
                  <Text>• {course.modules.reduce((acc, module) => acc + module.lessons.length, 0)} 个课时</Text>
                  <Text>• 实践练习</Text>
                  <Text>• 测验评估</Text>
                  <Text>• 证书认证</Text>
                </Flex>
              </Box>
              <Button size="3" style={{ marginTop: '1rem' }}>
                开始学习
              </Button>
            </Flex>
          </Card>
        </Box>
      </Grid>
    </Container>
  );
};

export default CourseDetail; 