import React from 'react';
import { Text, Flex } from '@radix-ui/themes';
import { ProgressStep } from './types';

interface ProgressLogProps {
  status: string | null;
  progressSteps: ProgressStep[];
}

export const ProgressLog: React.FC<ProgressLogProps> = ({ status, progressSteps }) => {
  console.log('ProgressLog received steps:', progressSteps); // Add debug log

  // Check if all steps are completed
  const isAllCompleted = progressSteps.length > 0 && progressSteps.every(step => step.status === 'completed');

  return (
    <div style={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    }}>
      {progressSteps.map((step) => (
        <div 
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
        </div>
      ))}
      {isAllCompleted && (
        <div style={{
          padding: '12px',
          backgroundColor: 'var(--green-2)',
          borderRadius: 'var(--radius-2)',
          border: '1px solid var(--green-4)',
          marginTop: '8px'
        }}>
          <Flex align="center" gap="2">
            <Text size="2" weight="bold" style={{ color: 'var(--green-9)' }}>
              分析完成
            </Text>
          </Flex>
        </div>
      )}
    </div>
  );
}; 