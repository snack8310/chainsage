import { useState } from 'react';
import { AnalysisStatus, ProgressStep, AnalysisResponse } from '../types';

export const useIntentAnalysis = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progressSteps, setProgressSteps] = useState<ProgressStep[]>([]);
  const [showResults, setShowResults] = useState({ 
    intent: false, 
    question: false, 
    strategy: false, 
    ai_response: false 
  });

  const handleSubmit = async (question: string) => {
    if (!question.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setResult(null);
    setProgressSteps([]);
    setShowResults({ intent: false, question: false, strategy: false, ai_response: false });

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
                  setProgressSteps(prev => prev.map(step => ({
                    ...step,
                    status: 'completed'
                  })));
                  eventSource.close();
                  setIsLoading(false);
                  return;
                }
                if (data.status === 'chat_response_started') {
                  setProgressSteps(prev => [...prev, {
                    id: 'chat_response',
                    title: '生成回答',
                    description: '正在生成标准回答...',
                    status: 'processing',
                    timestamp: new Date().toISOString()
                  }]);
                  setResult({
                    intent_analysis: {
                      intent: '',
                      confidence: 0,
                      entities: {}
                    },
                    question_analysis: {
                      question_analysis: {
                        clarity: 0,
                        specificity: 0,
                        context: 0,
                        professionalism: 0,
                        overall_score: 0,
                        is_work_method_related: false
                      },
                      improvement_suggestions: {
                        clarity_improvements: [],
                        specificity_improvements: [],
                        context_improvements: [],
                        professionalism_improvements: [],
                        work_method_specific: []
                      },
                      best_practices: {
                        question_structure: '',
                        key_elements: [],
                        examples: [],
                        work_method_focus: []
                      },
                      follow_up_questions: [],
                      work_method_insights: {
                        current_approach: '',
                        potential_improvements: [],
                        success_metrics: []
                      }
                    },
                    collection_strategy: {
                      strategy: '',
                      priority: '',
                      timeline: '',
                      approach: '',
                      risk_level: '',
                      notes: ''
                    },
                    ai_response: {
                      response: {
                        main_answer: '正在生成回答...',
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
                  });
                  setShowResults(prev => ({ ...prev, ai_response: true }));
                } else if (data.status === 'chat_response_completed') {
                  setProgressSteps(prev => prev.map(step => 
                    step.id === 'chat_response' 
                      ? { ...step, status: 'completed' }
                      : step
                  ));
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
                setProgressSteps(prev => [...prev, {
                  id: 'intent_analysis_started',
                  title: '意图分析',
                  description: '正在分析问题意图...',
                  status: 'processing',
                  timestamp: new Date().toISOString()
                }]);
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
                      overall_score: 0,
                      is_work_method_related: false
                    },
                    improvement_suggestions: {
                      clarity_improvements: [],
                      specificity_improvements: [],
                      context_improvements: [],
                      professionalism_improvements: [],
                      work_method_specific: []
                    },
                    best_practices: {
                      question_structure: '',
                      key_elements: [],
                      examples: [],
                      work_method_focus: []
                    },
                    follow_up_questions: [],
                    work_method_insights: {
                      current_approach: '',
                      potential_improvements: [],
                      success_metrics: []
                    }
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
                setProgressSteps(prev => prev.map(step => 
                  step.id === 'intent_analysis_started' 
                    ? { ...step, status: 'completed' }
                    : step
                ));
                setResult(prev => ({
                  intent_analysis: data.data,
                  question_analysis: prev?.question_analysis || {
                    question_analysis: {
                      clarity: 0,
                      specificity: 0,
                      context: 0,
                      professionalism: 0,
                      overall_score: 0,
                      is_work_method_related: false
                    },
                    improvement_suggestions: {
                      clarity_improvements: [],
                      specificity_improvements: [],
                      context_improvements: [],
                      professionalism_improvements: [],
                      work_method_specific: []
                    },
                    best_practices: {
                      question_structure: '',
                      key_elements: [],
                      examples: [],
                      work_method_focus: []
                    },
                    follow_up_questions: [],
                    work_method_insights: {
                      current_approach: '',
                      potential_improvements: [],
                      success_metrics: []
                    }
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
                setProgressSteps(prev => [...prev, {
                  id: 'question_analysis_started',
                  title: '提问分析',
                  description: '正在分析提问质量...',
                  status: 'processing',
                  timestamp: new Date().toISOString()
                }]);
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
                      overall_score: 0,
                      is_work_method_related: false
                    },
                    improvement_suggestions: {
                      clarity_improvements: [],
                      specificity_improvements: [],
                      context_improvements: [],
                      professionalism_improvements: [],
                      work_method_specific: []
                    },
                    best_practices: {
                      question_structure: '',
                      key_elements: [],
                      examples: [],
                      work_method_focus: []
                    },
                    follow_up_questions: [],
                    work_method_insights: {
                      current_approach: '',
                      potential_improvements: [],
                      success_metrics: []
                    }
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
                      overall_score: 0,
                      is_work_method_related: false
                    },
                    improvement_suggestions: {
                      clarity_improvements: [],
                      specificity_improvements: [],
                      context_improvements: [],
                      professionalism_improvements: [],
                      work_method_specific: []
                    },
                    best_practices: {
                      question_structure: '',
                      key_elements: [],
                      examples: [],
                      work_method_focus: []
                    },
                    follow_up_questions: [],
                    work_method_insights: {
                      current_approach: '',
                      potential_improvements: [],
                      success_metrics: []
                    }
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
              case 'chat_response':
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
                      overall_score: 0,
                      is_work_method_related: false
                    },
                    improvement_suggestions: {
                      clarity_improvements: [],
                      specificity_improvements: [],
                      context_improvements: [],
                      professionalism_improvements: [],
                      work_method_specific: []
                    },
                    best_practices: {
                      question_structure: '',
                      key_elements: [],
                      examples: [],
                      work_method_focus: []
                    },
                    follow_up_questions: [],
                    work_method_insights: {
                      current_approach: '',
                      potential_improvements: [],
                      success_metrics: []
                    }
                  },
                  collection_strategy: prev?.collection_strategy || {
                    strategy: '',
                    priority: '',
                    timeline: '',
                    approach: '',
                    risk_level: '',
                    notes: '',
                  },
                  ai_response: {
                    response: {
                      main_answer: data.data.response?.main_answer || prev?.ai_response?.response?.main_answer || '',
                      key_points: data.data.response?.key_points || prev?.ai_response?.response?.key_points || [],
                      practical_examples: data.data.response?.practical_examples || prev?.ai_response?.response?.practical_examples || [],
                      implementation_steps: data.data.response?.implementation_steps || prev?.ai_response?.response?.implementation_steps || [],
                      common_pitfalls: data.data.response?.common_pitfalls || prev?.ai_response?.response?.common_pitfalls || [],
                      best_practices: data.data.response?.best_practices || prev?.ai_response?.response?.best_practices || [],
                      additional_resources: data.data.response?.additional_resources || prev?.ai_response?.response?.additional_resources || []
                    },
                    metadata: {
                      confidence: data.data.metadata?.confidence || prev?.ai_response?.metadata?.confidence || 0,
                      complexity: data.data.metadata?.complexity || prev?.ai_response?.metadata?.complexity || '',
                      estimated_time: data.data.metadata?.estimated_time || prev?.ai_response?.metadata?.estimated_time || 0,
                      target_audience: data.data.metadata?.target_audience || prev?.ai_response?.metadata?.target_audience || '',
                      prerequisites: data.data.metadata?.prerequisites || prev?.ai_response?.metadata?.prerequisites || []
                    }
                  }
                }));
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
        if (eventSource.readyState === EventSource.CLOSED) {
          console.log('Connection closed normally');
          eventSource.close();
          setIsLoading(false);
          return;
        }
        
        console.error('EventSource error:', error);
        if (eventSource.readyState !== EventSource.CLOSED) {
          setError('连接出错，请重试');
        }
        eventSource.close();
        setIsLoading(false);
      };

      eventSource.addEventListener('open', () => {
        console.log('Connection opened');
      });

    } catch (error) {
      console.error('Error analyzing intent:', error);
      setError('系统分析出错，请重试');
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    result,
    error,
    progressSteps,
    showResults,
    handleSubmit
  };
}; 