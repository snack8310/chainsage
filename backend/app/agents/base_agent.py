from app.core.llm.service import LLMService
from app.agents.models import UserContext
import json
import asyncio
import time
from typing import AsyncGenerator, Any, Dict, Optional

class BaseAgent:
    """所有 Agent 的基类，提供共同的功能和接口"""
    def __init__(self):
        self.llm_service = LLMService()

    async def _process_json_response(self, content: str) -> Dict[str, Any]:
        """处理 JSON 响应，包括处理 Markdown 代码块"""
        content = content.strip()
        if content.startswith("```json"):
            content = content[7:]
        if content.endswith("```"):
            content = content[:-3]
        content = content.strip()
        return json.loads(content)

    async def _handle_stream_response(
        self,
        messages: list,
        temperature: float = 0.3,
        processing_steps: Optional[list] = None
    ) -> AsyncGenerator[Any, None]:
        """处理流式响应的通用方法"""
        if processing_steps:
            for step in processing_steps:
                yield step
                await asyncio.sleep(1)

        current_json = ""
        json_started = False
        json_completed = False

        try:
            async for chunk in self.llm_service.create_chat_completion_stream(
                messages=messages,
                temperature=temperature
            ):
                if chunk and "choices" in chunk and chunk["choices"]:
                    content = chunk["choices"][0].get("delta", {}).get("content", "")
                    if content:
                        current_json += content
                        print(f"\n=== 收到内容片段 ===")
                        print(f"Content: {content}")

                        if not json_started and '{' in content:
                            json_started = True
                            print("开始接收JSON数据")

                        if json_started and not json_completed:
                            try:
                                result = await self._process_json_response(current_json)
                                yield result
                                json_completed = True
                            except json.JSONDecodeError:
                                # JSON 还不完整，继续等待
                                continue

        except Exception as e:
            print(f"\n=== 流式处理错误 ===")
            print(f"Error type: {type(e)}")
            print(f"Error message: {str(e)}")
            yield {"error": str(e)}

    async def _handle_completion_response(
        self,
        messages: list,
        temperature: float = 0.3
    ) -> Dict[str, Any]:
        """处理普通完成响应的通用方法"""
        try:
            response = await self.llm_service.create_chat_completion(
                messages=messages,
                temperature=temperature
            )

            if isinstance(response, dict) and "choices" in response:
                content = response["choices"][0]["message"]["content"]
                print(f"\n=== 解析内容 ===")
                print(f"Content: {content}")

                return await self._process_json_response(content)
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
            return {"error": str(e)} 