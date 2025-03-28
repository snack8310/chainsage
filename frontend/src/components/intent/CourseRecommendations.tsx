import React from 'react';
import { Box, Text, Card, Flex } from '@radix-ui/themes';

interface CourseRecommendationsProps {
  result?: {
    recommendations: Array<{
      title: string;
      relevance_score: number;
      summary: string;
      source: string;
      page: number;
    }>;
    metadata: {
      total_courses: number;
      query_context: {
        intent: string;
        confidence: number;
      };
    };
  };
  isLoading?: boolean;
}

export const CourseRecommendations: React.FC<CourseRecommendationsProps> = ({ result, isLoading = false }) => {
  if (!result && !isLoading) {
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
          <Text size="3" weight="bold" mb="2">相关课程推荐</Text>
          {isLoading ? (
            <Text size="2">正在分析相关课程...</Text>
          ) : result?.recommendations && result.recommendations.length > 0 ? (
            <Flex direction="column" gap="3">
              {result.recommendations.map((course, index) => (
                <Box key={index} style={{
                  padding: '12px',
                  backgroundColor: 'var(--gray-2)',
                  borderRadius: 'var(--radius-2)',
                  border: '1px solid var(--gray-4)'
                }}>
                  <Flex direction="column" gap="2">
                    <Flex justify="between" align="center">
                      <Text size="2" weight="bold">{course.title}</Text>
                      <Text size="1" color="gray">相关度: {(course.relevance_score * 100).toFixed(1)}%</Text>
                    </Flex>
                    <Text size="2">{course.summary}</Text>
                    <Flex gap="2" align="center">
                      <Text size="1" color="gray">来源: {course.source}</Text>
                      <Text size="1" color="gray">页码: {course.page}</Text>
                    </Flex>
                  </Flex>
                </Box>
              ))}
              <Box mt="2">
                <Text size="1" color="gray">
                  共找到 {result.metadata.total_courses} 个相关课程
                </Text>
              </Box>
            </Flex>
          ) : (
            <Text size="2">未找到相关课程</Text>
          )}
        </Box>
      </Flex>
    </Card>
  );
}; 