import React from 'react';
import { Box, Text, Card, Flex } from '@radix-ui/themes';
import { CourseRecommendationResponse, CourseRecommendation } from './types';

interface CourseRecommendationsProps {
  result: CourseRecommendationResponse | null;
  isLoading?: boolean;
  error?: string;
}

export const CourseRecommendations: React.FC<CourseRecommendationsProps> = ({ result, isLoading = false, error }) => {
  if (isLoading) {
    return (
      <Card style={{ 
        padding: '16px',
        backgroundColor: 'var(--gray-1)',
        border: '1px solid var(--gray-5)',
        borderRadius: 'var(--radius-3)'
      }}>
        <Flex direction="column" gap="3">
          <Box>
            <Text size="3" weight="bold" mb="2">课程推荐</Text>
            <Box style={{ 
              padding: '12px',
              backgroundColor: 'var(--gray-2)',
              borderRadius: 'var(--radius-2)',
              border: '1px solid var(--gray-4)'
            }}>
              <Text size="2" style={{ color: 'var(--gray-9)' }}>正在生成推荐...</Text>
            </Box>
          </Box>
        </Flex>
      </Card>
    );
  }

  if (error) {
    return (
      <Card style={{ 
        padding: '16px',
        backgroundColor: 'var(--red-1)',
        border: '1px solid var(--red-5)',
        borderRadius: 'var(--radius-3)'
      }}>
        <Flex direction="column" gap="3">
          <Box>
            <Text size="3" weight="bold" mb="2" color="red">课程推荐错误</Text>
            <Box style={{ 
              padding: '12px',
              backgroundColor: 'var(--red-2)',
              borderRadius: 'var(--radius-2)',
              border: '1px solid var(--red-4)'
            }}>
              <Text size="2" color="red">{error}</Text>
            </Box>
          </Box>
        </Flex>
      </Card>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <Card style={{ 
      padding: '16px',
      backgroundColor: 'var(--gray-1)',
      border: '1px solid var(--gray-5)',
      borderRadius: 'var(--radius-3)'
    }}>
      <Flex direction="column" gap="3">
        <Box>
          <Text size="3" weight="bold" mb="2">课程推荐</Text>
          <Box style={{ 
            padding: '12px',
            backgroundColor: 'var(--gray-2)',
            borderRadius: 'var(--radius-2)',
            border: '1px solid var(--gray-4)'
          }}>
            <Flex direction="column" gap="3">
              {/* 推荐结果 */}
              {result.data.recommendations && result.data.recommendations.length > 0 ? (
                <Box>
                  <Text size="2" weight="bold" mb="1">推荐课程：</Text>
                  <Flex direction="column" gap="2">
                    {result.data.recommendations.map((course: CourseRecommendation, index: number) => (
                      <Box key={index} style={{ 
                        padding: '8px',
                        backgroundColor: 'var(--gray-3)',
                        borderRadius: 'var(--radius-2)',
                        border: '1px solid var(--gray-4)'
                      }}>
                        <Text size="2" weight="bold">{course.title}</Text>
                        <Text size="2" color="gray">相关度：{course.relevance_score.toFixed(2)}</Text>
                        <Text size="2" color="gray">来源：{course.source}</Text>
                        <Text size="2" color="gray">页码：{course.page}</Text>
                        <Text size="2" style={{ marginTop: '4px' }}>{course.summary}</Text>
                      </Box>
                    ))}
                  </Flex>
                </Box>
              ) : (
                <Text size="2" color="gray">未找到相关课程</Text>
              )}
            </Flex>
          </Box>
        </Box>
      </Flex>
    </Card>
  );
}; 