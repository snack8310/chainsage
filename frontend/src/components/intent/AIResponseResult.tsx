import React from 'react';
import { Box, Card, Text, ScrollArea, Flex } from '@radix-ui/themes';
import { AIResponse } from './types';

interface AIResponseResultProps {
  result: AIResponse;
}

export const AIResponseResult: React.FC<AIResponseResultProps> = ({ result }) => {
  return (
    <Card style={{ height: '100%', overflow: 'hidden' }}>
      <Flex direction="column" style={{ height: '100%' }}>
        <Box p="3">
          <Text size="5" weight="bold">AI 响应</Text>
        </Box>
        <ScrollArea style={{ flex: 1, overflow: 'hidden' }}>
          <Box p="3">
            <Box mb="4">
              <Text size="3" weight="bold">主要回答</Text>
              <Text size="2" color="gray">{result.response.main_answer}</Text>
            </Box>

            <Box mb="4">
              <Text size="3" weight="bold">关键要点</Text>
              {result.response.key_points.map((point, index) => (
                <Text key={index} size="2" color="gray">• {point}</Text>
              ))}
            </Box>

            <Box mb="4">
              <Text size="3" weight="bold">实践示例</Text>
              {result.response.practical_examples.map((example, index) => (
                <Text key={index} size="2" color="gray">• {example}</Text>
              ))}
            </Box>

            <Box mb="4">
              <Text size="3" weight="bold">实施步骤</Text>
              {result.response.implementation_steps.map((step, index) => (
                <Text key={index} size="2" color="gray">• {step}</Text>
              ))}
            </Box>

            <Box mb="4">
              <Text size="3" weight="bold">常见陷阱</Text>
              {result.response.common_pitfalls.map((pitfall, index) => (
                <Text key={index} size="2" color="gray">• {pitfall}</Text>
              ))}
            </Box>

            <Box mb="4">
              <Text size="3" weight="bold">最佳实践</Text>
              {result.response.best_practices.map((practice, index) => (
                <Text key={index} size="2" color="gray">• {practice}</Text>
              ))}
            </Box>

            <Box mb="4">
              <Text size="3" weight="bold">额外资源</Text>
              {result.response.additional_resources.map((resource, index) => (
                <Text key={index} size="2" color="gray">• {resource}</Text>
              ))}
            </Box>

            <Box>
              <Text size="3" weight="bold">元数据</Text>
              <Box mb="2">
                <Text size="2" weight="bold">置信度:</Text>
                <Text size="2" color="gray">{(result.metadata.confidence * 100).toFixed(2)}%</Text>
              </Box>
              <Box mb="2">
                <Text size="2" weight="bold">复杂度:</Text>
                <Text size="2" color="gray">{result.metadata.complexity}</Text>
              </Box>
              <Box mb="2">
                <Text size="2" weight="bold">预计时间:</Text>
                <Text size="2" color="gray">{result.metadata.estimated_time} 分钟</Text>
              </Box>
              <Box mb="2">
                <Text size="2" weight="bold">目标受众:</Text>
                <Text size="2" color="gray">{result.metadata.target_audience}</Text>
              </Box>
              <Box>
                <Text size="2" weight="bold">前置条件:</Text>
                {result.metadata.prerequisites.map((prerequisite, index) => (
                  <Text key={index} size="2" color="gray">• {prerequisite}</Text>
                ))}
              </Box>
            </Box>
          </Box>
        </ScrollArea>
      </Flex>
    </Card>
  );
}; 