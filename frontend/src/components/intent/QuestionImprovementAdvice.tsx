import React from 'react';
import { Box, Text, Card, Flex } from '@radix-ui/themes';
import { QuestionImprovementAdvice as QuestionImprovementAdviceType } from './types';

interface QuestionImprovementAdviceProps {
  result?: QuestionImprovementAdviceType;
  isLoading?: boolean;
}

export const QuestionImprovementAdvice: React.FC<QuestionImprovementAdviceProps> = ({ result, isLoading = false }) => {
  return (
    <Card style={{ 
      padding: '16px',
      backgroundColor: 'var(--gray-1)',
      border: '1px solid var(--gray-5)',
      borderRadius: 'var(--radius-3)'
    }}>
      <Flex direction="column" gap="3">
        <Box>
          <Text size="3" weight="bold" mb="2">提问改进建议</Text>
          <Box style={{ 
            padding: '12px',
            backgroundColor: 'var(--gray-2)',
            borderRadius: 'var(--radius-2)',
            border: '1px solid var(--gray-4)'
          }}>
            <Flex direction="column" gap="3">
              {/* 评分详情 */}
              <Box>
                <Text size="2" weight="bold" mb="2">评分详情</Text>
                <Flex direction="column" gap="2">
                  <Flex align="center" gap="2">
                    <Text size="2" style={{ color: 'var(--gray-11)' }}>清晰度：</Text>
                    <Text size="2" style={{ color: 'var(--gray-12)' }}>
                      {isLoading ? '分析中...' : (result?.question_analysis?.clarity || 0)}
                    </Text>
                  </Flex>
                  <Flex align="center" gap="2">
                    <Text size="2" style={{ color: 'var(--gray-11)' }}>具体性：</Text>
                    <Text size="2" style={{ color: 'var(--gray-12)' }}>
                      {isLoading ? '分析中...' : (result?.question_analysis?.specificity || 0)}
                    </Text>
                  </Flex>
                  <Flex align="center" gap="2">
                    <Text size="2" style={{ color: 'var(--gray-11)' }}>上下文：</Text>
                    <Text size="2" style={{ color: 'var(--gray-12)' }}>
                      {isLoading ? '分析中...' : (result?.question_analysis?.context || 0)}
                    </Text>
                  </Flex>
                  <Flex align="center" gap="2">
                    <Text size="2" style={{ color: 'var(--gray-11)' }}>专业性：</Text>
                    <Text size="2" style={{ color: 'var(--gray-12)' }}>
                      {isLoading ? '分析中...' : (result?.question_analysis?.professionalism || 0)}
                    </Text>
                  </Flex>
                  <Flex align="center" gap="2">
                    <Text size="2" style={{ color: 'var(--gray-11)' }}>总分：</Text>
                    <Text size="2" style={{ color: 'var(--gray-12)' }}>
                      {isLoading ? '计算中...' : (result?.question_analysis?.overall_score || 0)}
                    </Text>
                  </Flex>
                </Flex>
              </Box>

              {/* 改进建议 */}
              {!isLoading && result?.improvement_suggestions && (
                <Box>
                  <Text size="2" weight="bold" mb="2">改进建议</Text>
                  <Flex direction="column" gap="2">
                    {Object.entries(result.improvement_suggestions).map(([key, suggestions]) => (
                      <Box key={key}>
                        <Text size="2" style={{ color: 'var(--gray-11)' }} mb="1">
                          {key.replace('_improvements', '')}：
                        </Text>
                        <Flex direction="column" gap="1">
                          {suggestions.map((suggestion, index) => (
                            <Text key={index} size="2" style={{ color: 'var(--gray-12)' }}>
                              • {suggestion}
                            </Text>
                          ))}
                        </Flex>
                      </Box>
                    ))}
                  </Flex>
                </Box>
              )}

              {/* 最佳实践 */}
              {!isLoading && result?.best_practices && (
                <Box>
                  <Text size="2" weight="bold" mb="2">最佳实践</Text>
                  <Flex direction="column" gap="2">
                    <Box>
                      <Text size="2" style={{ color: 'var(--gray-11)' }} mb="1">问题结构：</Text>
                      <Text size="2" style={{ color: 'var(--gray-12)' }}>
                        {result.best_practices.question_structure}
                      </Text>
                    </Box>
                    <Box>
                      <Text size="2" style={{ color: 'var(--gray-11)' }} mb="1">关键要素：</Text>
                      <Flex direction="column" gap="1">
                        {result.best_practices.key_elements.map((element, index) => (
                          <Text key={index} size="2" style={{ color: 'var(--gray-12)' }}>
                            • {element}
                          </Text>
                        ))}
                      </Flex>
                    </Box>
                    <Box>
                      <Text size="2" style={{ color: 'var(--gray-11)' }} mb="1">示例：</Text>
                      <Flex direction="column" gap="1">
                        {result.best_practices.examples.map((example, index) => (
                          <Text key={index} size="2" style={{ color: 'var(--gray-12)' }}>
                            • {example}
                          </Text>
                        ))}
                      </Flex>
                    </Box>
                  </Flex>
                </Box>
              )}

              {/* 后续问题 */}
              {!isLoading && result?.follow_up_questions && result.follow_up_questions.length > 0 && (
                <Box>
                  <Text size="2" weight="bold" mb="2">后续问题</Text>
                  <Flex direction="column" gap="1">
                    {result.follow_up_questions.map((question, index) => (
                      <Text key={index} size="2" style={{ color: 'var(--gray-12)' }}>
                        • {question}
                      </Text>
                    ))}
                  </Flex>
                </Box>
              )}
            </Flex>
          </Box>
        </Box>
      </Flex>
    </Card>
  );
}; 