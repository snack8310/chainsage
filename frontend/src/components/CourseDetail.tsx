import React from 'react';
import { Box, Container, Heading, Text, Flex, Grid, Card, Badge, Button } from '@radix-ui/themes';

interface Lesson {
  title: string;
  duration: string;
  type: 'video' | 'practice' | 'quiz';
  path?: string;
}

interface Module {
  title: string;
  description: string;
  lessons: Lesson[];
}

interface Course {
  title: string;
  description: string;
  duration: string;
  level: string;
  skills: string[];
  modules: Module[];
}

interface CourseDetailProps {
  course: Course;
  onLessonClick?: (lesson: Lesson) => void;
}

const CourseDetail: React.FC<CourseDetailProps> = ({ course, onLessonClick }) => {
  return (
    <Container size="3" style={{ padding: '2rem 0' }}>
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
                      cursor: lesson.path ? 'pointer' : 'default'
                    }}
                    onClick={() => lesson.path && onLessonClick?.(lesson)}
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
                      <Text style={{
                        textDecoration: lesson.path ? 'underline' : 'none',
                        color: lesson.path ? 'var(--blue-9)' : 'inherit'
                      }}>{lesson.title}</Text>
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
          <Card style={{ padding: '2rem', marginBottom: '2rem' }}>
            <Heading size="4" mb="4">课程信息</Heading>
            <Flex direction="column" gap="3">
              <Flex justify="between">
                <Text color="gray">难度</Text>
                <Text>{course.level}</Text>
              </Flex>
              <Flex justify="between">
                <Text color="gray">时长</Text>
                <Text>{course.duration}</Text>
              </Flex>
              <Flex justify="between">
                <Text color="gray">技能</Text>
                <Flex gap="2" wrap="wrap" style={{ maxWidth: '200px' }}>
                  {course.skills.map((skill, index) => (
                    <Badge key={index} color="blue">{skill}</Badge>
                  ))}
                </Flex>
              </Flex>
            </Flex>
          </Card>
        </Box>
      </Grid>
    </Container>
  );
};

export default CourseDetail; 