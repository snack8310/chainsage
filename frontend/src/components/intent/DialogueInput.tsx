import React from 'react';
import { Box, Card, Text, TextField, Button, Flex } from '@radix-ui/themes';

interface DialogueInputProps {
  onSubmit: (question: string) => void;
  isLoading: boolean;
  value: string;
  onChange: (value: string) => void;
}

export const DialogueInput: React.FC<DialogueInputProps> = ({ onSubmit, isLoading, value, onChange }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(value);
  };

  return (
    <Card style={{ 
      flexShrink: 0,
      padding: '16px',
      backgroundColor: 'var(--gray-1)',
      border: '1px solid var(--gray-5)',
      borderRadius: 'var(--radius-3)'
    }}>
      <form onSubmit={handleSubmit}>
        <Flex direction="column" gap="3">
          <Box>
            <Text size="3" weight="bold" mb="2">输入您的问题</Text>
            <TextField.Root>
              <TextField.Input
                placeholder="请输入您的问题..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  border: '1px solid var(--gray-6)',
                  borderRadius: 'var(--radius-2)',
                  backgroundColor: 'var(--gray-1)',
                  color: 'var(--gray-12)'
                }}
              />
              <TextField.Slot>
                <Button 
                  type="submit" 
                  disabled={isLoading || !value.trim()}
                  style={{
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: 500,
                    backgroundColor: 'var(--accent-9)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--radius-2)',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                >
                  {isLoading ? '分析中...' : '开始分析'}
                </Button>
              </TextField.Slot>
            </TextField.Root>
          </Box>
        </Flex>
      </form>
    </Card>
  );
}; 