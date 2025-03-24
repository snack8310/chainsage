from typing import AsyncGenerator
from app.core.llm.service import LLMService
import json

class ChatAgent:
    """专门负责对话功能的Agent"""
    def __init__(self):
        self.llm_service = LLMService()

    async def get_response(self, message: str) -> str:
        """
        获取LLM对用户消息的回复
        """
        messages = [{"role": "user", "content": message}]
        response = await self.llm_service.create_chat_completion(
            messages=messages,
            temperature=0.7,
            stream=False  # 确保返回Dict而不是stream
        )
        
        if isinstance(response, dict):
            if "error" in response:
                error_msg = response["error"].get("message", "未知错误")
                error_details = response["error"].get("details", "")
                return f"抱歉，调用AI服务时出现错误: {error_msg}\n详细信息: {error_details}"
            
            try:
                return response["choices"][0]["message"]["content"]
            except (KeyError, IndexError) as e:
                print("Unexpected API response format:", response)
                return f"抱歉，处理AI响应时出现错误: {str(e)}\n响应格式: {response}"
        else:
            return "抱歉，收到了意外的响应类型"

    async def get_stream_response(self, message: str) -> AsyncGenerator[str, None]:
        """
        获取LLM对用户消息的流式回复
        """
        messages = [{"role": "user", "content": message}]
        try:
            async for chunk in self.llm_service.create_chat_completion_stream(
                messages=messages,
                temperature=0.7
            ):
                try:
                    if isinstance(chunk, str):
                        # 尝试解析JSON字符串
                        try:
                            data = json.loads(chunk)
                            if "choices" in data and len(data["choices"]) > 0:
                                content = data["choices"][0].get("delta", {}).get("content")
                                if content:
                                    yield content
                        except json.JSONDecodeError:
                            # 如果不是JSON，直接输出
                            yield chunk
                    elif isinstance(chunk, dict):
                        if "choices" in chunk and len(chunk["choices"]) > 0:
                            content = chunk["choices"][0].get("delta", {}).get("content")
                            if content:
                                yield content
                except Exception as e:
                    print(f"Error processing chunk: {e}")
                    print(f"Problematic chunk: {chunk}")
                    continue
        except Exception as e:
            print(f"Stream error: {e}")
            yield "[ERROR] Stream ended unexpectedly" 