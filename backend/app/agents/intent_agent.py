from app.core.llm.service import LLMService
from app.agents.models import UserContext, IntentAnalysis
import json
import asyncio
import time

class IntentAnalysisAgent:
    """专门负责意图分析的Agent"""
    def __init__(self):
        self.llm_service = LLMService()

    async def analyze(self, context: UserContext) -> IntentAnalysis:
        """
        分析用户意图
        """
        system_prompt = """你是一个专业的意图分析助手，专门负责分析用户是否在咨询企业培训课程相关的内容。请分析用户的输入，并返回以下格式的 JSON 响应：
{
    "intent": "用户的主要意图（例如：咨询周报写作、会议记录技巧、职场沟通、时间管理等企业培训课程相关主题）",
    "confidence": 0.0-1.0 之间的置信度分数,
    "entities": {
        "topic": "具体培训主题",
        "level": "培训难度级别（如：入门、进阶、高级）",
        "format": "期望的培训形式（如：线上课程、线下培训、工作坊）"
    }
}

请确保：
1. intent 应该明确表示是否是咨询企业培训课程相关的内容
2. confidence 应该是 0-1 之间的浮点数，表示判断的置信度
3. entities 应该包含从用户输入中提取的关键信息，如具体培训主题、难度级别等
4. 返回的必须是合法的 JSON 格式
5. 对于非企业培训课程相关的咨询，intent 应设置为 "非培训课程咨询" 并给出较低的置信度"""

        messages = [
            {"role": "system", "content": system_prompt},
            *context.messages
        ]
        
        print(f"\n=== 意图分析请求 ===")
        print(f"Messages: {json.dumps(messages, ensure_ascii=False, indent=2)}")
        
        response = await self.llm_service.create_chat_completion(
            messages=messages,
            temperature=0.3  # 降低温度以获得更确定的结果
        )
        
        print(f"\n=== LLM 响应 ===")
        print(f"Response: {json.dumps(response, ensure_ascii=False, indent=2)}")
        
        try:
            if isinstance(response, dict) and "choices" in response:
                content = response["choices"][0]["message"]["content"]
                print(f"\n=== 解析内容 ===")
                print(f"Content: {content}")
                
                # 处理可能包含 Markdown 代码块的情况
                content = content.strip()
                if content.startswith("```json"):
                    content = content[7:]  # 移除 ```json
                if content.endswith("```"):
                    content = content[:-3]  # 移除 ```
                content = content.strip()
                
                # 尝试解析 JSON 响应
                result = json.loads(content)
                print(f"\n=== 解析结果 ===")
                print(f"Result: {json.dumps(result, ensure_ascii=False, indent=2)}")
                
                return IntentAnalysis(
                    intent=result.get("intent", "未知意图"),
                    confidence=float(result.get("confidence", 0.0)),
                    entities=result.get("entities", {})
                )
            else:
                print(f"\n=== 错误：响应格式无效 ===")
                print(f"Response type: {type(response)}")
                print(f"Response content: {response}")
                raise ValueError("Invalid response format")
        except (json.JSONDecodeError, KeyError, ValueError) as e:
            print(f"\n=== 解析错误 ===")
            print(f"Error type: {type(e)}")
            print(f"Error message: {str(e)}")
            if isinstance(e, json.JSONDecodeError):
                print(f"Error position: {e.pos}")
                print(f"Error line: {e.lineno}")
                print(f"Error column: {e.colno}")
            return IntentAnalysis(
                intent="解析错误",
                confidence=0.0,
                entities={"error": str(e)}
            )

    async def analyze_stream(self, context: UserContext):
        """
        流式分析用户意图，返回中间结果和最终结果
        """
        start_time = time.time()
        current_time = time.strftime('%H:%M:%S')
        print(f"\n=== 意图分析开始: {current_time} ===")
        yield f"=== 意图分析开始: {current_time} ==="
        await asyncio.sleep(1)  # 增加等待时间

        system_prompt = """你是一个专业的意图分析助手，专门负责分析用户是否在咨询企业培训课程相关的内容。请分析用户的输入，并返回以下格式的 JSON 响应：
{
    "intent": "用户的主要意图（例如：咨询周报写作、会议记录技巧、职场沟通、时间管理等企业培训课程相关主题）",
    "confidence": 0.0-1.0 之间的置信度分数,
    "entities": {
        "topic": "具体培训主题",
        "level": "培训难度级别（如：入门、进阶、高级）",
        "format": "期望的培训形式（如：线上课程、线下培训、工作坊）"
    }
}

请确保：
1. intent 应该明确表示是否是咨询企业培训课程相关的内容
2. confidence 应该是 0-1 之间的浮点数，表示判断的置信度
3. entities 应该包含从用户输入中提取的关键信息，如具体培训主题、难度级别等
4. 返回的必须是合法的 JSON 格式
5. 对于非企业培训课程相关的咨询，intent 应设置为 "非培训课程咨询" 并给出较低的置信度"""

        messages = [
            {"role": "system", "content": system_prompt},
            *context.messages
        ]

        # 发送处理步骤并等待
        processing_steps = [
            "正在分析用户输入...",
            "提取关键信息...",
            "识别用户意图...",
            "计算置信度...",
            "整理分析结果..."
        ]

        for step in processing_steps:
            yield step
            await asyncio.sleep(1)  # 每个步骤等待1秒

        # 使用流式响应进行分析
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
                                    
                                    # 尝试解析 JSON
                                    result = json.loads(json_str)
                                    last_valid_json = result
                                    
                                    # 发送部分结果并等待
                                    yield {
                                        "partial_intent": result.get("intent", "分析中..."),
                                        "partial_confidence": result.get("confidence", 0.0),
                                        "partial_entities": result.get("entities", {})
                                    }
                                    await asyncio.sleep(1)  # 每个部分结果等待1秒
                                    
                                    # 重置状态
                                    current_json = ""
                                    in_json = False
                                except json.JSONDecodeError:
                                    # JSON 解析失败，继续累积
                                    pass
                                except Exception as e:
                                    # 其他错误，继续累积
                                    pass

        try:
            # 返回最后一个有效的 JSON 结果
            if last_valid_json:
                end_time = time.time()
                current_time = time.strftime('%H:%M:%S')
                print(f"=== 意图分析完成: {current_time} (耗时: {end_time - start_time:.1f}秒) ===")
                yield f"=== 意图分析完成: {current_time} (耗时: {end_time - start_time:.1f}秒) ==="
                await asyncio.sleep(1)  # 等待1秒
                yield IntentAnalysis(
                    intent=last_valid_json.get("intent", "未知意图"),
                    confidence=float(last_valid_json.get("confidence", 0.0)),
                    entities=last_valid_json.get("entities", {})
                )
            else:
                raise ValueError("未能获取有效的分析结果")
        except Exception as e:
            yield "意图分析出错"
            await asyncio.sleep(1)  # 等待1秒
            yield IntentAnalysis(
                intent="解析错误",
                confidence=0.0,
                entities={"error": str(e)}
            ) 