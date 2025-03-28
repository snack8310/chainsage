import React from 'react';
import { Box, Text, Card, Flex, ScrollArea } from '@radix-ui/themes';

interface CourseRecommendation {
  title: string;
  relevance_score: number;
  summary: string;
  source: string;
  page: number;
}

interface CourseRecommendationsProps {
  result: {
    recommendations?: CourseRecommendation[];
    metadata?: {
      total_courses?: number;
      query_context?: {
        intent?: string;
        confidence?: number;
      };
    };
    logs?: string[];
  } | null;
  isLoading?: boolean;
}

export const CourseRecommendations: React.FC<CourseRecommendationsProps> = ({ result, isLoading = false }) => {
  if (isLoading) {
    return (
      <Card>
        <Flex direction="column" gap="2">
          <Text size="3" weight="bold">课程推荐</Text>
          <Text size="2">正在生成推荐...</Text>
        </Flex>
      </Card>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <Card>
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
              {/* 推荐课程列表 */}
              {result.recommendations && result.recommendations.length > 0 ? (
                <Box>
                  <Text size="2" weight="bold" mb="2">推荐课程：</Text>
                  <Flex direction="column" gap="3">
                    {result.recommendations.map((course, index) => (
                      <Box key={index} style={{
                        padding: '12px',
                        backgroundColor: 'var(--gray-1)',
                        borderRadius: 'var(--radius-2)',
                        border: '1px solid var(--gray-3)'
                      }}>
                        <Flex direction="column" gap="2">
                          <Text size="2" weight="bold">{course.title}</Text>
                          <Text size="2" color="gray">相关度：{(course.relevance_score * 100).toFixed(1)}%</Text>
                          <Text size="2" color="gray">来源：{course.source} - 第{course.page}页</Text>
                          <Text size="2">{course.summary}</Text>
                        </Flex>
                      </Box>
                    ))}
                  </Flex>
                </Box>
              ) : (
                <Text size="2">未找到相关课程</Text>
              )}

              {/* 元数据信息 */}
              {result.metadata && (
                <Box>
                  <Text size="2" weight="bold" mb="1">查询信息：</Text>
                  {result.metadata.query_context && (
                    <>
                      <Text size="2">意图：{result.metadata.query_context.intent || '未知'}</Text>
                      <Text size="2">置信度：{result.metadata.query_context.confidence ? `${(result.metadata.query_context.confidence * 100).toFixed(1)}%` : '未知'}</Text>
                    </>
                  )}
                  <Text size="2">推荐课程数：{result.metadata.total_courses || 0}</Text>
                </Box>
              )}
            </Flex>
          </Box>
        </Box>

        {/* 日志显示区域 */}
        {result.logs && result.logs.length > 0 && (
          <Box>
            <Text size="3" weight="bold" mb="2">处理日志</Text>
            <Box style={{ 
              padding: '12px',
              backgroundColor: 'var(--gray-2)',
              borderRadius: 'var(--radius-2)',
              border: '1px solid var(--gray-4)',
              maxHeight: '200px',
              overflow: 'auto'
            }}>
              <ScrollArea style={{ height: '100%' }}>
                <Flex direction="column" gap="2">
                  {result.logs.map((log: string, index: number) => (
                    <Text key={index} size="2" style={{ whiteSpace: 'pre-wrap' }}>{log}</Text>
                  ))}
                </Flex>
              </ScrollArea>
            </Box>
          </Box>
        )}
      </Flex>
    </Card>
  );
}; 