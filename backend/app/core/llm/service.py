from typing import AsyncGenerator, Dict, List, Optional, Union, Any
from app.core.llm.base import BaseLLMClient, LLMClientFactory, LLMProvider
from app.core.config import get_settings
import httpx
import json

class LLMService:
    def __init__(self):
        self.settings = get_settings()
        self._client: Optional[BaseLLMClient] = None

    @property
    def client(self) -> BaseLLMClient:
        if self._client is None:
            provider = LLMProvider(self.settings.LLM_PROVIDER.lower())
            self._client = LLMClientFactory.get_client(provider)
        return self._client

    async def create_chat_completion(
        self,
        messages: List[Dict[str, str]],
        stream: bool = False,
        temperature: float = 0.7,
        max_tokens: Optional[int] = None,
        top_p: float = 1.0,
        frequency_penalty: float = 0.0,
        presence_penalty: float = 0.0
    ) -> Dict[str, Any]:
        """
        统一的聊天完成接口
        """
        if stream:
            raise ValueError("For streaming responses, use create_chat_completion_stream instead")
            
        return await self.client.create_chat_completion(
            messages=messages,
            stream=False,
            temperature=temperature,
            max_tokens=max_tokens,
            top_p=top_p,
            frequency_penalty=frequency_penalty,
            presence_penalty=presence_penalty
        )

    async def create_chat_completion_stream(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.7,
        max_tokens: Optional[int] = None,
        top_p: float = 1.0,
        frequency_penalty: float = 0.0,
        presence_penalty: float = 0.0
    ) -> AsyncGenerator[Dict[str, Any], None]:
        """
        统一的流式聊天完成接口
        """
        async for chunk in await self.client.create_chat_completion_stream(
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens,
            top_p=top_p,
            frequency_penalty=frequency_penalty,
            presence_penalty=presence_penalty
        ):
            if isinstance(chunk, str):
                try:
                    yield json.loads(chunk)
                except json.JSONDecodeError:
                    yield {"choices": [{"delta": {"content": chunk}}]}
            else:
                yield chunk 