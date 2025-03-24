from app.core.llm.service import LLMService
from app.agents.models import UserContext, IntentAnalysis
import json
import asyncio
import time

class TrainingAdvisorAgent:
    """专门负责分析用户提问方式并提供改进建议的Agent"""
    def __init__(self):
        self.llm_service = LLMService()

    async def analyze_question(self, context: UserContext, intent_analysis: IntentAnalysis) -> dict:
        """
        分析用户提问方式并提供改进建议
        """
        system_prompt = """你是一个专业的企业培训顾问，专门负责分析用户的提问方式并提供改进建议。请分析用户的提问，并返回以下格式的 JSON 响应：
{
    "question_analysis": {
        "clarity": "提问的清晰度评分（0-1）",
        "specificity": "提问的具体性评分（0-1）",
        "context": "提问的上下文完整性评分（0-1）",
        "professionalism": "提问的专业性评分（0-1）",
        "overall_score": "总体评分（0-1）"
    },
    "improvement_suggestions": {
        "clarity_improvements": ["清晰度改进建议1", "清晰度改进建议2"],
        "specificity_improvements": ["具体性改进建议1", "具体性改进建议2"],
        "context_improvements": ["上下文改进建议1", "上下文改进建议2"],
        "professionalism_improvements": ["专业性改进建议1", "专业性改进建议2"]
    },
    "best_practices": {
        "question_structure": "建议的提问结构",
        "key_elements": ["关键要素1", "关键要素2"],
        "examples": ["好的提问示例1", "好的提问示例2"]
    },
    "follow_up_questions": ["跟进问题1", "跟进问题2"]
}

请确保：
1. 评分应该客观反映用户提问的实际水平
2. 改进建议应该具体、可操作
3. 最佳实践应该符合企业培训场景
4. 跟进问题应该有助于深入理解主题
5. 返回的必须是合法的 JSON 格式"""

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"""请分析以下用户提问，并提供改进建议：

用户意图：{intent_analysis.intent}
置信度：{intent_analysis.confidence}
实体信息：{json.dumps(intent_analysis.entities, ensure_ascii=False)}

用户提问：{context.messages[-1]['content']}"""}
        ]

        print(f"\n=== 提问分析请求 ===")
        print(f"Messages: {json.dumps(messages, ensure_ascii=False, indent=2)}")

        try:
            response = await self.llm_service.create_chat_completion(
                messages=messages,
                temperature=0.3
            )

            if isinstance(response, dict) and "choices" in response:
                content = response["choices"][0]["message"]["content"]
                print(f"\n=== 解析内容 ===")
                print(f"Content: {content}")

                # 处理可能包含 Markdown 代码块的情况
                content = content.strip()
                if content.startswith("```json"):
                    content = content[7:]
                if content.endswith("```"):
                    content = content[:-3]
                content = content.strip()

                # 尝试解析 JSON 响应
                result = json.loads(content)
                print(f"\n=== 解析结果 ===")
                print(f"Result: {json.dumps(result, ensure_ascii=False, indent=2)}")

                return result
            else:
                print(f"\n=== 错误：响应格式无效 ===")
                print(f"Response type: {type(response)}")
                print(f"Response content: {response}")
                raise ValueError("Invalid response format")
        except Exception as e:
            print(f"\n=== 解析错误 ===")
            print(f"Error type: {type(e)}")
            print(f"Error message: {str(e)}")
            if isinstance(e, json.JSONDecodeError):
                print(f"Error position: {e.pos}")
                print(f"Error line: {e.lineno}")
                print(f"Error column: {e.colno}")
            return {
                "error": str(e),
                "question_analysis": {
                    "clarity": 0.0,
                    "specificity": 0.0,
                    "context": 0.0,
                    "professionalism": 0.0,
                    "overall_score": 0.0
                },
                "improvement_suggestions": {
                    "clarity_improvements": ["无法分析"],
                    "specificity_improvements": ["无法分析"],
                    "context_improvements": ["无法分析"],
                    "professionalism_improvements": ["无法分析"]
                },
                "best_practices": {
                    "question_structure": "无法分析",
                    "key_elements": ["无法分析"],
                    "examples": ["无法分析"]
                },
                "follow_up_questions": ["无法分析"]
            }

    async def analyze_question_stream(self, context: UserContext, intent_analysis: IntentAnalysis):
        """
        流式分析用户提问方式并提供改进建议
        """
        start_time = time.time()
        current_time = time.strftime('%H:%M:%S')
        print(f"\n=== 提问分析开始: {current_time} ===")
        yield f"=== 提问分析开始: {current_time} ==="
        await asyncio.sleep(1)

        try:
            system_prompt = """你是一个专业的企业培训顾问，专门负责分析用户的提问方式并提供改进建议。请分析用户的提问，并返回以下格式的 JSON 响应：
{
    "question_analysis": {
        "clarity": "提问的清晰度评分（0-1）",
        "specificity": "提问的具体性评分（0-1）",
        "context": "提问的上下文完整性评分（0-1）",
        "professionalism": "提问的专业性评分（0-1）",
        "overall_score": "总体评分（0-1）"
    },
    "improvement_suggestions": {
        "clarity_improvements": ["清晰度改进建议1", "清晰度改进建议2"],
        "specificity_improvements": ["具体性改进建议1", "具体性改进建议2"],
        "context_improvements": ["上下文改进建议1", "上下文改进建议2"],
        "professionalism_improvements": ["专业性改进建议1", "专业性改进建议2"]
    },
    "best_practices": {
        "question_structure": "建议的提问结构",
        "key_elements": ["关键要素1", "关键要素2"],
        "examples": ["好的提问示例1", "好的提问示例2"]
    },
    "follow_up_questions": ["跟进问题1", "跟进问题2"]
}

请确保：
1. 评分应该客观反映用户提问的实际水平
2. 改进建议应该具体、可操作
3. 最佳实践应该符合企业培训场景
4. 跟进问题应该有助于深入理解主题
5. 返回的必须是合法的 JSON 格式"""

            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"""请分析以下用户提问，并提供改进建议：

用户意图：{intent_analysis.intent}
置信度：{intent_analysis.confidence}
实体信息：{json.dumps(intent_analysis.entities, ensure_ascii=False)}

用户提问：{context.messages[-1]['content']}"""}
            ]

            print(f"\n=== 提问分析请求消息 ===")
            print(f"Messages: {json.dumps(messages, ensure_ascii=False, indent=2)}")

            # 发送处理步骤并等待
            processing_steps = [
                "正在分析提问方式...",
                "评估提问质量...",
                "生成改进建议...",
                "整理最佳实践...",
                "准备跟进问题..."
            ]

            for step in processing_steps:
                yield step
                await asyncio.sleep(1)

            # 使用流式响应进行分析
            current_json = ""
            last_valid_json = None
            brace_count = 0
            in_json = False
            json_started = False
            json_completed = False

            try:
                async for chunk in self.llm_service.create_chat_completion_stream(
                    messages=messages,
                    temperature=0.3
                ):
                    if chunk and "choices" in chunk and chunk["choices"]:
                        content = chunk["choices"][0].get("delta", {}).get("content", "")
                        if content:
                            current_json += content
                            print(f"\n=== 收到内容片段 ===")
                            print(f"Content: {content}")

                            # 检查是否开始接收JSON
                            if not json_started and '{' in content:
                                json_started = True
                                print("开始接收JSON数据")

                            # 计算大括号数量
                            for char in content:
                                if char == '{':
                                    brace_count += 1
                                    in_json = True
                                elif char == '}':
                                    brace_count -= 1
                                    if brace_count == 0 and in_json:
                                        json_completed = True
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

                                            print(f"\n=== 尝试解析JSON ===")
                                            print(f"JSON string: {json_str}")

                                            # 尝试解析 JSON
                                            result = json.loads(json_str)

                                            # 验证结果格式
                                            if not isinstance(result, dict):
                                                raise ValueError("结果不是有效的JSON对象")

                                            if "question_analysis" not in result:
                                                raise ValueError("结果中缺少question_analysis字段")

                                            if "improvement_suggestions" not in result:
                                                raise ValueError("结果中缺少improvement_suggestions字段")

                                            if "best_practices" not in result:
                                                raise ValueError("结果中缺少best_practices字段")

                                            if "follow_up_questions" not in result:
                                                raise ValueError("结果中缺少follow_up_questions字段")

                                            last_valid_json = result

                                            print(f"\n=== JSON解析成功 ===")
                                            print(f"Result: {json.dumps(result, ensure_ascii=False, indent=2)}")

                                            # 发送部分结果并等待
                                            yield result
                                            await asyncio.sleep(1)

                                            # 重置状态
                                            current_json = ""
                                            in_json = False
                                        except json.JSONDecodeError as e:
                                            print(f"\n=== JSON解析错误 ===")
                                            print(f"Error: {str(e)}")
                                            print(f"Position: {e.pos}")
                                            print(f"Line: {e.lineno}")
                                            print(f"Column: {e.colno}")
                                            pass
                                        except Exception as e:
                                            print(f"\n=== 其他错误 ===")
                                            print(f"Error type: {type(e)}")
                                            print(f"Error message: {str(e)}")
                                            pass

                # 检查是否成功获取到有效结果
                if not json_started:
                    print("\n=== 错误：未收到任何JSON数据 ===")
                    raise ValueError("未收到任何JSON数据")

                if not json_completed:
                    print("\n=== 错误：JSON数据不完整 ===")
                    raise ValueError("JSON数据不完整")

                # 返回最后一个有效的 JSON 结果
                if last_valid_json:
                    end_time = time.time()
                    current_time = time.strftime('%H:%M:%S')
                    print(f"\n=== 提问分析完成 ===")
                    print(f"Time: {current_time}")
                    print(f"Duration: {end_time - start_time:.1f}秒")
                    yield f"=== 提问分析完成: {current_time} (耗时: {end_time - start_time:.1f}秒) ==="
                    await asyncio.sleep(1)
                    yield last_valid_json
                else:
                    print("\n=== 错误：未能获取有效的分析结果 ===")
                    raise ValueError("未能获取有效的分析结果")
            except Exception as e:
                print(f"\n=== 流式处理错误 ===")
                print(f"Error type: {type(e)}")
                print(f"Error message: {str(e)}")
                yield "提问分析出错"
                await asyncio.sleep(1)
                yield {
                    "error": str(e),
                    "question_analysis": {
                        "clarity": 0.0,
                        "specificity": 0.0,
                        "context": 0.0,
                        "professionalism": 0.0,
                        "overall_score": 0.0
                    },
                    "improvement_suggestions": {
                        "clarity_improvements": ["无法分析"],
                        "specificity_improvements": ["无法分析"],
                        "context_improvements": ["无法分析"],
                        "professionalism_improvements": ["无法分析"]
                    },
                    "best_practices": {
                        "question_structure": "无法分析",
                        "key_elements": ["无法分析"],
                        "examples": ["无法分析"]
                    },
                    "follow_up_questions": ["无法分析"]
                }
        except Exception as e:
            print(f"\n=== 提问分析过程错误 ===")
            print(f"Error type: {type(e)}")
            print(f"Error message: {str(e)}")
            yield "提问分析过程出错"
            await asyncio.sleep(1)
            yield {
                "error": str(e),
                "question_analysis": {
                    "clarity": 0.0,
                    "specificity": 0.0,
                    "context": 0.0,
                    "professionalism": 0.0,
                    "overall_score": 0.0
                },
                "improvement_suggestions": {
                    "clarity_improvements": ["无法分析"],
                    "specificity_improvements": ["无法分析"],
                    "context_improvements": ["无法分析"],
                    "professionalism_improvements": ["无法分析"]
                },
                "best_practices": {
                    "question_structure": "无法分析",
                    "key_elements": ["无法分析"],
                    "examples": ["无法分析"]
                },
                "follow_up_questions": ["无法分析"]
            } 