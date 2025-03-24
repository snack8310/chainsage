from app.core.llm.service import LLMService
from app.agents.models import IntentAnalysis
import json
import asyncio
import time

class CollectionStrategyAgent:
    """专门负责催收策略分析的Agent"""
    def __init__(self):
        self.llm_service = LLMService()

    async def analyze_strategy(self, intent_analysis: IntentAnalysis) -> dict:
        """
        基于意图分析结果，分析催收策略
        """
        system_prompt = """你是一个专业的催收策略分析助手。请基于用户的意图分析结果，提供合适的催收策略建议。
请返回以下格式的 JSON 响应：
{
    "strategy": "建议的催收策略（例如：电话催收、短信提醒、上门催收等）",
    "priority": "优先级（high/medium/low）",
    "timeline": "建议执行时间",
    "approach": "具体执行方式",
    "risk_level": "风险等级（high/medium/low）",
    "notes": "其他注意事项"
}

请确保：
1. 策略要基于意图分析结果制定
2. 考虑用户意图的置信度
3. 考虑提取的实体信息
4. 返回的必须是合法的 JSON 格式"""

        # 构建用户意图分析结果的描述
        intent_description = f"""
意图分析结果：
- 意图：{intent_analysis.intent}
- 置信度：{intent_analysis.confidence}
- 实体信息：{json.dumps(intent_analysis.entities, ensure_ascii=False)}
"""

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": intent_description}
        ]
        
        print(f"\n=== 催收策略分析请求 ===")
        print(f"Messages: {json.dumps(messages, ensure_ascii=False, indent=2)}")
        
        response = await self.llm_service.create_chat_completion(
            messages=messages,
            temperature=0.3
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
                    content = content[7:]
                if content.endswith("```"):
                    content = content[:-3]
                content = content.strip()
                
                # 解析 JSON 响应
                result = json.loads(content)
                print(f"\n=== 解析结果 ===")
                print(f"Result: {json.dumps(result, ensure_ascii=False, indent=2)}")
                
                return result
            else:
                print(f"\n=== 错误：响应格式无效 ===")
                print(f"Response type: {type(response)}")
                print(f"Response content: {response}")
                raise ValueError("Invalid response format")
        except (json.JSONDecodeError, KeyError, ValueError) as e:
            print(f"\n=== 解析错误 ===")
            print(f"Error type: {type(e)}")
            print(f"Error message: {str(e)}")
            return {
                "strategy": "解析错误",
                "priority": "low",
                "timeline": "立即",
                "approach": "需要人工介入",
                "risk_level": "high",
                "notes": f"策略分析出错: {str(e)}"
            }

    async def analyze_strategy_stream(self, intent_analysis: IntentAnalysis):
        """
        流式分析催收策略，返回中间结果和最终结果
        """
        start_time = time.time()
        current_time = time.strftime('%H:%M:%S')
        print(f"\n=== 催收策略分析开始: {current_time} ===")
        yield f"=== 催收策略分析开始: {current_time} ==="
        await asyncio.sleep(1)  # 等待1秒

        # 构建系统提示
        system_prompt = """你是一个专业的催收策略分析助手。请根据用户的意图分析结果，生成合适的催收策略。
请返回以下格式的 JSON 响应：
{
    "strategy": "催收策略（例如：电话催收、上门催收、法律催收等）",
    "priority": "优先级（high/medium/low）",
    "timeline": "执行时间线",
    "approach": "具体执行方法",
    "risk_level": "风险等级（high/medium/low）",
    "notes": "注意事项"
}

请确保：
1. 策略要符合用户意图和风险等级
2. 优先级和风险等级使用英文
3. 时间线要具体明确
4. 执行方法要详细可行
5. 注意事项要全面
6. 返回的必须是合法的 JSON 格式
7. 不要添加任何额外的注释或说明，只返回JSON"""

        # 构建用户消息
        user_message = f"""请根据以下意图分析结果生成催收策略：

意图：{intent_analysis.intent}
置信度：{intent_analysis.confidence}
实体信息：{json.dumps(intent_analysis.entities, ensure_ascii=False)}"""

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ]

        # 发送处理步骤并等待
        processing_steps = [
            "开始分析催收策略...",
            "正在分析用户意图...",
            "评估风险等级...",
            "制定催收策略...",
            "确定执行优先级...",
            "生成执行建议..."
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
                                        "partial_strategy": result.get("strategy", "分析中..."),
                                        "partial_priority": result.get("priority", "medium"),
                                        "partial_timeline": result.get("timeline", "待定"),
                                        "partial_approach": result.get("approach", "分析中..."),
                                        "partial_risk_level": result.get("risk_level", "medium"),
                                        "partial_notes": result.get("notes", "分析中...")
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
                print(f"=== 催收策略分析完成: {current_time} (耗时: {end_time - start_time:.1f}秒) ===")
                yield f"=== 催收策略分析完成: {current_time} (耗时: {end_time - start_time:.1f}秒) ==="
                await asyncio.sleep(1)  # 等待1秒
                yield last_valid_json
            else:
                raise ValueError("未能获取有效的分析结果")
        except Exception as e:
            yield "催收策略分析出错"
            await asyncio.sleep(1)  # 等待1秒
            yield {
                "strategy": "分析错误",
                "priority": "medium",
                "timeline": "待定",
                "approach": str(e),
                "risk_level": "medium",
                "notes": "请检查系统日志"
            } 