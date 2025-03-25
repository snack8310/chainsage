import React, { useState, useRef, useEffect } from 'react';
import { Box, Text, Container, Flex, Card, ScrollArea } from '@radix-ui/themes';
import { ProgressLog } from './intent/ProgressLog';
import { IntentAnalysisResult } from './intent/IntentAnalysisResult';
import { QuestionAnalysisResult } from './intent/QuestionAnalysisResult';
import { CollectionStrategyResult } from './intent/CollectionStrategyResult';
import { AIResponseResult } from './intent/AIResponseResult';
import { DialogueInput } from './intent/DialogueInput';
import { AnalysisStatus, ProgressStep, AnalysisResponse } from './intent/types';

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
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progressSteps, setProgressSteps] = useState<ProgressStep[]>([]);
  const [showResults, setShowResults] = useState({ intent: false, question: false, strategy: false, ai_response: false });

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

  const handleSubmit = async (question: string) => {
    if (!question.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setResult(null);
    setShowResults({ intent: false, question: false, strategy: false, ai_response: false });
    setProgressSteps([]);

    try {
      const eventSource = new EventSource(`/api/v1/analyze-intent?message=${encodeURIComponent(question)}&user_id=default_user&session_id=${Date.now()}`);
      
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as AnalysisStatus;
          console.log('Received SSE data:', JSON.stringify(data, null, 2));
          
          Promise.resolve().then(() => {
            switch (data.type) {
              case 'status':
                if (data.status === 'completed') {
                  eventSource.close();
                  setIsLoading(false);
                  return;
                }
                if (data.status || data.message) {
                  setProgressSteps(prev => [...prev, {
                    id: data.status || 'message',
                    title: data.message || '处理中',
                    description: data.message || '正在处理...',
                    status: 'processing',
                    timestamp: new Date()
                  }]);
                }
                break;
              case 'intent_analysis_progress':
                setResult(prev => ({
                  intent_analysis: {
                    intent: data.data.partial_intent || prev?.intent_analysis?.intent || '',
                    confidence: data.data.partial_confidence || prev?.intent_analysis?.confidence || 0,
                    entities: data.data.partial_entities || prev?.intent_analysis?.entities || {}
                  },
                  question_analysis: prev?.question_analysis || {
                    question_analysis: {
                      clarity: 0,
                      specificity: 0,
                      context: 0,
                      professionalism: 0,
                      overall_score: 0
                    },
                    improvement_suggestions: {
                      clarity_improvements: [],
                      specificity_improvements: [],
                      context_improvements: [],
                      professionalism_improvements: []
                    },
                    best_practices: {
                      question_structure: '',
                      key_elements: [],
                      examples: []
                    },
                    follow_up_questions: []
                  },
                  collection_strategy: prev?.collection_strategy || {
                    strategy: '',
                    priority: '',
                    timeline: '',
                    approach: '',
                    risk_level: '',
                    notes: '',
                  },
                  ai_response: prev?.ai_response || {
                    response: {
                      main_answer: '',
                      key_points: [],
                      practical_examples: [],
                      implementation_steps: [],
                      common_pitfalls: [],
                      best_practices: [],
                      additional_resources: []
                    },
                    metadata: {
                      confidence: 0,
                      complexity: '',
                      estimated_time: 0,
                      target_audience: '',
                      prerequisites: []
                    }
                  }
                }));
                setShowResults(prev => ({ ...prev, intent: true }));
                break;
              case 'intent_analysis':
                setResult(prev => ({
                  intent_analysis: data.data,
                  question_analysis: prev?.question_analysis || {
                    question_analysis: {
                      clarity: 0,
                      specificity: 0,
                      context: 0,
                      professionalism: 0,
                      overall_score: 0
                    },
                    improvement_suggestions: {
                      clarity_improvements: [],
                      specificity_improvements: [],
                      context_improvements: [],
                      professionalism_improvements: []
                    },
                    best_practices: {
                      question_structure: '',
                      key_elements: [],
                      examples: []
                    },
                    follow_up_questions: []
                  },
                  collection_strategy: prev?.collection_strategy || {
                    strategy: '',
                    priority: '',
                    timeline: '',
                    approach: '',
                    risk_level: '',
                    notes: '',
                  },
                  ai_response: prev?.ai_response || {
                    response: {
                      main_answer: '',
                      key_points: [],
                      practical_examples: [],
                      implementation_steps: [],
                      common_pitfalls: [],
                      best_practices: [],
                      additional_resources: []
                    },
                    metadata: {
                      confidence: 0,
                      complexity: '',
                      estimated_time: 0,
                      target_audience: '',
                      prerequisites: []
                    }
                  }
                }));
                setShowResults(prev => ({ ...prev, intent: true }));
                break;
              case 'question_analysis':
                setResult(prev => ({
                  intent_analysis: prev?.intent_analysis || {
                    intent: '',
                    confidence: 0,
                    entities: {},
                  },
                  question_analysis: data.data,
                  collection_strategy: prev?.collection_strategy || {
                    strategy: '',
                    priority: '',
                    timeline: '',
                    approach: '',
                    risk_level: '',
                    notes: '',
                  },
                  ai_response: prev?.ai_response || {
                    response: {
                      main_answer: '',
                      key_points: [],
                      practical_examples: [],
                      implementation_steps: [],
                      common_pitfalls: [],
                      best_practices: [],
                      additional_resources: []
                    },
                    metadata: {
                      confidence: 0,
                      complexity: '',
                      estimated_time: 0,
                      target_audience: '',
                      prerequisites: []
                    }
                  }
                }));
                setShowResults(prev => ({ ...prev, question: true }));
                break;
              case 'collection_strategy_progress':
                setResult(prev => ({
                  intent_analysis: prev?.intent_analysis || {
                    intent: '',
                    confidence: 0,
                    entities: {},
                  },
                  question_analysis: prev?.question_analysis || {
                    question_analysis: {
                      clarity: 0,
                      specificity: 0,
                      context: 0,
                      professionalism: 0,
                      overall_score: 0
                    },
                    improvement_suggestions: {
                      clarity_improvements: [],
                      specificity_improvements: [],
                      context_improvements: [],
                      professionalism_improvements: []
                    },
                    best_practices: {
                      question_structure: '',
                      key_elements: [],
                      examples: []
                    },
                    follow_up_questions: []
                  },
                  collection_strategy: {
                    strategy: data.data.partial_strategy || prev?.collection_strategy?.strategy || '',
                    priority: data.data.partial_priority || prev?.collection_strategy?.priority || '',
                    timeline: data.data.partial_timeline || prev?.collection_strategy?.timeline || '',
                    approach: data.data.partial_approach || prev?.collection_strategy?.approach || '',
                    risk_level: data.data.partial_risk_level || prev?.collection_strategy?.risk_level || '',
                    notes: data.data.partial_notes || prev?.collection_strategy?.notes || '',
                  },
                  ai_response: prev?.ai_response || {
                    response: {
                      main_answer: '',
                      key_points: [],
                      practical_examples: [],
                      implementation_steps: [],
                      common_pitfalls: [],
                      best_practices: [],
                      additional_resources: []
                    },
                    metadata: {
                      confidence: 0,
                      complexity: '',
                      estimated_time: 0,
                      target_audience: '',
                      prerequisites: []
                    }
                  }
                }));
                setShowResults(prev => ({ ...prev, strategy: true }));
                break;
              case 'collection_strategy':
                setResult(prev => ({
                  intent_analysis: prev?.intent_analysis || {
                    intent: '',
                    confidence: 0,
                    entities: {},
                  },
                  question_analysis: prev?.question_analysis || {
                    question_analysis: {
                      clarity: 0,
                      specificity: 0,
                      context: 0,
                      professionalism: 0,
                      overall_score: 0
                    },
                    improvement_suggestions: {
                      clarity_improvements: [],
                      specificity_improvements: [],
                      context_improvements: [],
                      professionalism_improvements: []
                    },
                    best_practices: {
                      question_structure: '',
                      key_elements: [],
                      examples: []
                    },
                    follow_up_questions: []
                  },
                  collection_strategy: data.data,
                  ai_response: prev?.ai_response || {
                    response: {
                      main_answer: '',
                      key_points: [],
                      practical_examples: [],
                      implementation_steps: [],
                      common_pitfalls: [],
                      best_practices: [],
                      additional_resources: []
                    },
                    metadata: {
                      confidence: 0,
                      complexity: '',
                      estimated_time: 0,
                      target_audience: '',
                      prerequisites: []
                    }
                  }
                }));
                setShowResults(prev => ({ ...prev, strategy: true }));
                break;
              case 'ai_response':
                setResult(prev => ({
                  intent_analysis: prev?.intent_analysis || {
                    intent: '',
                    confidence: 0,
                    entities: {},
                  },
                  question_analysis: prev?.question_analysis || {
                    question_analysis: {
                      clarity: 0,
                      specificity: 0,
                      context: 0,
                      professionalism: 0,
                      overall_score: 0
                    },
                    improvement_suggestions: {
                      clarity_improvements: [],
                      specificity_improvements: [],
                      context_improvements: [],
                      professionalism_improvements: []
                    },
                    best_practices: {
                      question_structure: '',
                      key_elements: [],
                      examples: []
                    },
                    follow_up_questions: []
                  },
                  collection_strategy: prev?.collection_strategy || {
                    strategy: '',
                    priority: '',
                    timeline: '',
                    approach: '',
                    risk_level: '',
                    notes: '',
                  },
                  ai_response: data.data
                }));
                setShowResults(prev => ({ ...prev, ai_response: true }));
                break;
              case 'error':
                console.error('Error received:', data.message);
                setError(data.message || '发生错误');
                break;
            }
          });
        } catch (error) {
          console.error('Error parsing SSE data:', error);
          setError('数据解析错误');
        }
      };

      eventSource.onerror = (error) => {
        // 检查是否是正常完成后的连接关闭
        if (eventSource.readyState === EventSource.CLOSED) {
            // 如果是正常关闭，不显示错误
            console.log('Connection closed normally');
            eventSource.close();
            setIsLoading(false);
            return;
        }
        
        // 只有在非正常关闭时才显示错误
        console.error('EventSource error:', error);
        // 只有在非正常关闭时才设置错误状态
        if (eventSource.readyState !== EventSource.CLOSED) {
            setError('连接出错，请重试');
        }
        eventSource.close();
        setIsLoading(false);
      };

      // 添加 open 事件监听
      eventSource.addEventListener('open', () => {
        console.log('Connection opened');
      });

    } catch (error) {
      console.error('Error analyzing intent:', error);
      setError('系统分析出错，请重试');
      setIsLoading(false);
    }
  };

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