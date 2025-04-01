import React from 'react';
import { Box, Text, Flex, Button } from '@radix-ui/themes';
import { useNavigate, useParams } from 'react-router-dom';
import { courses } from '../data/courses';

const CourseDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const course = courses.find(c => c.id === Number(id));

  if (!course) {
    return (
      <Box style={{
        height: '100%',
        padding: '40px',
        backgroundColor: 'var(--gray-1)',
        position: 'relative',
        overflow: 'auto'
      }}>
        <Flex direction="column" gap="4" align="center" justify="center" style={{ height: '100%' }}>
          <Text size="6" weight="bold">课程未找到</Text>
          <Button onClick={() => navigate('/course')}>返回课程列表</Button>
        </Flex>
      </Box>
    );
  }

  return (
    <Box style={{
      height: '100%',
      padding: '40px',
      backgroundColor: 'var(--gray-1)',
      position: 'relative',
      overflow: 'auto'
    }}>
      <Flex direction="column" gap="4" style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* 返回按钮 */}
        <Button variant="ghost" onClick={() => navigate('/course')}>
          返回课程列表
        </Button>

        {/* 课程标题 */}
        <Text size="8" weight="bold">
          {course.title}
        </Text>

        {/* 课程信息 */}
        <Flex direction="column" gap="2">
          <Text size="4">{course.description}</Text>
          <Flex gap="4">
            <Text size="2">难度：{course.level === 'beginner' ? '入门' : course.level === 'intermediate' ? '进阶' : '高级'}</Text>
            <Text size="2">时长：{course.duration}</Text>
            {course.completed && (
              <Text size="2" color="green" weight="bold">
                已完成
              </Text>
            )}
          </Flex>
        </Flex>

        {/* 前置课程 */}
        {course.prerequisites && course.prerequisites.length > 0 && (
          <Flex direction="column" gap="2">
            <Text size="4" weight="bold">前置课程</Text>
            <Flex direction="column" gap="1">
              {course.prerequisites.map((prereq, index) => (
                <Text key={index} size="2">• {prereq}</Text>
              ))}
            </Flex>
          </Flex>
        )}
      </Flex>
    </Box>
  );
};

export default CourseDetail; 