import React from 'react';
import { Box, Card, Text, ScrollArea, Flex } from '@radix-ui/themes';
import { QuestionAnalysis } from './types';

interface QuestionAnalysisResultProps {
  result: QuestionAnalysis;
}

export const QuestionAnalysisResult: React.FC<QuestionAnalysisResultProps> = ({ result }) => {
  return (
    <Card style={{ height: '100%', overflow: 'hidden' }}>
      <Flex direction="column" style={{ height: '100%' }}>
        <Box p="3">
          <Text size="5" weight="bold">问题分析结果</Text>
        </Box>
        <ScrollArea style={{ flex: 1, overflow: 'hidden' }}>
          <Box p="3">
            <Box mb="4">
              <Text size="3" weight="bold">评分详情</Text>
              <Box mb="2">
                <Text size="2" weight="bold">清晰度:</Text>
                <Text size="2" color="gray">{result.question_analysis.clarity}</Text>
              </Box>
              <Box mb="2">
                <Text size="2" weight="bold">具体性:</Text>
                <Text size="2" color="gray">{result.question_analysis.specificity}</Text>
              </Box>
              <Box mb="2">
                <Text size="2" weight="bold">上下文:</Text>
                <Text size="2" color="gray">{result.question_analysis.context}</Text>
              </Box>
              <Box mb="2">
                <Text size="2" weight="bold">专业性:</Text>
                <Text size="2" color="gray">{result.question_analysis.professionalism}</Text>
              </Box>
              <Box>
                <Text size="2" weight="bold">总分:</Text>
                <Text size="2" color="gray">{result.question_analysis.overall_score}</Text>
              </Box>
            </Box>

            <Box mb="4">
              <Text size="3" weight="bold">改进建议</Text>
              {Object.entries(result.improvement_suggestions).map(([key, suggestions]) => (
                <Box key={key} mb="2">
                  <Text size="2" weight="bold">{key.replace('_improvements', '')}:</Text>
                  {suggestions.map((suggestion, index) => (
                    <Text key={index} size="2" color="gray">• {suggestion}</Text>
                  ))}
                </Box>
              ))}
            </Box>

            <Box mb="4">
              <Text size="3" weight="bold">最佳实践</Text>
              <Box mb="2">
                <Text size="2" weight="bold">问题结构:</Text>
                <Text size="2" color="gray">{result.best_practices.question_structure}</Text>
              </Box>
              <Box mb="2">
                <Text size="2" weight="bold">关键要素:</Text>
                {result.best_practices.key_elements.map((element, index) => (
                  <Text key={index} size="2" color="gray">• {element}</Text>
                ))}
              </Box>
              <Box>
                <Text size="2" weight="bold">示例:</Text>
                {result.best_practices.examples.map((example, index) => (
                  <Text key={index} size="2" color="gray">• {example}</Text>
                ))}
              </Box>
            </Box>

            <Box>
              <Text size="3" weight="bold">后续问题</Text>
              {result.follow_up_questions.map((question, index) => (
                <Text key={index} size="2" color="gray">• {question}</Text>
              ))}
            </Box>
          </Box>
        </ScrollArea>
      </Flex>
    </Card>
  );
}; 