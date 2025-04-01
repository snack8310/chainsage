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

class DeepSeekClient(BaseLLMClient):
    def __init__(self):
        self.api_key = settings.DEEPSEEK_API_KEY
        self.api_base = settings.DEEPSEEK_API_BASE
        self.api_version = settings.DEEPSEEK_API_VERSION
        self.model = settings.DEEPSEEK_MODEL
        self.headers = {
            "api-key": self.api_key,
            "Content-Type": "application/json"
        }
        # 增加超时时间
        self.timeout = httpx.Timeout(
            settings.DEEPSEEK_TIMEOUT,
            connect=settings.DEEPSEEK_CONNECT_TIMEOUT,
            read=settings.DEEPSEEK_READ_TIMEOUT
        )

    def _get_url(self) -> str:
        return f"{self.api_base}/openai/deployments/{self.model}/chat/completions"

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
        
        # print(f"\n=== 准备请求数据 ===")
        # print(f"Stream enabled: {stream}")
        # print(f"Request data: {request_data}")
        # print("===================\n")
        
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
        """
        Create a streaming chat completion with DeepSeek API.
        """
        request_data = self._prepare_request_data(
            messages, temperature, max_tokens, top_p, frequency_penalty, presence_penalty, stream=True
        )
        params = {"api-version": self.api_version}

        # print(f"\n=== DeepSeek Stream API 请求信息 ===")
        # print(f"API Key: {self.api_key}")
        # print(f"请求地址: {self._get_url()}")
        # print(f"请求参数: {request_data}")
        # print(f"Headers: {self.headers}")
        # print("========================\n")

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
                    print(f"Response status: {response.status_code}")
                    print("Response headers:", response.headers)
                    async for line in response.aiter_lines():
                        # print("Raw line:", line)  # 添加原始响应日志
                        if not line.strip():
                            continue
                        
                        if line.startswith("data: "):
                            try:
                                data = json.loads(line[6:])
                                # print("Parsed data:", data)  # 添加解析数据日志
                                yield data
                            except json.JSONDecodeError as e:
                                print(f"Error parsing JSON: {e}")
                                print(f"Problematic line: {line[6:]}")  # 添加问题行日志
                                yield {"choices": [{"delta": {"content": line[6:]}}]}
            except Exception as e:
                print(f"Stream error: {e}")
                print(f"Error details: {str(e)}")
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
        """
        Create a chat completion with DeepSeek API.
        """
        if stream:
            raise ValueError("For streaming responses, use create_chat_completion_stream instead")
            
        request_data = self._prepare_request_data(
            messages, temperature, max_tokens, top_p, frequency_penalty, presence_penalty, stream=False
        )
        params = {"api-version": self.api_version}

        print(f"\n=== DeepSeek API 请求信息 ===")
        print(f"API Key: {self.api_key}")
        print(f"请求地址: {self._get_url()}")
        print(f"API Version: {self.api_version}")
        print(f"Model: {self.model}")
        print("========================\n")
        
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
                    print(f"JSON解析错误: {str(e)}")
                    print(f"响应内容: {response.text}")
                    return {
                        "error": {
                            "message": f"API返回的响应无法解析: {str(e)}",
                            "type": "json_decode_error",
                            "raw_response": response.text,
                            "status_code": response.status_code
                        }
                    }
                    
            except httpx.HTTPStatusError as e:
                print(f"HTTP错误: {str(e)}")
                try:
                    error_content = e.response.json()
                    print(f"错误响应: {error_content}")
                except:
                    error_content = e.response.text
                    print(f"原始错误响应: {error_content}")
                
                return {
                    "error": {
                        "message": f"API调用失败: {str(e)}",
                        "type": "http_error",
                        "status_code": e.response.status_code,
                        "details": error_content
                    }
                }
                
            except httpx.RequestError as e:
                print(f"请求错误: {str(e)}")
                return {
                    "error": {
                        "message": f"请求失败: {str(e)}",
                        "type": "request_error",
                        "details": str(e)
                    }
                } 