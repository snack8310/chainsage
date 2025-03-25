import React, { useState, useRef, useEffect } from 'react';
import { Box, Text, Container, Flex, Card, ScrollArea } from '@radix-ui/themes';
import { ProgressLog } from './intent/ProgressLog';
import { IntentAnalysisResult } from './intent/IntentAnalysisResult';
import { QuestionAnalysisResult } from './intent/QuestionAnalysisResult';
import { CollectionStrategyResult } from './intent/CollectionStrategyResult';
import { AIResponseResult } from './intent/AIResponseResult';
import { DialogueInput } from './intent/DialogueInput';
import { useIntentAnalysis } from './intent/hooks/useIntentAnalysis';
import { ProgressStep } from './intent/types';

// Mock data for progress steps
const mockProgressSteps: ProgressStep[] = [
  {
    id: 'step_1',
    title: '意图分析',
    description: '正在分析用户输入的意图...',
    status: 'completed' as const,
    timestamp: new Date('2024-03-20 10:00:00')
  },
  {
    id: 'step_2',
    title: '问题分析',
    description: '分析问题类型和关键信息...',
    status: 'completed' as const,
    timestamp: new Date('2024-03-20 10:00:01')
  },
  {
    id: 'step_3',
    title: '策略生成',
    description: '生成信息收集策略...',
    status: 'processing' as const,
    timestamp: new Date('2024-03-20 10:00:02')
  },
  {
    id: 'step_4',
    title: 'AI响应',
    description: '等待生成AI响应...',
    status: 'processing' as const,
    timestamp: new Date('2024-03-20 10:00:03')
  },
  {
    id: 'step_5',
    title: '结果整合',
    description: '整合分析结果...',
    status: 'processing' as const,
    timestamp: new Date('2024-03-20 10:00:04')
  },
  {
    id: 'step_6',
    title: '反馈优化',
    description: '优化响应质量...',
    status: 'processing' as const,
    timestamp: new Date('2024-03-20 10:00:05')
  },
  {
    id: 'step_7',
    title: '最终输出',
    description: '生成最终输出结果...',
    status: 'processing' as const,
    timestamp: new Date('2024-03-20 10:00:06')
  },
  {
    id: 'step_8',
    title: '完成',
    description: '处理完成',
    status: 'processing' as const,
    timestamp: new Date('2024-03-20 10:00:07')
  }
];

const ScrollableBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box style={{ 
    height: '100%',
    display: 'flex', 
    flexDirection: 'column',
    overflow: 'hidden',
    minHeight: 0,
    position: 'relative'
  }}>
    {children}
  </Box>
);

