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
    setShowResults({ intent: false, question: false, strategy: false, ai_response: false });
    setProgressSteps([]);

    try {
      // 模拟进度更新
      const mockProgressSteps = [
        {
          id: 'step_1',
          title: '意图分析',
          description: '正在分析用户输入的意图...',
          status: 'completed' as const,
          timestamp: new Date()
        },
        {
          id: 'step_2',
          title: '问题分析',
          description: '分析问题类型和关键信息...',
          status: 'completed' as const,
          timestamp: new Date()
        },
        {
          id: 'step_3',
          title: '策略生成',
          description: '生成信息收集策略...',
          status: 'processing' as const,
          timestamp: new Date()
        },
        {
          id: 'step_4',
          title: 'AI响应',
          description: '等待生成AI响应...',
          status: 'processing' as const,
          timestamp: new Date()
        }
      ];

      // 模拟结果数据
      const mockResult = {
        intent_analysis: {
          intent: '咨询建议',
          confidence: 0.95,
          entities: {
            topic: '工作效率',
            type: 'improvement'
          }
        },
        question_analysis: {
          question_analysis: {
            clarity: 0.9,
            specificity: 0.8,
            context: 0.85,
            professionalism: 0.9,
            overall_score: 0.87
          },
          improvement_suggestions: {
            clarity_improvements: [],
            specificity_improvements: [],
            context_improvements: [],
            professionalism_improvements: []
          },
          best_practices: {
            question_structure: '清晰明确',
            key_elements: ['目标', '场景', '期望'],
            examples: []
          },
          follow_up_questions: []
        },
        collection_strategy: {
          strategy: '分步骤分析',
          priority: '高',
          timeline: '即时',
          approach: '系统化',
          risk_level: '低',
          notes: '需要详细分析当前工作流程'
        },
        ai_response: {
          response: {
            main_answer: '提高工作效率需要从多个方面入手...',
            key_points: ['时间管理', '任务优先级', '工作流程优化'],
            practical_examples: [],
            implementation_steps: [],
            common_pitfalls: [],
            best_practices: [],
            additional_resources: []
          },
          metadata: {
            confidence: 0.9,
            complexity: '中等',
            estimated_time: 30,
            target_audience: '职场人士',
            prerequisites: []
          }
        }
      };

      // 模拟进度更新
      for (const step of mockProgressSteps) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setProgressSteps(prev => [...prev, step]);
      }

      // 设置最终结果
      setResult(mockResult);
      setShowResults({ intent: true, question: true, strategy: true, ai_response: true });
      setIsLoading(false);

    } catch (error) {
      console.error('Error in mock analysis:', error);
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