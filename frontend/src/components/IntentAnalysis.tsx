import React, { useState, useRef, useEffect } from 'react';
import { Box, Text, Container, Flex, Card, ScrollArea } from '@radix-ui/themes';
import { ProgressLog } from './intent/ProgressLog';
import { IntentAnalysisResult } from './intent/IntentAnalysisResult';
import { QuestionImprovementAdvice } from './intent/QuestionImprovementAdvice';
import { DialogueInput } from './intent/DialogueInput';
import { useIntentAnalysis } from './intent/hooks/useIntentAnalysis';
import { ProgressStep } from './intent/types';

const ScrollableBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ 
    height: '100vh',
    display: 'flex', 
    flexDirection: 'column',
    overflow: 'hidden',
    position: 'relative'
  }}>
    {children}
  </div>
);

const ChatResponse: React.FC<{ result: any; isLoading?: boolean }> = ({ result, isLoading = false }) => {
  return (
    <Card style={{ 
      padding: '16px',
      backgroundColor: 'var(--gray-1)',
      border: '1px solid var(--gray-5)',
      borderRadius: 'var(--radius-3)'
    }}>
      <Flex direction="column" gap="3">
        <Box>
          <Text size="3" weight="bold" mb="2">标准回答</Text>
          <Box style={{ 
            padding: '12px',
            backgroundColor: 'var(--gray-2)',
            borderRadius: 'var(--radius-2)',
            border: '1px solid var(--gray-4)'
          }}>
            <Flex direction="column" gap="3">
              {/* 主要回答 */}
              <Text size="2" style={{ 
                whiteSpace: 'pre-wrap',
                color: isLoading ? 'var(--gray-9)' : 'inherit'
              }}>
                {isLoading ? '正在生成回答...' : (result?.response?.main_answer || '')}
              </Text>

              {/* 关键要点 */}
              {!isLoading && result?.response?.key_points && result.response.key_points.length > 0 && (
                <Box>
                  <Text size="2" weight="bold" mb="1">关键要点：</Text>
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    {result.response.key_points.map((point: string, index: number) => (
                      <li key={index}>
                        <Text size="2">{point}</Text>
                      </li>
                    ))}
                  </ul>
                </Box>
              )}

              {/* 实际案例 */}
              {!isLoading && result?.response?.practical_examples && result.response.practical_examples.length > 0 && (
                <Box>
                  <Text size="2" weight="bold" mb="1">实际案例：</Text>
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    {result.response.practical_examples.map((example: string, index: number) => (
                      <li key={index}>
                        <Text size="2">{example}</Text>
                      </li>
                    ))}
                  </ul>
                </Box>
              )}

              {/* 实施步骤 */}
              {!isLoading && result?.response?.implementation_steps && result.response.implementation_steps.length > 0 && (
                <Box>
                  <Text size="2" weight="bold" mb="1">实施步骤：</Text>
                  <ol style={{ margin: 0, paddingLeft: '20px' }}>
                    {result.response.implementation_steps.map((step: string, index: number) => (
                      <li key={index}>
                        <Text size="2">{step}</Text>
                      </li>
                    ))}
                  </ol>
                </Box>
              )}

              {/* 常见陷阱 */}
              {!isLoading && result?.response?.common_pitfalls && result.response.common_pitfalls.length > 0 && (
                <Box>
                  <Text size="2" weight="bold" mb="1">常见陷阱：</Text>
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    {result.response.common_pitfalls.map((pitfall: string, index: number) => (
                      <li key={index}>
                        <Text size="2">{pitfall}</Text>
                      </li>
                    ))}
                  </ul>
                </Box>
              )}

              {/* 最佳实践 */}
              {!isLoading && result?.response?.best_practices && result.response.best_practices.length > 0 && (
                <Box>
                  <Text size="2" weight="bold" mb="1">最佳实践：</Text>
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    {result.response.best_practices.map((practice: string, index: number) => (
                      <li key={index}>
                        <Text size="2">{practice}</Text>
                      </li>
                    ))}
                  </ul>
                </Box>
              )}

              {/* 额外资源 */}
              {!isLoading && result?.response?.additional_resources && result.response.additional_resources.length > 0 && (
                <Box>
                  <Text size="2" weight="bold" mb="1">额外资源：</Text>
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    {result.response.additional_resources.map((resource: string, index: number) => (
                      <li key={index}>
                        <Text size="2">{resource}</Text>
                      </li>
                    ))}
                  </ul>
                </Box>
              )}
            </Flex>
          </Box>
        </Box>
      </Flex>
    </Card>
  );
};

