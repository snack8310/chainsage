import React, { useState } from 'react';
import { Box, Text, Container, TextField, Button, Flex, Badge, Card } from '@radix-ui/themes';

interface IntentResult {
  intent: string;
  confidence: number;
  entities: Record<string, string | string[]>;
}

interface QuestionAnalysis {
  question_analysis: {
    clarity: number;
    specificity: number;
    context: number;
    professionalism: number;
    overall_score: number;
  };
  improvement_suggestions: {
    clarity_improvements: string[];
    specificity_improvements: string[];
    context_improvements: string[];
    professionalism_improvements: string[];
  };
  best_practices: {
    question_structure: string;
    key_elements: string[];
    examples: string[];
  };
  follow_up_questions: string[];
}

interface CollectionStrategy {
  strategy: string;
  priority: string;
  timeline: string;
  approach: string;
  risk_level: string;
  notes: string;
}

interface AnalysisResponse {
  intent_analysis: IntentResult;
  question_analysis: QuestionAnalysis;
  collection_strategy: CollectionStrategy;
}

interface AnalysisStatus {
  type: 'status' | 'intent_analysis' | 'intent_analysis_progress' | 'question_analysis' | 'collection_strategy' | 'collection_strategy_progress' | 'error';
  status?: string;
  message?: string;
  data?: any;
  current_step?: {
    id: string;
    title: string;
    description: string;
    status: 'processing' | 'completed';
  };
  show_results?: {
    intent: boolean;
    question: boolean;
    strategy: boolean;
  };
}

interface ProgressStep {
  id: string;
  title: string;
  description: string;
  status: 'processing' | 'completed';
  timestamp: Date;
}

