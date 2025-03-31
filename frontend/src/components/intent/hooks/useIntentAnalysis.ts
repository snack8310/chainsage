import { useState } from 'react';
import { AnalysisStatus, ProgressStep, AnalysisResponse } from '../types';

interface AnalysisResult {
  intent_analysis: {
    intent: string;
    confidence: number;
    entities: Record<string, any>;
  };
  question_analysis?: {
    question_analysis: {
      clarity: number;
      specificity: number;
      context: number;
      professionalism: number;
      overall_score: number;
      is_work_method_related: boolean;
    };
    improvement_suggestions: {
      clarity_improvements: string[];
      specificity_improvements: string[];
      context_improvements: string[];
      professionalism_improvements: string[];
      work_method_specific: string[];
    };
    best_practices: {
      question_structure: string;
      key_elements: string[];
      examples: string[];
      work_method_focus: string[];
    };
    follow_up_questions: string[];
    work_method_insights: {
      current_approach: string;
      potential_improvements: string[];
      success_metrics: string[];
    };
  };
  ai_response: {
    response: {
      main_answer: string;
      key_points: string[];
      practical_examples: string[];
      implementation_steps: string[];
      common_pitfalls: string[];
      best_practices: string[];
      additional_resources: string[];
    };
    metadata: {
      confidence: number;
      complexity: string;
      estimated_time: number;
      target_audience: string;
      prerequisites: string[];
    };
  };
  course_recommendations?: {
    data: {
      recommendations: Array<{
        title: string;
        relevance_score: number;
        summary: string;
        source: string;
        page: number;
      }>;
      metadata: {
        total_courses: number;
        query_context: {
          intent: string;
          confidence: number;
        };
      };
    };
  };
}

