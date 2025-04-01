from app.agents.base_agent import BaseAgent
from app.agents.models import UserContext, IntentAnalysis
import json

class AIResponseAgent(BaseAgent):
    """专门负责生成标准化AI回答的Agent"""
    def __init__(self):
        super().__init__()
        self.system_prompt = """你是一个专业的企业培训和工作顾问，负责根据用户的问题提供专业、准确、实用的回答。请生成回答，并返回以下格式的 JSON 响应：
{
    "response": {
        "main_answer": "主要回答内容",
        "key_points": ["关键点1", "关键点2"],
        "practical_examples": ["实际案例1", "实际案例2"],
        "implementation_steps": ["实施步骤1", "实施步骤2"],
        "common_pitfalls": ["常见问题1", "常见问题2"],
        "best_practices": ["最佳实践1", "最佳实践2"],
        "additional_resources": ["相关资源1", "相关资源2"]
    },
    "metadata": {
        "confidence": 0.0-1.0 之间的置信度分数,
        "complexity": "回答的复杂度（如：简单、中等、复杂）",
        "estimated_time": "预计阅读时间（分钟）",
        "target_audience": "目标受众（如：新员工、管理者、普通员工）",
        "prerequisites": ["前置知识1", "前置知识2"]
    }
}

请确保：
1. 回答应该专业、准确、实用
2. 关键点应该清晰、具体
3. 实际案例应该真实、可操作
4. 实施步骤应该详细、可执行
5. 常见问题应该具有代表性
6. 最佳实践应该符合企业场景
7. 相关资源应该有助于深入学习
8. 返回的必须是合法的 JSON 格式"""

    async def generate_response(self, context: UserContext, intent_analysis: IntentAnalysis) -> dict:
        """生成标准化的AI回答"""
        messages = [
            {"role": "system", "content": self.system_prompt},
            {"role": "user", "content": f"""请根据以下信息生成专业的回答：

用户意图：{intent_analysis.intent}
置信度：{intent_analysis.confidence}
实体信息：{json.dumps(intent_analysis.entities, ensure_ascii=False)}

用户问题：{context.messages[-1]['content']}"""}
        ]

        print(f"\n=== AI回答生成请求 ===")
        print(f"Messages: {json.dumps(messages, ensure_ascii=False, indent=2)}")

        result = await self._handle_completion_response(messages, temperature=0.7)
        
        if "error" in result:
            return {
                "error": result["error"],
                "response": {
                    "main_answer": "无法生成回答",
                    "key_points": ["无法生成"],
                    "practical_examples": ["无法生成"],
                    "implementation_steps": ["无法生成"],
                    "common_pitfalls": ["无法生成"],
                    "best_practices": ["无法生成"],
                    "additional_resources": ["无法生成"]
                },
                "metadata": {
                    "confidence": 0.0,
                    "complexity": "未知",
                    "estimated_time": 0,
                    "target_audience": "未知",
                    "prerequisites": ["无法生成"]
                }
            }
        
        return result

    async def generate_response_stream(self, context: UserContext, intent_analysis: IntentAnalysis):
        """流式生成标准化的AI回答"""
        messages = [
            {"role": "system", "content": self.system_prompt},
            {"role": "user", "content": f"""请根据以下信息生成专业的回答：

用户意图：{intent_analysis.intent}
置信度：{intent_analysis.confidence}
实体信息：{json.dumps(intent_analysis.entities, ensure_ascii=False)}

用户问题：{context.messages[-1]['content']}"""}
        ]

        # print(f"\n=== AI回答生成请求消息 ===")
        # print(f"Messages: {json.dumps(messages, ensure_ascii=False, indent=2)}")

        processing_steps = [
            "正在分析问题...",
            "生成主要回答...",
            "整理关键信息...",
            "准备实际案例...",
            "完善实施步骤...",
            "总结最佳实践..."
        ]

        async for result in self._handle_stream_response(messages, temperature=0.7, processing_steps=processing_steps):
            if "error" in result:
                yield {
                    "error": result["error"],
                    "response": {
                        "main_answer": "无法生成回答",
                        "key_points": ["无法生成"],
                        "practical_examples": ["无法生成"],
                        "implementation_steps": ["无法生成"],
                        "common_pitfalls": ["无法生成"],
                        "best_practices": ["无法生成"],
                        "additional_resources": ["无法生成"]
                    },
                    "metadata": {
                        "confidence": 0.0,
                        "complexity": "未知",
                        "estimated_time": 0,
                        "target_audience": "未知",
                        "prerequisites": ["无法生成"]
                    }
                }
            else:
                yield result 