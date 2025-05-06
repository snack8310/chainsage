from typing import AsyncGenerator, Dict, List, Optional, Union, Any, cast
from openai import OpenAI
from openai.types.chat import ChatCompletionMessageParam
import json
import logging

from app.core.config import get_settings
from app.core.llm.base import BaseLLMClient, ChatMessage

logger = logging.getLogger(__name__)
settings = get_settings()

class WCLLMClient(BaseLLMClient):
    def __init__(self):
        self.api_key = settings.WC_LLM_API_KEY
        self.api_base = settings.WC_LLM_API_BASE
        self.model = settings.WC_LLM_MODEL
        self.client = OpenAI(
            api_key=self.api_key,
            base_url=self.api_base
        )
        logger.info(f"Initialized WCLLMClient with API Key: {self.api_key}")
        logger.info(f"Base URL: {self.api_base}")

    def _convert_messages(self, messages: List[ChatMessage]) -> List[ChatCompletionMessageParam]:
        """Convert ChatMessage objects to the format expected by OpenAI client"""
        converted = []
        for msg in messages:
            message_dict: Dict[str, Any] = {
                "role": msg.role.value,
                "content": msg.content
            }
            if msg.name:
                message_dict["name"] = msg.name
            if msg.function_call:
                message_dict["function_call"] = msg.function_call
            if msg.tool_calls:
                message_dict["tool_calls"] = msg.tool_calls
            if msg.tool_call_id:
                message_dict["tool_call_id"] = msg.tool_call_id
            converted.append(cast(ChatCompletionMessageParam, message_dict))
        return converted

    async def create_chat_completion(
        self,
        messages: List[ChatMessage],
        stream: bool = False,
        temperature: float = 0.7,
        max_tokens: Optional[int] = None,
        top_p: float = 1.0,
        frequency_penalty: float = 0.0,
        presence_penalty: float = 0.0
    ) -> Dict[str, Any]:
        if stream:
            raise ValueError("For streaming responses, use create_chat_completion_stream instead")
            
        try:
            converted_messages = self._convert_messages(messages)
            completion = self.client.chat.completions.create(
                model=self.model,
                messages=converted_messages,
                temperature=temperature,
                max_tokens=max_tokens,
                top_p=top_p,
                frequency_penalty=frequency_penalty,
                presence_penalty=presence_penalty
            )
            return completion.model_dump()
        except Exception as e:
            logger.error(f"Error in create_chat_completion: {str(e)}")
            return {
                "error": {
                    "message": f"API调用失败: {str(e)}",
                    "type": "api_error",
                    "details": str(e)
                }
            }

    async def create_chat_completion_stream(
        self,
        messages: List[ChatMessage],
        temperature: float = 0.7,
        max_tokens: Optional[int] = None,
        top_p: float = 1.0,
        frequency_penalty: float = 0.0,
        presence_penalty: float = 0.0
    ) -> AsyncGenerator[Dict[str, Any], None]:
        try:
            converted_messages = self._convert_messages(messages)
            stream = self.client.chat.completions.create(
                model=self.model,
                messages=converted_messages,
                temperature=temperature,
                max_tokens=max_tokens,
                top_p=top_p,
                frequency_penalty=frequency_penalty,
                presence_penalty=presence_penalty,
                stream=True
            )
            for chunk in stream:
                yield chunk.model_dump()
        except Exception as e:
            logger.error(f"Error in create_chat_completion_stream: {str(e)}")
            yield {
                "error": {
                    "message": f"API调用失败: {str(e)}",
                    "type": "api_error",
                    "details": str(e)
                }
            } 