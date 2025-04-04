export interface IntentResult {
  intent: string;
  confidence: number;
  entities: Record<string, string | string[]>;
}

export interface QuestionImprovementAdvice {
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
}

export interface CollectionStrategy {
  strategy: string;
  priority: string;
  timeline: string;
  approach: string;
  risk_level: string;
  notes: string;
}

export interface AIResponse {
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
}

export interface AnalysisResponse {
  intent_analysis: IntentResult;
  question_analysis: QuestionImprovementAdvice;
  collection_strategy: CollectionStrategy;
  ai_response: AIResponse;
}

export type AnalysisStatus = {
  type: 'intent_analysis' | 'intent_analysis_progress' | 'question_analysis' | 
        'chat_response' | 'error' | 'status' | 'course_recommendation';
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
    ai_response: boolean;
  };
};

export interface ProgressStep {
  id: string;
  title: string;
  description: string;
  status: 'processing' | 'completed';
  timestamp: Date | string;
}

export interface CourseRecommendation {
  title: string;
  relevance_score: number;
  summary: string;
  source: string;
  page: number;
}

export interface CourseRecommendationResponse {
  data: {
    recommendations: CourseRecommendation[];
    metadata: {
      total_courses: number;
      query_context: {
        intent: string;
        confidence: number;
      };
    };
    logs?: string[];
  };
} 