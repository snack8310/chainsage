import { useState } from 'react';
import { AnalysisStatus, ProgressStep, AnalysisResponse } from '../types';

export const useIntentAnalysis = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progressSteps, setProgressSteps] = useState<ProgressStep[]>([
    {
      id: 'step_1',
      title: '意图分析',
      description: '正在分析用户输入的意图...',
      status: 'processing',
      timestamp: new Date()
    },
    {
      id: 'step_2',
      title: '问题分析',
      description: '等待开始问题分析...',
      status: 'processing',
      timestamp: new Date()
    },
    {
      id: 'step_3',
      title: '收集策略',
      description: '等待开始策略生成...',
      status: 'processing',
      timestamp: new Date()
    },
    {
      id: 'step_4',
      title: 'AI响应',
      description: '等待开始AI响应生成...',
      status: 'processing',
      timestamp: new Date()
    }
  ]);
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

    try {
      // 模拟进度更新
      const mockProgressSteps = [
        {
          id: 'step_1_start',
          title: '意图分析',
          description: '开始分析用户输入的意图...',
          status: 'processing' as const,
          timestamp: new Date()
        },
        {
          id: 'step_1_analyzing',
          title: '意图分析',
          description: '正在识别意图类型和关键实体...',
          status: 'processing' as const,
          timestamp: new Date()
        },
        {
          id: 'step_1_complete',
          title: '意图分析',
          description: '已完成意图分析，识别出咨询建议意图，置信度95%',
          status: 'completed' as const,
          timestamp: new Date()
        },
        {
          id: 'step_2_start',
          title: '问题分析',
          description: '开始分析问题的关键点和上下文...',
          status: 'processing' as const,
          timestamp: new Date()
        },
        {
          id: 'step_2_clarity',
          title: '问题分析',
          description: '分析问题清晰度，当前评分0.9...',
          status: 'processing' as const,
          timestamp: new Date()
        },
        {
          id: 'step_2_context',
          title: '问题分析',
          description: '分析问题上下文，当前评分0.85...',
          status: 'processing' as const,
          timestamp: new Date()
        },
        {
          id: 'step_2_complete',
          title: '问题分析',
          description: '已完成问题分析，问题清晰度评分0.9，专业性评分0.9',
          status: 'completed' as const,
          timestamp: new Date()
        },
        {
          id: 'step_3_start',
          title: '收集策略',
          description: '开始生成信息收集策略...',
          status: 'processing' as const,
          timestamp: new Date()
        },
        {
          id: 'step_3_priority',
          title: '收集策略',
          description: '确定策略优先级：高...',
          status: 'processing' as const,
          timestamp: new Date()
        },
        {
          id: 'step_3_risk',
          title: '收集策略',
          description: '评估风险等级：低...',
          status: 'processing' as const,
          timestamp: new Date()
        },
        {
          id: 'step_3_complete',
          title: '收集策略',
          description: '已生成信息收集策略，优先级：高，风险等级：低',
          status: 'completed' as const,
          timestamp: new Date()
        },
        {
          id: 'step_4_start',
          title: 'AI响应',
          description: '开始生成AI响应...',
          status: 'processing' as const,
          timestamp: new Date()
        },
        {
          id: 'step_4_generate',
          title: 'AI响应',
          description: '正在生成初始响应内容...',
          status: 'processing' as const,
          timestamp: new Date()
        },
        {
          id: 'step_4_optimize',
          title: 'AI响应',
          description: '正在优化AI响应内容，预计需要30分钟',
          status: 'processing' as const,
          timestamp: new Date()
        },
        {
          id: 'step_4_validate',
          title: 'AI响应',
          description: '正在验证响应内容的准确性和完整性...',
          status: 'processing' as const,
          timestamp: new Date()
        },
        {
          id: 'step_4_complete',
          title: 'AI响应',
          description: '已完成AI响应生成，包含3个关键要点和5个实施步骤',
          status: 'completed' as const,
          timestamp: new Date()
        }
      ];

      // 模拟进度更新
      for (const step of mockProgressSteps) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setProgressSteps(prev => [...prev, step]);
      }

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