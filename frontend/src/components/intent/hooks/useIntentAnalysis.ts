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