const IntentAnalysis: React.FC = () => {
  const [input, setInput] = useState(`如何提高工作效率？`);
  const { isLoading, result, error, progressSteps, showResults, handleSubmit } = useIntentAnalysis();

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
  }, []);

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
      <div style={{ 
        flex: 1,
        overflow: 'hidden',
        padding: '16px 0',
        height: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column', 
          overflow: 'hidden',
          position: 'relative',
          flex: 1,
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%'
        }}>
          <div style={{ 
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {result && (showResults.intent || showResults.strategy || showResults.ai_response) ? (
              // Two columns layout when there are results
              <Flex gap="4" style={{ 
                flex: 1, 
                overflow: 'hidden',
                height: '100%',
                position: 'relative'
              }}>
                {/* Left Section - Input and Progress */}
                <div ref={leftSectionRef} style={{ 
                  flex: 1, 
                  display: 'flex',
                  flexDirection: 'column',
                  minWidth: 0,
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
                  {progressSteps.length > 0 && (
                    <div ref={progressCardRef} style={{ 
                      flex: 1, 
                      display: 'flex', 
                      flexDirection: 'column', 
                      position: 'relative',
                      overflow: 'hidden',
                      backgroundColor: 'var(--gray-1)',
                      border: '1px solid var(--gray-5)',
                      borderRadius: 'var(--radius-3)',
                      minHeight: 0
                    }}>
                      <div style={{ 
                        flexShrink: 0,
                        padding: '16px',
                        borderBottom: '1px solid var(--gray-5)'
                      }}>
                        <Text size="3" weight="bold">分析进度</Text>
                      </div>
                      <div style={{ 
                        flex: 1,
                        overflow: 'hidden',
                        position: 'relative',
                        minHeight: 0
                      }}>
                        <ScrollArea style={{ 
                          height: '100%',
                          overflow: 'auto',
                          position: 'absolute',
                          inset: 0
                        }}>
                          <div style={{ padding: '16px' }}>
                            <ProgressLog status={null} progressSteps={progressSteps} />
                          </div>
                        </ScrollArea>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Section - Results */}
                <ScrollArea ref={rightSectionRef} style={{ 
                  flex: 1,
                  flexShrink: 0,
                  borderLeft: '1px solid var(--gray-5)',
                  paddingLeft: '16px',
                  height: '100%',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <Flex direction="column" gap="4" style={{ padding: '4px', height: '100%', overflow: 'hidden' }}>
                    {/* Chat Response - Show when chat_response step starts */}
                    {progressSteps.some(step => step.id === 'chat_response') && (
                      <ChatResponse 
                        result={result?.ai_response} 
                        isLoading={isLoading && !result?.ai_response}
                      />
                    )}

                    {/* Intent Analysis Result - Show when intent_analysis step starts */}
                    {progressSteps.some(step => step.id.startsWith('intent_analysis')) && (
                      <IntentAnalysisResult 
                        result={result?.intent_analysis} 
                        isLoading={isLoading && !result?.intent_analysis}
                      />
                    )}

                    {/* Question Improvement Advice - Show when question_analysis step starts */}
                    {progressSteps.some(step => step.id.startsWith('question_analysis')) && (
                      <QuestionImprovementAdvice 
                        result={result?.question_analysis} 
                        isLoading={isLoading && !result?.question_analysis}
                      />
                    )}
                  </Flex>
                </ScrollArea>
              </Flex>
            ) : (
              // Single column layout when there are no results
              <div style={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                overflow: 'hidden'
              }}>
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
                {progressSteps.length > 0 && (
                  <div style={{ 
                    flex: 1, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundColor: 'var(--gray-1)',
                    border: '1px solid var(--gray-5)',
                    borderRadius: 'var(--radius-3)',
                    minHeight: 0
                  }}>
                    <div style={{ 
                      flexShrink: 0,
                      padding: '16px',
                      borderBottom: '1px solid var(--gray-5)',
                      display: 'flex',
                      alignItems: 'center',
                      height: '48px'
                    }}>
                      <Text size="3" weight="bold" style={{ lineHeight: '16px' }}>分析进度</Text>
                    </div>
                    <div style={{ 
                      flex: 1,
                      overflow: 'hidden',
                      position: 'relative',
                      minHeight: 0
                    }}>
                      <ScrollArea style={{ 
                        height: '100%',
                        overflow: 'auto',
                        position: 'absolute',
                        inset: 0
                      }}>
                        <div style={{ padding: '16px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                          <ProgressLog status={null} progressSteps={progressSteps} />
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </ScrollableBox>
  );
};

export default IntentAnalysis; 