export const useIntentAnalysis = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult>({
    intent_analysis: {
      intent: '',
      confidence: 0,
      entities: {}
    },
    ai_response: {
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
  });
  const [error, setError] = useState<string | null>(null);
  const [progressSteps, setProgressSteps] = useState<ProgressStep[]>([]);
  const [showResults, setShowResults] = useState({
    intent_analysis: false,
    chat_response: false,
    question_analysis: false,
    course_recommendations: false
  });

  const handleSubmit = async (question: string) => {
    setIsLoading(true);
    setError(null);
    setProgressSteps([]);
    setShowResults({
      intent_analysis: false,
      chat_response: false,
      question_analysis: false,
      course_recommendations: false
    });

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
                if (data.status === 'intent_analysis_started') {
                  console.log('Intent analysis started');
                  setProgressSteps(prev => [...prev, {
                    id: 'intent_analysis',
                    title: '意图分析',
                    description: '正在分析问题意图...',
                    status: 'processing',
                    timestamp: new Date()
                  }]);
                  setShowResults(prev => ({ ...prev, intent_analysis: true }));
                } else if (data.status === 'intent_analysis_completed') {
                  console.log('Intent analysis completed');
                  setProgressSteps(prev => prev.map(step => 
                    step.id === 'intent_analysis' 
                      ? { ...step, status: 'completed' }
                      : step
                  ));
                } else if (data.status === 'chat_response_started') {
                  console.log('Chat response started');
                  setProgressSteps(prev => [...prev, {
                    id: 'chat_response',
                    title: '生成回答',
                    description: '正在生成标准回答...',
                    status: 'processing',
                    timestamp: new Date()
                  }]);
                  setShowResults(prev => ({ ...prev, chat_response: true }));
                } else if (data.status === 'chat_response_completed') {
                  console.log('Chat response completed');
                  setProgressSteps(prev => prev.map(step => 
                    step.id === 'chat_response' 
                      ? { ...step, status: 'completed' }
                      : step
                  ));
                } else if (data.status === 'question_analysis_started') {
                  console.log('Question analysis started');
                  setProgressSteps(prev => [...prev, {
                    id: 'question_analysis',
                    title: '提问分析',
                    description: '正在分析提问方式...',
                    status: 'processing',
                    timestamp: new Date()
                  }]);
                  setShowResults(prev => ({ ...prev, question_analysis: true }));
                } else if (data.status === 'question_analysis_completed') {
                  console.log('Question analysis completed');
                  setProgressSteps(prev => prev.map(step => 
                    step.id === 'question_analysis' 
                      ? { ...step, status: 'completed' }
                      : step
                  ));
                } else if (data.status === 'question_analysis_skipped') {
                  console.log('Question analysis skipped');
                  setProgressSteps(prev => [...prev, {
                    id: 'question_analysis_skipped',
                    title: '提问分析',
                    description: '非工作方法咨询，跳过提问分析',
                    status: 'completed',
                    timestamp: new Date()
                  }]);
                } else if (data.status === 'course_recommendation_started') {
                  console.log('Course recommendation started');
                  setProgressSteps(prev => [...prev, {
                    id: 'course_recommendation',
                    title: '课程推荐',
                    description: '正在分析相关课程...',
                    status: 'processing',
                    timestamp: new Date()
                  }]);
                  setShowResults(prev => ({ ...prev, course_recommendations: true }));
                } else if (data.status === 'course_recommendation_completed') {
                  console.log('Course recommendation completed');
                  setProgressSteps(prev => prev.map(step => 
                    step.id === 'course_recommendation' 
                      ? { ...step, status: 'completed' }
                      : step
                  ));
                }
                break;
              case 'intent_analysis_progress':
                console.log('Intent analysis progress:', data.data);
                setResult(prev => ({
                  ...prev,
                  intent_analysis: {
                    intent: data.data.partial_intent || prev.intent_analysis.intent,
                    confidence: data.data.partial_confidence || prev.intent_analysis.confidence,
                    entities: data.data.partial_entities || prev.intent_analysis.entities
                  }
                }));
                setShowResults(prev => ({ ...prev, intent_analysis: true }));
                break;
              case 'intent_analysis':
                console.log('Intent analysis complete:', data.data);
                setResult(prev => ({
                  ...prev,
                  intent_analysis: data.data
                }));
                setShowResults(prev => ({ ...prev, intent_analysis: true }));
                break;
              case 'chat_response':
                console.log('Chat response:', data.data);
                setResult(prev => ({
                  ...prev,
                  ai_response: {
                    response: {
                      main_answer: data.data.response?.main_answer || prev.ai_response.response.main_answer,
                      key_points: data.data.response?.key_points || prev.ai_response.response.key_points,
                      practical_examples: data.data.response?.practical_examples || prev.ai_response.response.practical_examples,
                      implementation_steps: data.data.response?.implementation_steps || prev.ai_response.response.implementation_steps,
                      common_pitfalls: data.data.response?.common_pitfalls || prev.ai_response.response.common_pitfalls,
                      best_practices: data.data.response?.best_practices || prev.ai_response.response.best_practices,
                      additional_resources: data.data.response?.additional_resources || prev.ai_response.response.additional_resources
                    },
                    metadata: {
                      confidence: data.data.metadata?.confidence || prev.ai_response.metadata.confidence,
                      complexity: data.data.metadata?.complexity || prev.ai_response.metadata.complexity,
                      estimated_time: data.data.metadata?.estimated_time || prev.ai_response.metadata.estimated_time,
                      target_audience: data.data.metadata?.target_audience || prev.ai_response.metadata.target_audience,
                      prerequisites: data.data.metadata?.prerequisites || prev.ai_response.metadata.prerequisites
                    }
                  }
                }));
                setShowResults(prev => ({ ...prev, chat_response: true }));
                break;
              case 'question_analysis':
                console.log('Question analysis:', data.data);
                setResult(prev => ({
                  ...prev,
                  question_analysis: data.data
                }));
                setShowResults(prev => ({ ...prev, question_analysis: true }));
                break;
              case 'course_recommendation':
                console.log('Course recommendation:', data.data);
                handleCourseRecommendation(data);
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

  const handleCourseRecommendation = (data: any) => {
    const courseData = data.data?.data || data.data;
    
    if (courseData.logs) {
      setProgressSteps(prev => prev.map(step => {
        if (step.id === 'course_recommendation') {
          return {
            ...step,
            description: courseData.logs.join('\n'),
            status: 'processing'
          };
        }
        return step;
      }));
    }
    
    setResult(prev => ({
      ...prev,
      course_recommendations: {
        data: {
          recommendations: courseData.recommendations || [],
          metadata: {
            total_courses: courseData.metadata?.total_courses || 0,
            query_context: {
              intent: courseData.metadata?.query_context?.intent || '',
              confidence: courseData.metadata?.query_context?.confidence || 0
            }
          }
        }
      }
    }));
    setShowResults(prev => ({
      ...prev,
      course_recommendations: true
    }));
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