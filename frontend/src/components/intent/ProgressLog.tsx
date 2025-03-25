import React from 'react';
import { Box, Card, Text, Flex } from '@radix-ui/themes';
import { ProgressStep } from './types';

interface ProgressLogProps {
  status: string | null;
  progressSteps: ProgressStep[];
}

export const ProgressLog: React.FC<ProgressLogProps> = ({ status, progressSteps }) => {
  return (
    <Card style={{ 
      height: '100%',
      padding: '16px',
      backgroundColor: 'var(--gray-1)',
      border: '1px solid var(--gray-5)',
      borderRadius: 'var(--radius-3)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Box style={{ flexShrink: 0 }}>
        <Text size="3" weight="bold" mb="3">分析进度</Text>
      </Box>
      <Box style={{ 
        flex: 1, 
        overflowY: 'auto',
        paddingRight: '8px'
      }}>
        <Flex direction="column" gap="3">
          {progressSteps.map((step) => (
            <Box 
              key={step.id} 
              style={{
                padding: '12px',
                backgroundColor: 'var(--gray-2)',
                borderRadius: 'var(--radius-2)',
                border: '1px solid var(--gray-4)'
              }}
            >
              <Flex direction="column" gap="2">
                <Flex align="center" gap="2">
                  <Text size="2" weight="bold" style={{ color: 'var(--gray-12)' }}>
                    {step.title}
                  </Text>
                  <Text size="2" style={{ color: step.status === 'completed' ? 'var(--green-9)' : 'var(--blue-9)' }}>
                    {step.status === 'completed' ? '已完成' : '处理中'}
                  </Text>
                </Flex>
                <Text size="2" style={{ color: 'var(--gray-11)' }}>
                  {step.description}
                </Text>
              </Flex>
            </Box>
          ))}
        </Flex>
      </Box>
    </Card>
  );
}; 