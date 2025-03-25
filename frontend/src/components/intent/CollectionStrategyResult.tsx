import React from 'react';
import { Box, Card, Text, ScrollArea, Flex } from '@radix-ui/themes';
import { CollectionStrategy } from './types';

interface CollectionStrategyResultProps {
  result: CollectionStrategy;
}

export const CollectionStrategyResult: React.FC<CollectionStrategyResultProps> = ({ result }) => {
  return (
    <Card style={{ height: '100%', overflow: 'hidden' }}>
      <Flex direction="column" style={{ height: '100%' }}>
        <Box p="3">
          <Text size="5" weight="bold">收集策略</Text>
        </Box>
        <ScrollArea style={{ flex: 1, overflow: 'hidden' }}>
          <Box p="3">
            <Box mb="4">
              <Text size="3" weight="bold">策略概述</Text>
              <Text size="2" color="gray">{result.strategy}</Text>
            </Box>

            <Box mb="4">
              <Text size="3" weight="bold">优先级</Text>
              <Text size="2" color="gray">{result.priority}</Text>
            </Box>

            <Box mb="4">
              <Text size="3" weight="bold">时间线</Text>
              <Text size="2" color="gray">{result.timeline}</Text>
            </Box>

            <Box mb="4">
              <Text size="3" weight="bold">执行方法</Text>
              <Text size="2" color="gray">{result.approach}</Text>
            </Box>

            <Box mb="4">
              <Text size="3" weight="bold">风险等级</Text>
              <Text size="2" color="gray">{result.risk_level}</Text>
            </Box>

            <Box>
              <Text size="3" weight="bold">注意事项</Text>
              <Text size="2" color="gray">{result.notes}</Text>
            </Box>
          </Box>
        </ScrollArea>
      </Flex>
    </Card>
  );
}; 