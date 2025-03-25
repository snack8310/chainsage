import React, { useState, useRef, useEffect } from 'react';
import { Box, Text, Container, Flex, Card, ScrollArea } from '@radix-ui/themes';
import { ProgressLog } from './intent/ProgressLog';
import { IntentAnalysisResult } from './intent/IntentAnalysisResult';
import { QuestionAnalysisResult } from './intent/QuestionAnalysisResult';
import { CollectionStrategyResult } from './intent/CollectionStrategyResult';
import { AIResponseResult } from './intent/AIResponseResult';
import { DialogueInput } from './intent/DialogueInput';
import { useIntentAnalysis } from './intent/hooks/useIntentAnalysis';

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
    if (progressSteps.length > 0) {
      logDimensions();
    }
  }, [progressSteps]);

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
                {progressSteps.length > 0 && (
                  <Box ref={progressCardRef} style={{ 
                    flex: 1, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    minHeight: 0,
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <ProgressLog status={null} progressSteps={progressSteps} />
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
              {progressSteps.length > 0 && (
                <Box style={{ 
                  flex: 1, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  minHeight: 0,
                  overflow: 'hidden'
                }}>
                  <ProgressLog status={null} progressSteps={progressSteps} />
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