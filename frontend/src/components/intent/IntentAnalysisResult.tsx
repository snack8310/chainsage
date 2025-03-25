import React from 'react';
import { Box, Card, Text, Flex } from '@radix-ui/themes';
import { IntentResult } from './types';

interface IntentAnalysisResultProps {
  result: IntentResult;
}

export const IntentAnalysisResult: React.FC<IntentAnalysisResultProps> = ({ result }) => {
  return (
    <Card style={{ 
      padding: '16px',
      backgroundColor: 'var(--gray-1)',
      border: '1px solid var(--gray-5)',
      borderRadius: 'var(--radius-3)'
    }}>
      <Flex direction="column" gap="3">
        <Box>
          <Text size="3" weight="bold" mb="2">意图分析结果</Text>
          <Box style={{ 
            padding: '12px',
            backgroundColor: 'var(--gray-2)',
            borderRadius: 'var(--radius-2)',
            border: '1px solid var(--gray-4)'
          }}>
            <Flex direction="column" gap="2">
              <Flex align="center" gap="2">
                <Text size="2" weight="bold" style={{ color: 'var(--gray-12)' }}>
                  识别到的意图：
                </Text>
                <Text size="2" style={{ color: 'var(--blue-9)' }}>
                  {result.intent}
                </Text>
              </Flex>
              <Flex align="center" gap="2">
                <Text size="2" weight="bold" style={{ color: 'var(--gray-12)' }}>
                  置信度：
                </Text>
                <Text size="2" style={{ color: 'var(--green-9)' }}>
                  {(result.confidence * 100).toFixed(1)}%
                </Text>
              </Flex>
              {Object.keys(result.entities).length > 0 && (
                <Box>
                  <Text size="2" weight="bold" style={{ color: 'var(--gray-12)' }} mb="1">
                    识别到的实体：
                  </Text>
                  <Flex direction="column" gap="1">
                    {Object.entries(result.entities).map(([key, value]) => (
                      <Flex key={key} align="center" gap="2">
                        <Text size="2" style={{ color: 'var(--gray-11)' }}>
                          {key}：
                        </Text>
                        <Text size="2" style={{ color: 'var(--gray-12)' }}>
                          {value}
                        </Text>
                      </Flex>
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