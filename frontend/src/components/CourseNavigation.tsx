import React from 'react';
import { Box, Container, Text, Flex, Button } from '@radix-ui/themes';
import { useRouter } from 'next/router';

interface CourseNavigationProps {
  title: string;
  prevLesson?: {
    title: string;
    path: string;
  };
  nextLesson?: {
    title: string;
    path: string;
  };
  onRate?: () => void;
}

const CourseNavigation: React.FC<CourseNavigationProps> = ({
  title,
  prevLesson,
  nextLesson,
  onRate
}) => {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <Box 
      style={{ 
        borderTop: '1px solid var(--gray-4)',
        background: 'white',
        padding: '0.5rem 0',
        flexShrink: 0
      }}
    >
      <Container size="4">
        <Flex justify="between" align="center">
          {/* 左侧标题 */}
          <Text size="3" style={{ color: 'var(--gray-11)' }}>{title}</Text>

          {/* 中间导航按钮 */}
          <Flex gap="4" align="center">
            {prevLesson && (
              <Button 
                variant="ghost" 
                onClick={() => handleNavigation(prevLesson.path)}
              >
                ← {prevLesson.title}
              </Button>
            )}
            <Button 
              variant="ghost"
              onClick={onRate}
            >
              评价
            </Button>
            {nextLesson && (
              <Button 
                variant="ghost" 
                onClick={() => handleNavigation(nextLesson.path)}
              >
                {nextLesson.title} →
              </Button>
            )}
          </Flex>

          {/* 右侧占位，保持布局平衡 */}
          <Box style={{ width: '120px' }} />
        </Flex>
      </Container>
    </Box>
  );
};

export default CourseNavigation; 