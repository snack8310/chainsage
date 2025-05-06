from abc import ABC, abstractmethod
from typing import AsyncGenerator, Dict, List, Optional, Union, Any
from enum import Enum

class LLMProvider(Enum):
    DEEPSEEK = "deepseek"
    WC_LLM = "wc_llm"  # 添加 WC LLM 提供商
    # 可以添加更多提供商

class BaseLLMClient(ABC):
    @abstractmethod
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
        """创建聊天完成"""
        pass

    @abstractmethod
    async def create_chat_completion_stream(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.7,
        max_tokens: Optional[int] = None,
        top_p: float = 1.0,
        frequency_penalty: float = 0.0,
        presence_penalty: float = 0.0
    ) -> AsyncGenerator[Dict[str, Any], None]:
        """创建流式聊天完成"""
        pass

class LLMClientFactory:
    _clients = {}

    @classmethod
    def get_client(cls, provider: LLMProvider) -> BaseLLMClient:
        if provider not in cls._clients:
            if provider == LLMProvider.DEEPSEEK:
                from app.core.utils.deepseek_client import DeepSeekClient
                cls._clients[provider] = DeepSeekClient()
            elif provider == LLMProvider.WC_LLM:
                from app.core.utils.wc_llm_client import WCLLMClient
                cls._clients[provider] = WCLLMClient()
            # 可以添加更多提供商
        return cls._clients[provider] 