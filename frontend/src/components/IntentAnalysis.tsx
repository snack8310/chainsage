import React, { useState } from 'react';
import { Box, Text, Container, TextField, Button, Flex, Badge, Card } from '@radix-ui/themes';

interface IntentResult {
  intent: string;
  confidence: number;
  entities: Record<string, string>;
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
  collection_strategy: CollectionStrategy;
}

interface AnalysisStatus {
  type: 'status' | 'intent_analysis' | 'intent_analysis_progress' | 'collection_strategy' | 'collection_strategy_progress' | 'error';
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
  const [input, setInput] = useState(`USER1:你好，我想咨询一下如何写好周报，有什么技巧吗？

USER2:您好！很高兴为您解答周报写作的问题。周报确实是一个重要的职场沟通工具。

USER1:是的，我每次写周报都觉得很难，不知道该怎么写才能让领导满意。

USER2:我理解您的困扰。写周报确实需要一些技巧和方法。让我为您详细介绍一下：

1. 结构要清晰
- 本周工作完成情况
- 遇到的问题和解决方案
- 下周工作计划
- 需要协调的事项

2. 内容要具体
- 用数据说话
- 突出重要成果
- 说明工作价值

3. 表达要专业
- 使用准确的专业术语
- 保持客观的语气
- 重点突出，层次分明

USER1:这些建议很实用，那具体该怎么组织语言呢？

USER2:我来给您一个具体的例子：

"本周主要完成了以下工作：
1. 完成了A项目的需求分析文档，包含3个核心功能模块的详细设计
2. 解决了B系统性能问题，响应时间从2秒优化到0.5秒
3. 与客户进行了2次需求沟通会议，明确了项目范围

遇到的问题：
1. C模块开发进度延迟，原因是技术方案需要调整
解决方案：已与团队讨论新的技术方案，预计下周可以赶上进度

下周计划：
1. 开始A项目的开发工作
2. 完成B系统的压力测试
3. 准备项目周报汇报

需要协调：
1. 需要产品经理提供更详细的功能需求文档
2. 需要运维团队协助部署新版本"`);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progressSteps, setProgressSteps] = useState<ProgressStep[]>([]);
  const [showResults, setShowResults] = useState({ intent: false, strategy: false });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setResult(null);
    setShowResults({ intent: false, strategy: false });
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
              case 'collection_strategy_progress':
                setResult(prev => ({
                  intent_analysis: prev?.intent_analysis || {
                    intent: '',
                    confidence: 0,
                    entities: {},
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
                                  <Text size="2">{value}</Text>
                                </Flex>
                              ))}
                            </Flex>
                          </Box>
                        )}
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