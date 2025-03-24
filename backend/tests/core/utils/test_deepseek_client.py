import pytest
from app.core.utils.deepseek_client import DeepSeekClient

@pytest.mark.asyncio
async def test_deepseek_chat_completion():
    """测试 DeepSeek API 的非流式请求"""
    client = DeepSeekClient()
    
    messages = [
        {"role": "user", "content": "你好，请做个自我介绍"}
    ]
    
    try:
        response = await client.create_chat_completion(
            messages=messages,
            temperature=0.7,
            max_tokens=1000
        )
        
        # 验证响应格式
        assert isinstance(response, dict)
        assert "choices" in response
        assert len(response["choices"]) > 0
        assert "message" in response["choices"][0]
        assert "content" in response["choices"][0]["message"]
        assert "role" in response["choices"][0]["message"]
        
        # 打印响应内容
        print("\n=== DeepSeek API 响应 ===")
        print(f"角色: {response['choices'][0]['message']['role']}")
        print(f"内容: {response['choices'][0]['message']['content']}")
        print("======================\n")
        
    except Exception as e:
        pytest.fail(f"DeepSeek API 请求失败: {str(e)}")

@pytest.mark.asyncio
async def test_deepseek_chat_completion_stream():
    """测试 DeepSeek API 的流式请求"""
    client = DeepSeekClient()
    
    messages = [
        {"role": "user", "content": "你好，请做个自我介绍"}
    ]
    
    try:
        print("\n=== DeepSeek API 流式响应 ===")
        async for chunk in client.create_chat_completion_stream(
            messages=messages,
            temperature=0.7,
            max_tokens=1000
        ):
            print(chunk, end="", flush=True)
        print("\n======================\n")
        
    except Exception as e:
        pytest.fail(f"DeepSeek API 流式请求失败: {str(e)}")

@pytest.mark.asyncio
async def test_deepseek_chat_completion_with_system_prompt():
    """测试 DeepSeek API 的系统提示词功能"""
    client = DeepSeekClient()
    
    messages = [
        {"role": "system", "content": "你是一个专业的AI助手，请用简洁的语言回答问题。"},
        {"role": "user", "content": "什么是人工智能？"}
    ]
    
    try:
        response = await client.create_chat_completion(
            messages=messages,
            temperature=0.7,
            max_tokens=1000
        )
        
        # 验证响应格式
        assert isinstance(response, dict)
        assert "choices" in response
        assert len(response["choices"]) > 0
        assert "message" in response["choices"][0]
        assert "content" in response["choices"][0]["message"]
        
        # 打印响应内容
        print("\n=== DeepSeek API 系统提示词测试 ===")
        print(f"内容: {response['choices'][0]['message']['content']}")
        print("==============================\n")
        
    except Exception as e:
        pytest.fail(f"DeepSeek API 系统提示词测试失败: {str(e)}") 