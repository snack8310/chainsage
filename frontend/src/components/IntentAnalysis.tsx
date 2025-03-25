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
                </div>

                {/* Right Section - Results */}
                <ScrollArea ref={rightSectionRef} style={{ 
                  width: '400px', 
                  flexShrink: 0,
                  borderLeft: '1px solid var(--gray-5)',
                  paddingLeft: '16px',
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
              </div>
            )}
          </div>
        </div>
      </div>
    </ScrollableBox>
  );
};

export default IntentAnalysis; 