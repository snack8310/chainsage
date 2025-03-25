from app.core.llm.service import LLMService
from app.agents.models import UserContext, IntentAnalysis
import json
import asyncio
import time

class AIResponseAgent:
    """专门负责生成标准化AI回答的Agent"""
    def __init__(self):
        self.llm_service = LLMService()

    async def generate_response(self, context: UserContext, intent_analysis: IntentAnalysis) -> dict:
        """
        生成标准化的AI回答
        """
        system_prompt = """你是一个专业的企业培训和工作顾问，负责根据用户的问题提供专业、准确、实用的回答。请生成回答，并返回以下格式的 JSON 响应：
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

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"""请根据以下信息生成专业的回答：

用户意图：{intent_analysis.intent}
置信度：{intent_analysis.confidence}
实体信息：{json.dumps(intent_analysis.entities, ensure_ascii=False)}

用户问题：{context.messages[-1]['content']}"""}
        ]

        print(f"\n=== AI回答生成请求 ===")
        print(f"Messages: {json.dumps(messages, ensure_ascii=False, indent=2)}")

        try:
            response = await self.llm_service.create_chat_completion(
                messages=messages,
                temperature=0.7  # 适当提高温度以获得更有创造性的回答
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

    async def generate_response_stream(self, context: UserContext, intent_analysis: IntentAnalysis):
        """
        流式生成标准化的AI回答
        """
        start_time = time.time()
        current_time = time.strftime('%H:%M:%S')
        print(f"\n=== AI回答生成开始: {current_time} ===")
        yield f"=== AI回答生成开始: {current_time} ==="
        await asyncio.sleep(1)

        try:
            system_prompt = """你是一个专业的企业培训和工作顾问，负责根据用户的问题提供专业、准确、实用的回答。请生成回答，并返回以下格式的 JSON 响应：
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

            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"""请根据以下信息生成专业的回答：

用户意图：{intent_analysis.intent}
置信度：{intent_analysis.confidence}
实体信息：{json.dumps(intent_analysis.entities, ensure_ascii=False)}

用户问题：{context.messages[-1]['content']}"""}
            ]

            print(f"\n=== AI回答生成请求消息 ===")
            print(f"Messages: {json.dumps(messages, ensure_ascii=False, indent=2)}")

            # 发送处理步骤并等待
            processing_steps = [
                "正在分析问题...",
                "生成主要回答...",
                "整理关键信息...",
                "准备实际案例...",
                "完善实施步骤...",
                "总结最佳实践..."
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
                    temperature=0.7
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

                                            if "response" not in result:
                                                raise ValueError("结果中缺少response字段")

                                            if "metadata" not in result:
                                                raise ValueError("结果中缺少metadata字段")

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
                    print(f"\n=== AI回答生成完成 ===")
                    print(f"Time: {current_time}")
                    print(f"Duration: {end_time - start_time:.1f}秒")
                    yield f"=== AI回答生成完成: {current_time} (耗时: {end_time - start_time:.1f}秒) ==="
                    await asyncio.sleep(1)
                    yield last_valid_json
                else:
                    print("\n=== 错误：未能获取有效的回答 ===")
                    raise ValueError("未能获取有效的回答")
            except Exception as e:
                print(f"\n=== 流式处理错误 ===")
                print(f"Error type: {type(e)}")
                print(f"Error message: {str(e)}")
                yield "AI回答生成出错"
                await asyncio.sleep(1)
                yield {
                    "error": str(e),
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
        except Exception as e:
            print(f"\n=== AI回答生成过程错误 ===")
            print(f"Error type: {type(e)}")
            print(f"Error message: {str(e)}")
            yield "AI回答生成过程出错"
            await asyncio.sleep(1)
            yield {
                "error": str(e),
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