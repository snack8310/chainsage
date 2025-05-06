from typing import AsyncGenerator, Dict, List, Optional, Union, Any
import httpx
from pydantic import BaseModel
import json

from app.core.config import get_settings
from app.core.llm.base import BaseLLMClient

settings = get_settings()

class Message(BaseModel):
    role: str
    content: str

class ChatCompletionRequest(BaseModel):
    messages: List[Message]
    stream: bool = False
    temperature: float = 0.7
    max_tokens: Optional[int] = None
    top_p: float = 1.0
    frequency_penalty: float = 0.0
    presence_penalty: float = 0.0

class WCLLMClient(BaseLLMClient):
    def __init__(self):
        self.api_key = settings.WC_LLM_API_KEY
        self.api_base = settings.WC_LLM_API_BASE
        self.api_version = settings.WC_LLM_API_VERSION
        self.model = settings.WC_LLM_MODEL
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        self.timeout = httpx.Timeout(
            settings.WC_LLM_TIMEOUT,
            connect=settings.WC_LLM_CONNECT_TIMEOUT,
            read=settings.WC_LLM_READ_TIMEOUT
        )

    def _get_url(self) -> str:
        return f"{self.api_base}/chat/completions"

    def _prepare_request_data(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.7,
        max_tokens: Optional[int] = None,
        top_p: float = 1.0,
        frequency_penalty: float = 0.0,
        presence_penalty: float = 0.0,
        stream: bool = False
    ) -> Dict[str, Any]:
        request_data = ChatCompletionRequest(
            messages=[Message(**msg) for msg in messages],
            stream=stream,
            temperature=temperature,
            max_tokens=max_tokens,
            top_p=top_p,
            frequency_penalty=frequency_penalty,
            presence_penalty=presence_penalty
        ).model_dump()
        
        request_data["model"] = self.model
        return request_data

    async def create_chat_completion_stream(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.7,
        max_tokens: Optional[int] = None,
        top_p: float = 1.0,
        frequency_penalty: float = 0.0,
        presence_penalty: float = 0.0
    ) -> AsyncGenerator[Dict[str, Any], None]:
        request_data = self._prepare_request_data(
            messages, temperature, max_tokens, top_p, frequency_penalty, presence_penalty, stream=True
        )
        params = {"api-version": self.api_version}

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            try:
                async with client.stream(
                    "POST",
                    self._get_url(),
                    headers=self.headers,
                    json=request_data,
                    params=params
                ) as response:
                    response.raise_for_status()
                    async for line in response.aiter_lines():
                        if not line.strip():
                            continue
                        
                        if line.startswith("data: "):
                            try:
                                data = json.loads(line[6:])
                                yield data
                            except json.JSONDecodeError:
                                yield {"choices": [{"delta": {"content": line[6:]}}]}
            except Exception as e:
                yield {"choices": [{"delta": {"content": f"[ERROR] {str(e)}"}}]}

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
        if stream:
            raise ValueError("For streaming responses, use create_chat_completion_stream instead")
            
        request_data = self._prepare_request_data(
            messages, temperature, max_tokens, top_p, frequency_penalty, presence_penalty, stream=False
        )
        params = {"api-version": self.api_version}
        
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            try:
                response = await client.post(
                    self._get_url(),
                    headers=self.headers,
                    json=request_data,
                    params=params
                )
                response.raise_for_status()
                
                try:
                    return response.json()
                except json.JSONDecodeError as e:
                    return {
                        "error": {
                            "message": f"API返回的响应无法解析: {str(e)}",
                            "type": "json_decode_error",
                            "raw_response": response.text,
                            "status_code": response.status_code
                        }
                    }
                    
            except httpx.HTTPStatusError as e:
                try:
                    error_content = e.response.json()
                except:
                    error_content = e.response.text
                
                return {
                    "error": {
                        "message": f"API调用失败: {str(e)}",
                        "type": "http_error",
                        "status_code": e.response.status_code,
                        "details": error_content
                    }
                }
                
            except httpx.RequestError as e:
                return {
                    "error": {
                        "message": f"请求失败: {str(e)}",
                        "type": "request_error",
                        "details": str(e)
                    }
                } 