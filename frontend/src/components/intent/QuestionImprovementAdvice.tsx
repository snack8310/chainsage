import React from 'react';
import { Box, Text, Card, Flex } from '@radix-ui/themes';
import { QuestionImprovementAdvice as QuestionImprovementAdviceType } from './types';

interface QuestionImprovementAdviceProps {
  result: QuestionImprovementAdviceType;
}

export const QuestionImprovementAdvice: React.FC<QuestionImprovementAdviceProps> = ({ result }) => {
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
              {/* 提问质量评分 */}
              <Box>
                <Text size="2" weight="bold" mb="1">提问质量评分：</Text>
                <Flex gap="2" wrap="wrap">
                  <Box>
                    <Text size="2">清晰度：{result.question_analysis.clarity.toFixed(2)}</Text>
                  </Box>
                  <Box>
                    <Text size="2">具体性：{result.question_analysis.specificity.toFixed(2)}</Text>
                  </Box>
                  <Box>
                    <Text size="2">上下文：{result.question_analysis.context.toFixed(2)}</Text>
                  </Box>
                  <Box>
                    <Text size="2">专业性：{result.question_analysis.professionalism.toFixed(2)}</Text>
                  </Box>
                  <Box>
                    <Text size="2" weight="bold">总体评分：{result.question_analysis.overall_score.toFixed(2)}</Text>
                  </Box>
                </Flex>
              </Box>

              {/* 改进建议 */}
              <Box>
                <Text size="2" weight="bold" mb="1">改进建议：</Text>
                <Flex direction="column" gap="2">
                  {result.improvement_suggestions.clarity_improvements.map((suggestion, index) => (
                    <Text key={index} size="2">• {suggestion}</Text>
                  ))}
                </Flex>
              </Box>

              {/* 最佳实践 */}
              <Box>
                <Text size="2" weight="bold" mb="1">最佳实践：</Text>
                <Flex direction="column" gap="2">
                  <Text size="2">建议的提问结构：{result.best_practices.question_structure}</Text>
                  <Box>
                    <Text size="2" weight="bold" mb="1">关键要素：</Text>
                    {result.best_practices.key_elements.map((element, index) => (
                      <Text key={index} size="2">• {element}</Text>
                    ))}
                  </Box>
                  <Box>
                    <Text size="2" weight="bold" mb="1">示例：</Text>
                    {result.best_practices.examples.map((example, index) => (
                      <Text key={index} size="2">• {example}</Text>
                    ))}
                  </Box>
                </Flex>
              </Box>

              {/* 跟进问题 */}
              <Box>
                <Text size="2" weight="bold" mb="1">跟进问题：</Text>
                <Flex direction="column" gap="2">
                  {result.follow_up_questions.map((question, index) => (
                    <Text key={index} size="2">• {question}</Text>
                  ))}
                </Flex>
              </Box>

              {/* 工作方法洞察 */}
              {result.question_analysis.is_work_method_related && (
                <Box>
                  <Text size="2" weight="bold" mb="1">工作方法洞察：</Text>
                  <Flex direction="column" gap="2">
                    <Text size="2">当前方法分析：{result.work_method_insights.current_approach}</Text>
                    <Box>
                      <Text size="2" weight="bold" mb="1">可能的改进方向：</Text>
                      {result.work_method_insights.potential_improvements.map((improvement, index) => (
                        <Text key={index} size="2">• {improvement}</Text>
                      ))}
                    </Box>
                    <Box>
                      <Text size="2" weight="bold" mb="1">成功指标：</Text>
                      {result.work_method_insights.success_metrics.map((metric, index) => (
                        <Text key={index} size="2">• {metric}</Text>
                      ))}
                    </Box>
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