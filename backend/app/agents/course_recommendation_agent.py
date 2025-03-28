from app.core.llm.service import LLMService
from app.agents.models import UserContext, IntentAnalysis
import json
import asyncio
import os
from pathlib import Path
import time

class CourseRecommendationAgent:
    def __init__(self):
        self.llm_service = LLMService()
        self.pdf_dir = os.path.join(os.path.dirname(__file__), "../data/courses")
        self._load_course_contents()

    def _load_course_contents(self):
        """加载所有课程内容的摘要"""
        self.course_summaries = []
        if not os.path.exists(self.pdf_dir):
            os.makedirs(self.pdf_dir)
            return

        for pdf_file in Path(self.pdf_dir).glob("*.pdf"):
            try:
                # 这里可以使用 PyPDF2 或其他 PDF 库来提取文本
                # 为简单起见，这里只存储文件名作为示例
                self.course_summaries.append({
                    "title": pdf_file.stem,
                    "path": str(pdf_file),
                    "summary": f"这是{pdf_file.stem}课程的内容摘要"
                })
            except Exception as e:
                print(f"Error loading course {pdf_file}: {str(e)}")

    async def recommend_courses_stream(self, context: UserContext, intent_analysis: IntentAnalysis):
        """基于用户意图和问题分析推荐相关课程"""
        start_time = time.time()
        current_time = time.strftime('%H:%M:%S')
        print(f"\n=== 课程推荐开始: {current_time} ===")

        try:
            system_prompt = """你是一个专业的课程推荐助手。基于用户的问题和意图分析，从给定的课程列表中推荐最相关的课程。
请分析用户输入和意图，并返回以下格式的 JSON 响应：
{
    "recommendations": [
        {
            "title": "课程标题",
            "relevance_score": 0.0-1.0 之间的相关度分数,
            "summary": "课程内容摘要",
            "source": "课程来源",
            "page": 1
        }
    ],
    "metadata": {
        "total_courses": 推荐课程数量,
        "query_context": {
            "intent": "用户意图",
            "confidence": 0.0-1.0 置信度
        }
    }
}

请确保：
1. 推荐的课程与用户的问题和意图高度相关
2. relevance_score 应该反映课程与用户需求的匹配度
3. 返回的必须是合法的 JSON 格式
4. 如果没有找到相关课程，返回空的推荐列表"""

            # 构建课程信息
            courses_info = json.dumps(self.course_summaries, ensure_ascii=False)
            
            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"""
用户问题: {context.messages[0]['content']}
意图分析: {json.dumps(intent_analysis.dict(), ensure_ascii=False)}
可用课程: {courses_info}
"""}
            ]

            print(f"\n=== 课程推荐请求 ===")
            print(f"Messages: {json.dumps(messages, ensure_ascii=False, indent=2)}")

            # 使用流式响应进行推荐
            current_json = ""
            last_valid_json = None
            brace_count = 0
            in_json = False

            async for chunk in self.llm_service.create_chat_completion_stream(
                messages=messages,
                temperature=0.3
            ):
                if chunk and "choices" in chunk and chunk["choices"]:
                    content = chunk["choices"][0].get("delta", {}).get("content", "")
                    if content:
                        current_json += content
                        
                        # 计算大括号数量
                        for char in content:
                            if char == '{':
                                brace_count += 1
                                in_json = True
                            elif char == '}':
                                brace_count -= 1
                                if brace_count == 0 and in_json:
                                    try:
                                        # 清理和解析 JSON
                                        json_str = current_json.strip()
                                        if json_str.startswith("```json"):
                                            json_str = json_str[7:]
                                        if json_str.startswith("```"):
                                            json_str = json_str[3:]
                                        if json_str.endswith("```"):
                                            json_str = json_str[:-3]
                                        json_str = json_str.strip()
                                        
                                        result = json.loads(json_str)
                                        last_valid_json = result
                                        
                                        # 发送部分结果
                                        yield result
                                        await asyncio.sleep(0.1)
                                        
                                        # 重置状态
                                        current_json = ""
                                        in_json = False
                                    except json.JSONDecodeError:
                                        # JSON 解析失败，继续累积
                                        pass

            # 返回最后一个有效的推荐结果
            if last_valid_json:
                end_time = time.time()
                print(f"\n=== 课程推荐完成 ===")
                print(f"Duration: {end_time - start_time:.1f}秒")
                yield last_valid_json
            else:
                # 如果没有有效结果，返回空推荐
                yield {
                    "recommendations": [],
                    "metadata": {
                        "total_courses": 0,
                        "query_context": {
                            "intent": intent_analysis.intent,
                            "confidence": intent_analysis.confidence
                        }
                    }
                }

        except Exception as e:
            print(f"\n=== 课程推荐错误 ===")
            print(f"Error: {str(e)}")
            yield {
                "error": f"课程推荐过程中出错: {str(e)}",
                "recommendations": []
            } 