const IntentAnalysis: React.FC = () => {
  const [input, setInput] = useState(`如何提高工作效率？`);
  const { isLoading, result, error, progressSteps, showResults, handleSubmit } = useIntentAnalysis();

  // 使用mock数据替换progressSteps
  const displayProgressSteps = mockProgressSteps;

  // Add refs for debugging
  const leftSectionRef = useRef<HTMLDivElement>(null);
  const rightSectionRef = useRef<HTMLDivElement>(null);
  const progressCardRef = useRef<HTMLDivElement>(null);

  // Add effect to log dimensions
  useEffect(() => {
    const logDimensions = () => {
      if (leftSectionRef.current) {
        console.log('Left Section:', {
          height: leftSectionRef.current.offsetHeight,
          scrollHeight: leftSectionRef.current.scrollHeight,
          clientHeight: leftSectionRef.current.clientHeight
        });
      }
      if (rightSectionRef.current) {
        console.log('Right Section:', {
          height: rightSectionRef.current.offsetHeight,
          scrollHeight: rightSectionRef.current.scrollHeight,
          clientHeight: rightSectionRef.current.clientHeight
        });
      }
      if (progressCardRef.current) {
        console.log('Progress Card:', {
          height: progressCardRef.current.offsetHeight,
          scrollHeight: progressCardRef.current.scrollHeight,
          clientHeight: progressCardRef.current.clientHeight
        });
      }
    };

    // Log initial dimensions
    logDimensions();

    // Log dimensions when progress steps change
    if (displayProgressSteps.length > 0) {
      logDimensions();
    }
  }, [displayProgressSteps]);

  return (
    <ScrollableBox>
      {/* Header */}
      <Box style={{ 
        borderBottom: '1px solid var(--gray-5)', 
        padding: '16px',
        flexShrink: 0
      }}>
        <Container size="3">
          <Flex align="center" justify="center">
            <Text size="5" weight="bold">意图分析</Text>
          </Flex>
        </Container>
      </Box>

      {/* Main Content */}
      <Box style={{ 
        flex: 1,
        overflow: 'hidden',
        padding: '16px 0',
        minHeight: 0,
        height: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Container size="3" style={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column', 
          minHeight: 0,
          overflow: 'hidden',
          position: 'relative',
          flex: 1
        }}>
          {result && (showResults.intent || showResults.strategy || showResults.ai_response) ? (
            // Two columns layout when there are results
            <Flex gap="4" style={{ 
              flex: 1, 
              minHeight: 0, 
              overflow: 'hidden',
              height: '100%',
              position: 'relative'
            }}>
              {/* Left Section - Input and Progress */}
              <Box ref={leftSectionRef} style={{ 
                flex: 1, 
                display: 'flex',
                flexDirection: 'column',
                minWidth: 0,
                minHeight: 0,
                height: '100%',
                paddingRight: '16px',
                gap: '16px',
                overflow: 'hidden',
                position: 'relative'
              }}>
                {/* Input Card - Fixed Height */}
                <DialogueInput 
                  onSubmit={handleSubmit} 
                  isLoading={isLoading} 
                  value={input}
                  onChange={setInput}
                />

                {/* Progress Steps Card */}
                {displayProgressSteps.length > 0 && (
                  <Box ref={progressCardRef} style={{ 
                    flex: 1, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    minHeight: 0,
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <ScrollArea style={{ 
                      height: '100%',
                      overflow: 'auto',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0
                    }}>
                      <Box style={{ padding: '16px' }}>
                        <ProgressLog status={null} progressSteps={displayProgressSteps} />
                      </Box>
                    </ScrollArea>
                  </Box>
                )}
              </Box>

              {/* Right Section - Results */}
              <ScrollArea ref={rightSectionRef} style={{ 
                width: '400px', 
                flexShrink: 0,
                borderLeft: '1px solid var(--gray-5)',
                paddingLeft: '16px',
                minHeight: 0,
                height: '100%',
                overflow: 'hidden',
                position: 'relative'
              }}>
                <Flex direction="column" gap="4" style={{ padding: '4px', height: '100%', overflow: 'hidden' }}>
                  {/* Intent Analysis Result */}
                  {result?.intent_analysis && showResults.intent && (
                    <IntentAnalysisResult result={result.intent_analysis} />
                  )}

                  {/* Question Analysis Result */}
                  {result?.question_analysis && showResults.question && (
                    <QuestionAnalysisResult result={result.question_analysis} />
                  )}

                  {/* Collection Strategy Result */}
                  {result?.collection_strategy && showResults.strategy && (
                    <CollectionStrategyResult result={result.collection_strategy} />
                  )}

                  {/* AI Response Result */}
                  {result?.ai_response && showResults.ai_response && (
                    <AIResponseResult result={result.ai_response} />
                  )}
                </Flex>
              </ScrollArea>
            </Flex>
          ) : (
            // Single column layout when there are no results
            <Flex direction="column" gap="4" style={{ height: '100%', overflow: 'hidden' }}>
              <DialogueInput 
                onSubmit={handleSubmit} 
                isLoading={isLoading} 
                value={input}
                onChange={setInput}
              />

              {error && (
                <Card style={{ flexShrink: 0 }}>
                  <Flex direction="column" gap="2">
                    <Text size="3" weight="bold" color="red">错误信息</Text>
                    <Text size="2">{error}</Text>
                  </Flex>
                </Card>
              )}

              {/* Progress Steps */}
              {displayProgressSteps.length > 0 && (
                <Box style={{ 
                  flex: 1, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  minHeight: 0,
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <ScrollArea style={{ 
                    height: '100%',
                    overflow: 'auto',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0
                  }}>
                    <Box style={{ padding: '16px' }}>
                      <ProgressLog status={null} progressSteps={displayProgressSteps} />
                    </Box>
                  </ScrollArea>
                </Box>
              )}
            </Flex>
          )}
        </Container>
      </Box>
    </ScrollableBox>
  );
};

export default IntentAnalysis; 