const IntentAnalysis: React.FC = () => {
  const [input, setInput] = useState(`如何提高工作效率？`);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progressSteps, setProgressSteps] = useState<ProgressStep[]>([]);
  const [showResults, setShowResults] = useState({ intent: false, question: false, strategy: false });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setResult(null);
    setShowResults({ intent: false, question: false, strategy: false });
    setProgressSteps([]);

    try {
      const eventSource = new EventSource(`/api/v1/analyze-intent?message=${encodeURIComponent(input)}&user_id=default_user&session_id=${Date.now()}`);
      
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
                  collection_strategy: data.data
                }));
                setShowResults(prev => ({ ...prev, strategy: true }));
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
    <Box style={{ 
      height: '100%',
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
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
        minHeight: 0
      }}>
        <Container size="3" style={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {result && (showResults.intent || showResults.strategy) ? (
            // Two columns layout when there are results
            <Flex gap="4" style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
              {/* Left Section - Input and Progress */}
              <Box style={{ 
                flex: 1, 
                display: 'flex',
                flexDirection: 'column',
                minWidth: 0,
                minHeight: 0,
                paddingRight: '16px',
                gap: '16px',
                overflow: 'hidden'
              }}>
                {/* Input Card - Fixed Height */}
                <Card style={{ flexShrink: 0 }}>
                  <Flex direction="column" gap="3">
                    <Text size="3" weight="bold">分析用户意图</Text>
                    <form onSubmit={handleSubmit}>
                      <Flex direction="column" gap="3">
                        <Box style={{
                          position: 'relative',
                          width: '100%'
                        }}>
                          <textarea
                            placeholder="输入要分析的文本..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            style={{
                              width: '100%',
                              height: '150px',
                              padding: '8px 12px',
                              borderRadius: '6px',
                              border: '1px solid var(--gray-7)',
                              backgroundColor: 'var(--gray-1)',
                              fontSize: '14px',
                              lineHeight: '1.5',
                              resize: 'none',
                              fontFamily: 'inherit'
                            }}
                          />
                        </Box>
                        <Button type="submit" disabled={!input.trim() || isLoading}>
                          {isLoading ? '分析中...' : '分析意图'}
                        </Button>
                      </Flex>
                    </form>
                  </Flex>
                </Card>

                {/* Scrollable Area for Error and Progress */}
                <Box style={{ 
                  flex: 1,
                  overflow: 'auto',
                  minHeight: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}>
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
                    <Card style={{ flexShrink: 0 }}>
                      <Flex direction="column" gap="3">
                        <Text size="3" weight="bold">分析进度</Text>
                        <Flex direction="column" gap="3">
                          {progressSteps.map((step, index) => (
                            <Flex key={step.id + index} gap="3" align="center" style={{ flexShrink: 0 }}>
                              <Box style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: step.status === 'completed' ? 'var(--green-9)' : 'var(--blue-9)',
                                color: 'white',
                                fontSize: '12px',
                                flexShrink: 0
                              }}>
                                {step.status === 'completed' ? '✓' : '⟳'}
                              </Box>
                              <Flex direction="column" gap="1" style={{ flex: 1, minWidth: 0 }}>
                                <Text size="2" weight="bold" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{step.title}</Text>
                                <Text size="2" color="gray" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{step.description}</Text>
                              </Flex>
                            </Flex>
                          ))}
                        </Flex>
                      </Flex>
                    </Card>
                  )}
                </Box>
              </Box>

              {/* Right Section - Results */}
              <Box style={{ 
                width: '400px', 
                overflow: 'auto',
                flexShrink: 0,
                borderLeft: '1px solid var(--gray-5)',
                paddingLeft: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                minHeight: 0
              }}>
                <Flex direction="column" gap="4">
                  {/* Intent Analysis Result */}
                  {result?.intent_analysis && showResults.intent && (
                    <Card>
                      <Flex direction="column" gap="3">
                        <Text size="3" weight="bold">意图分析结果</Text>
                        <Flex gap="2">
                          <Badge color="blue" size="2">
                            意图: {result.intent_analysis.intent}
                          </Badge>
                          <Badge color="green" size="2">
                            置信度: {(result.intent_analysis.confidence * 100).toFixed(1)}%
                          </Badge>
                        </Flex>
                        
                        {Object.keys(result.intent_analysis.entities).length > 0 && (
                          <Box>
                            <Text size="2" weight="bold" mb="2">提取的实体信息：</Text>
                            <Flex direction="column" gap="2">
                              {Object.entries(result.intent_analysis.entities).map(([key, value]) => (
                                <Flex key={key} gap="2" align="center">
                                  <Badge color="gray" size="2">
                                    {key}:
                                  </Badge>
                                  <Text size="2">
                                    {Array.isArray(value) ? value.join(', ') : value}
                                  </Text>
                                </Flex>
                              ))}
                            </Flex>
                          </Box>
                        )}
                      </Flex>
                    </Card>
                  )}

                  {/* Question Analysis Result */}
                  {result?.question_analysis && showResults.question && (
                    <Card>
                      <Flex direction="column" gap="3">
                        <Text size="3" weight="bold">提问分析结果</Text>
                        
                        {/* 提问评分 */}
                        <Box>
                          <Text size="2" weight="bold" mb="2">提问评分：</Text>
                          <Flex direction="column" gap="2">
                            <Flex gap="2" align="center">
                              <Badge color="blue" size="2">清晰度:</Badge>
                              <Text size="2">{(result.question_analysis.question_analysis.clarity * 100).toFixed(1)}%</Text>
                            </Flex>
                            <Flex gap="2" align="center">
                              <Badge color="green" size="2">具体性:</Badge>
                              <Text size="2">{(result.question_analysis.question_analysis.specificity * 100).toFixed(1)}%</Text>
                            </Flex>
                            <Flex gap="2" align="center">
                              <Badge color="orange" size="2">上下文:</Badge>
                              <Text size="2">{(result.question_analysis.question_analysis.context * 100).toFixed(1)}%</Text>
                            </Flex>
                            <Flex gap="2" align="center">
                              <Badge color="purple" size="2">专业性:</Badge>
                              <Text size="2">{(result.question_analysis.question_analysis.professionalism * 100).toFixed(1)}%</Text>
                            </Flex>
                            <Flex gap="2" align="center">
                              <Badge color="red" size="2">总体评分:</Badge>
                              <Text size="2">{(result.question_analysis.question_analysis.overall_score * 100).toFixed(1)}%</Text>
                            </Flex>
                          </Flex>
                        </Box>

                        {/* 改进建议 */}
                        <Box>
                          <Text size="2" weight="bold" mb="2">改进建议：</Text>
                          <Flex direction="column" gap="2">
                            {Object.entries(result.question_analysis.improvement_suggestions).map(([key, suggestions]) => (
                              <Box key={key}>
                                <Text size="2" weight="bold" mb="1">{key.replace('_improvements', '')}:</Text>
                                <Flex direction="column" gap="1">
                                  {suggestions.map((suggestion, index) => (
                                    <Text key={index} size="2">• {suggestion}</Text>
                                  ))}
                                </Flex>
                              </Box>
                            ))}
                          </Flex>
                        </Box>

                        {/* 最佳实践 */}
                        <Box>
                          <Text size="2" weight="bold" mb="2">最佳实践：</Text>
                          <Flex direction="column" gap="2">
                            <Text size="2" weight="bold">提问结构：</Text>
                            <Text size="2">{result.question_analysis.best_practices.question_structure}</Text>
                            
                            <Text size="2" weight="bold">关键要素：</Text>
                            <Flex direction="column" gap="1">
                              {result.question_analysis.best_practices.key_elements.map((element, index) => (
                                <Text key={index} size="2">• {element}</Text>
                              ))}
                            </Flex>
                            
                            <Text size="2" weight="bold">示例：</Text>
                            <Flex direction="column" gap="1">
                              {result.question_analysis.best_practices.examples.map((example, index) => (
                                <Text key={index} size="2">• {example}</Text>
                              ))}
                            </Flex>
                          </Flex>
                        </Box>

                        {/* 跟进问题 */}
                        <Box>
                          <Text size="2" weight="bold" mb="2">跟进问题：</Text>
                          <Flex direction="column" gap="1">
                            {result.question_analysis.follow_up_questions.map((question, index) => (
                              <Text key={index} size="2">• {question}</Text>
                            ))}
                          </Flex>
                        </Box>
                      </Flex>
                    </Card>
                  )}

                  {/* Collection Strategy Result */}
                  {result?.collection_strategy && showResults.strategy && (
                    <Card>
                      <Flex direction="column" gap="3">
                        <Text size="3" weight="bold">催收策略建议</Text>
                        <Flex direction="column" gap="2">
                          <Flex gap="2" align="center">
                            <Badge color="blue" size="2">策略:</Badge>
                            <Text size="2">{result.collection_strategy.strategy}</Text>
                          </Flex>
                          <Flex gap="2" align="center">
                            <Badge color="orange" size="2">优先级:</Badge>
                            <Text size="2">{result.collection_strategy.priority}</Text>
                          </Flex>
                          <Flex gap="2" align="center">
                            <Badge color="green" size="2">执行时间:</Badge>
                            <Text size="2">{result.collection_strategy.timeline}</Text>
                          </Flex>
                          <Flex gap="2" align="center">
                            <Badge color="purple" size="2">执行方式:</Badge>
                            <Text size="2">{result.collection_strategy.approach}</Text>
                          </Flex>
                          <Flex gap="2" align="center">
                            <Badge color="red" size="2">风险等级:</Badge>
                            <Text size="2">{result.collection_strategy.risk_level}</Text>
                          </Flex>
                          {result.collection_strategy.notes && (
                            <Box mt="2">
                              <Text size="2" weight="bold" mb="1">注意事项：</Text>
                              <Text size="2">{result.collection_strategy.notes}</Text>
                            </Box>
                          )}
                        </Flex>
                      </Flex>
                    </Card>
                  )}
                </Flex>
              </Box>
            </Flex>
          ) : (
            // Single column layout when there are no results
            <Flex direction="column" gap="4">
              <Card>
                <Flex direction="column" gap="4">
                  <Text size="3" weight="bold">分析用户意图</Text>
                  <form onSubmit={handleSubmit}>
                    <Flex direction="column" gap="3">
                      <Box style={{
                        position: 'relative',
                        width: '100%'
                      }}>
                        <textarea
                          placeholder="输入要分析的文本..."
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          style={{
                            width: '100%',
                            minHeight: '200px',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            border: '1px solid var(--gray-7)',
                            backgroundColor: 'var(--gray-1)',
                            fontSize: '14px',
                            lineHeight: '1.5',
                            resize: 'vertical',
                            fontFamily: 'inherit'
                          }}
                        />
                      </Box>
                      <Button type="submit" disabled={!input.trim() || isLoading}>
                        {isLoading ? '分析中...' : '分析意图'}
                      </Button>
                    </Flex>
                  </form>
                </Flex>
              </Card>

              {error && (
                <Card>
                  <Flex direction="column" gap="2">
                    <Text size="3" weight="bold" color="red">错误信息</Text>
                    <Text size="2">{error}</Text>
                  </Flex>
                </Card>
              )}

              {/* Progress Steps */}
              {progressSteps.length > 0 && (
                <Card style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                  <Flex direction="column" gap="3" style={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
                    {progressSteps.map((step, index) => (
                      <Flex key={step.id + index} gap="3" align="center" style={{ flexShrink: 0 }}>
                        <Box style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: step.status === 'completed' ? 'var(--green-9)' : 'var(--blue-9)',
                          color: 'white',
                          fontSize: '12px',
                          flexShrink: 0
                        }}>
                          {step.status === 'completed' ? '✓' : '⟳'}
                        </Box>
                        <Flex direction="column" gap="1" style={{ flex: 1, minWidth: 0 }}>
                          <Text size="2" weight="bold" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{step.title}</Text>
                          <Text size="2" color="gray" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{step.description}</Text>
                        </Flex>
                      </Flex>
                    ))}
                  </Flex>
                </Card>
              )}
            </Flex>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default IntentAnalysis; 