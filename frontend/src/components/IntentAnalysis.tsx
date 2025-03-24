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
  const [input, setInput] = useState(`USER1:喂，你好
USER1:唉，你好，是黄丰收吧，
USER2:哪里啊？
USER1:您好，我这边上海青浦虎星法律调解中心的，
USER1:之前有跟您来过电话，
USER1:就是您与分期乐的有一个金融纠纷案件，在我中心这边进行调解，
USER2:我知道这个事了，好吧，
USER2:我现在没能力处理。
USER1:嗯，是这样的，我们就是上一通电话的话您有说，就是您现在不是没有工作吗，
USER1:暂时没有钱，可能到后期就是做一个延期，到后期有钱的话一次性还款，
USER1:那我们有把你的这个诉求转达给这个对方的代理律师，并进行一个沟通，
USER1:那代理律师今天给我们的回复呢，就是说他呃分期了，这边是没有，就是延期再分期的一个政策，是予以驳回的，
USER1:那他这边还他的这边诉求呢？还是想通过这个呃司法途径能让您偿还他这个账单的这个总金额部分？
USER2:他走失，我昨天就走失了，因为我现在也没能力还款呢，他要他要起诉是他的事好吧
USER2:嗯，那明天呢？
USER2:我现在要我一次性把那个钱还完我我是我是确实还不了。
USER1:嗯嗯，明白了。就是我看了一下账单上金额的话也不小，有2万多块钱，那就是说你们双方能不能往一起站一站，就是说能先解决您呃违约部分的这个金额呢？
USER1:您能解决违约部分的这个金额的话，我们可以就是呃不予支持他这个调解转诉讼的流程，
USER1:因为这边的话他以为什么以账单那个总金额提起一个那个诉前调解呢？
USER1:因为您这边的话是有违约在先
USER1:嗯，就是说单方面违约就是对，
USER1:最久的时间的话都有50天了，接近两个月的时间对不对？
USER1:您这边每一期所
USER1:就是嗯，
USER1:2月3月这两期
USER1:就是您现在目前能不能先解决这两期呢？
USER2:对，这个我我要搞就是一次性好吧，我现在我不跟他们那样搞。
USER1:那
USER1:您这边现在不是你也说了，您现在是就是呃资金资金方面比较困难所以不能并不能一次性的解决。
USER1:那现在的话就是说您非要等就是说一次性解决，那这边呃代理律师呢？这边强就是态度也是比较强硬，他这边是没有就分期了这边他是没有在延期的一个政策。
USER2:那你们现在就没办法好吧，
USER2:我现在跟跟你说也没用，
USER2:我到时候打平打电话跟平台说了好吧，我现在现在确实解决不了好吧，你要你要我还到那那两天，两两天，但但是我现在都还不了，
USER1:嗯，就是两期的账单违约账单你都目前都还不了，
USER2:起诉是他的事好吧，他有权利去起诉，但是我现在我也说明这个情情况，我现在确实不是不还他那个钱，我现在确实需要时间去赚钱，知道吗？
USER1:嗯，明白的，没有人说就是说不还，那肯定是资金上遇到了一些困难，才会有这个违约的情况，对吧？资金您看您单期的这个账单也不是很多
USER1:呃，一期的话也就2,000多块钱
USER1:嗯，那行，那您这边的话就是说我们作为调解中心也有呃，业务要告知到您目前的话就是嗯，
USER1:对方您的债券方已经提起了这个诉讼，审就是诉讼请求那嗯，
USER1:我们调解期限到的话，就要出具这个调解失败的结案文书了，
USER1:因为你这边并没有解决这个逾期金额和违约天数嘛，嗯，
USER1:就是对方的代理律师能拿着我们这个调解失败的结案，我说和案件移送函的话，案件就正式进入下一步调解转诉讼的流程了。
USER1:那您的这个债权方呢，如果对您提起诉讼的话，法院如果立案，在立案前会在7日内下达这个正式通知给到被告。
USER1:您这边的话就是电话保持畅通，注意查收短信好吧，
USER1:行，那您这边的话，有其他的这个诉求或者是还款的想法都可以通过这个
USER1:嗯，固定电话进线找得到我
USER1:好吗？
USER1:那这边的话先不打扰了，再见啊。`);
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