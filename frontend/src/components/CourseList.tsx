import React from 'react';
import { Box, Text, Flex, Card } from '@radix-ui/themes';
import { useNavigate } from 'react-router-dom';
import { courses } from '../data/courses';

const CourseList: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box style={{
      height: '100%',
      padding: '40px',
      backgroundColor: 'var(--gray-1)',
      position: 'relative',
      overflow: 'auto'
    }}>
      <Flex direction="column" gap="4" style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* 标题 */}
        <Text size="8" weight="bold">
          选择课程
        </Text>

        {/* 课程列表 */}
        <Flex direction="column" gap="3">
          {courses.map((course) => (
            <Card key={course.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/course/${course.id}`)}>
              <Flex direction="column" gap="2">
                <Flex justify="between" align="center">
                  <Text size="4" weight="bold">{course.title}</Text>
                  <Text size="2" color="gray">{course.duration}</Text>
                </Flex>
                <Text size="2" color="gray">{course.description}</Text>
                <Flex gap="2" align="center">
                  <Text size="2">难度：{course.level === 'beginner' ? '入门' : course.level === 'intermediate' ? '进阶' : '高级'}</Text>
                  {course.completed && (
                    <Text size="2" color="green" weight="bold">
                      已完成
                    </Text>
                  )}
                </Flex>
              </Flex>
            </Card>
          ))}
        </Flex>
      </Flex>
    </Box>
  );
};

export default CourseList; 