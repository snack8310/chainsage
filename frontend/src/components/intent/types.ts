export interface IntentResult {
  intent: string;
  confidence: number;
  entities: Record<string, string | string[]>;
}

export interface QuestionAnalysis {
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
  question_analysis: QuestionAnalysis;
  collection_strategy: CollectionStrategy;
  ai_response: AIResponse;
}

export interface AnalysisStatus {
  type: 'status' | 'intent_analysis' | 'intent_analysis_progress' | 'question_analysis' | 'collection_strategy' | 'collection_strategy_progress' | 'ai_response' | 'chat_response' | 'error';
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
}

export interface ProgressStep {
  id: string;
  title: string;
  description: string;
  status: 'processing' | 'completed';
  timestamp: Date | string;
} 