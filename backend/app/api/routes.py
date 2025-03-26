from fastapi import APIRouter, Depends, Request, Query
from fastapi.responses import StreamingResponse, JSONResponse
from app.agents.llm_agent import LLMAgent, UserContext, IntentAnalysis
from app.agents.collection_strategy_agent import CollectionStrategyAgent
from app.agents.training_advisor_agent import TrainingAdvisorAgent
from app.agents.ai_response_agent import AIResponseAgent
from app.core.config import get_settings
from pydantic import BaseModel
import json
import asyncio

router = APIRouter()

def get_llm_agent():
    return LLMAgent()

def get_collection_strategy_agent():
    return CollectionStrategyAgent()

def get_training_advisor_agent():
    return TrainingAdvisorAgent()

def get_ai_response_agent():
    return AIResponseAgent()

class ChatRequest(BaseModel):
    message: str
    stream: bool = False

class ChatResponse(BaseModel):
    response: str

class IntentRequest(BaseModel):
    message: str
    messages: list = []
    user_id: str
    session_id: str

async def stream_analysis(request: IntentRequest, llm_agent: LLMAgent, collection_strategy_agent: CollectionStrategyAgent, training_advisor_agent: TrainingAdvisorAgent, ai_response_agent: AIResponseAgent):
    """
    流式处理分析过程
    """
    try:
        # 发送开始分析的消息
        yield f"data: {json.dumps({'type': 'status', 'status': 'started', 'message': '开始分析流程'})}\n\n"
        await asyncio.sleep(0.1)  # 减少等待时间

        context = UserContext(
            messages=[{"role": "user", "content": request.message}],
            user_id=request.user_id,
            session_id=request.session_id
        )

        # 首先生成标准聊天回答
        yield f"data: {json.dumps({'type': 'status', 'status': 'chat_response_started', 'message': '正在生成回答...'})}\n\n"
        await asyncio.sleep(0.1)

        # 创建一个空的意图分析对象用于生成标准回答
        empty_intent = IntentAnalysis(
            intent="",
            confidence=0.0,
            entities={}
        )

        # 生成标准聊天回答
        chat_response = None
        async for chunk in ai_response_agent.generate_response_stream(context, empty_intent):
            if isinstance(chunk, str):
                # 如果是状态消息，立即发送
                yield f"data: {json.dumps({'type': 'status', 'message': chunk})}\n\n"
                await asyncio.sleep(0.1)
            elif isinstance(chunk, dict):
                # 如果是回答结果，立即发送
                yield f"data: {json.dumps({'type': 'chat_response', 'data': chunk})}\n\n"
                await asyncio.sleep(0.1)
                chat_response = chunk

        if not chat_response:
            raise ValueError("标准回答生成失败")

        # 发送标准回答完成的消息
        yield f"data: {json.dumps({'type': 'status', 'status': 'chat_response_completed', 'message': '标准回答生成完成'})}\n\n"
        await asyncio.sleep(0.1)

        # 发送意图分析开始的消息
        yield f"data: {json.dumps({'type': 'status', 'status': 'intent_analysis_started', 'message': '正在进行意图分析...'})}\n\n"
        await asyncio.sleep(0.1)  # 减少等待时间

        # 进行意图分析，使用流式响应
        intent_analysis = None
        async for chunk in llm_agent.intent_agent.analyze_stream(context):
            if isinstance(chunk, str):
                # 如果是状态消息，立即发送
                yield f"data: {json.dumps({'type': 'status', 'message': chunk})}\n\n"
                await asyncio.sleep(0.1)  # 减少等待时间
            elif isinstance(chunk, dict):
                # 如果是中间结果，立即发送部分意图分析
                yield f"data: {json.dumps({'type': 'intent_analysis_progress', 'data': chunk})}\n\n"
                await asyncio.sleep(0.1)  # 减少等待时间
            elif isinstance(chunk, IntentAnalysis):
                # 如果是最终结果，立即发送完整意图分析
                yield f"data: {json.dumps({'type': 'intent_analysis', 'data': chunk.dict()})}\n\n"
                await asyncio.sleep(0.1)  # 减少等待时间
                intent_analysis = chunk

        if not intent_analysis:
            raise ValueError("意图分析失败")

        # 发送意图分析完成的消息
        yield f"data: {json.dumps({'type': 'status', 'status': 'intent_analysis_completed', 'message': '意图分析完成'})}\n\n"
        await asyncio.sleep(0.1)  # 减少等待时间

        # 发送提问分析开始的消息
        yield f"data: {json.dumps({'type': 'status', 'status': 'question_analysis_started', 'message': '正在进行提问分析...'})}\n\n"
        await asyncio.sleep(0.1)  # 减少等待时间

        # 进行提问分析，使用流式响应
        question_analysis = None
        async for chunk in training_advisor_agent.analyze_question_stream(context, intent_analysis):
            if isinstance(chunk, str):
                # 如果是状态消息，立即发送
                yield f"data: {json.dumps({'type': 'status', 'message': chunk})}\n\n"
                await asyncio.sleep(0.1)  # 减少等待时间
            elif isinstance(chunk, dict):
                # 如果是分析结果，立即发送
                yield f"data: {json.dumps({'type': 'question_analysis', 'data': chunk})}\n\n"
                await asyncio.sleep(0.1)  # 减少等待时间
                question_analysis = chunk

        if not question_analysis:
            raise ValueError("提问分析失败")

        # 发送提问分析完成的消息
        yield f"data: {json.dumps({'type': 'status', 'status': 'question_analysis_completed', 'message': '提问分析完成'})}\n\n"
        await asyncio.sleep(0.1)  # 减少等待时间

        # 发送AI回答生成开始的消息
        yield f"data: {json.dumps({'type': 'status', 'status': 'ai_response_started', 'message': '正在生成AI回答...'})}\n\n"
        await asyncio.sleep(0.1)  # 减少等待时间

        # 生成AI回答，使用流式响应
        ai_response = None
        async for chunk in ai_response_agent.generate_response_stream(context, intent_analysis):
            if isinstance(chunk, str):
                # 如果是状态消息，立即发送
                yield f"data: {json.dumps({'type': 'status', 'message': chunk})}\n\n"
                await asyncio.sleep(0.1)  # 减少等待时间
            elif isinstance(chunk, dict):
                # 如果是回答结果，立即发送
                yield f"data: {json.dumps({'type': 'ai_response', 'data': chunk})}\n\n"
                await asyncio.sleep(0.1)  # 减少等待时间
                ai_response = chunk

        if not ai_response:
            raise ValueError("AI回答生成失败")

        # 发送AI回答生成完成的消息
        yield f"data: {json.dumps({'type': 'status', 'status': 'ai_response_completed', 'message': 'AI回答生成完成'})}\n\n"
        await asyncio.sleep(0.1)  # 减少等待时间

        # 发送催收策略分析开始的消息
        yield f"data: {json.dumps({'type': 'status', 'status': 'collection_strategy_started', 'message': '正在进行催收策略分析...'})}\n\n"
        await asyncio.sleep(0.1)  # 减少等待时间

        # 进行催收策略分析，使用流式响应
        final_strategy = None
        async for chunk in collection_strategy_agent.analyze_strategy_stream(intent_analysis):
            if isinstance(chunk, str):
                # 如果是状态消息，立即发送
                yield f"data: {json.dumps({'type': 'status', 'message': chunk})}\n\n"
                await asyncio.sleep(0.1)  # 减少等待时间
            elif isinstance(chunk, dict):
                if any(key.startswith('partial_') for key in chunk.keys()):
                    # 如果是中间结果，立即发送部分策略分析
                    yield f"data: {json.dumps({'type': 'collection_strategy_progress', 'data': chunk})}\n\n"
                    await asyncio.sleep(0.1)  # 减少等待时间
                else:
                    # 如果是最终结果
                    final_strategy = chunk
                    yield f"data: {json.dumps({'type': 'collection_strategy', 'data': chunk})}\n\n"
                    await asyncio.sleep(0.1)  # 减少等待时间

        if not final_strategy:
            raise ValueError("催收策略分析失败")

        # 发送催收策略分析完成的消息
        yield f"data: {json.dumps({'type': 'status', 'status': 'collection_strategy_completed', 'message': '催收策略分析完成'})}\n\n"
        await asyncio.sleep(0.1)  # 减少等待时间

        # 发送最终完成消息
        yield f"data: {json.dumps({'type': 'status', 'status': 'completed', 'message': '分析流程完成'})}\n\n"
        await asyncio.sleep(0.1)  # 减少等待时间
        yield "event: complete\n\n"

    except Exception as e:
        yield f"data: {json.dumps({'type': 'error', 'message': f'分析过程中出错: {str(e)}'})}\n\n"
        await asyncio.sleep(0.1)  # 减少等待时间
        yield "event: complete\n\n"

@router.get("/analyze-intent")
@router.post("/analyze-intent")
async def analyze_intent(
    request: Request,
    message: str = Query(None),
    user_id: str = Query(None),
    session_id: str = Query(None),
    llm_agent: LLMAgent = Depends(get_llm_agent),
    collection_strategy_agent: CollectionStrategyAgent = Depends(get_collection_strategy_agent),
    training_advisor_agent: TrainingAdvisorAgent = Depends(get_training_advisor_agent),
    ai_response_agent: AIResponseAgent = Depends(get_ai_response_agent)
):
    """
    分析用户意图并生成催收策略的API接口（流式响应）
    """
    # 根据请求方法获取参数
    if request.method == "POST":
        body = await request.json()
        intent_request = IntentRequest(**body)
    else:
        if not message or not user_id or not session_id:
            return JSONResponse(
                status_code=400,
                content={"error": "Missing required parameters"}
            )
        intent_request = IntentRequest(
            message=message,
            messages=[],
            user_id=user_id,
            session_id=session_id
        )

    async def event_stream():
        async for chunk in stream_analysis(intent_request, llm_agent, collection_strategy_agent, training_advisor_agent, ai_response_agent):
            # 发送消息
            yield chunk
            # 强制刷新缓冲区
            await asyncio.sleep(0.1)

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache, no-transform",
            "Connection": "keep-alive",
            "Access-Control-Allow-Origin": "*",
            "X-Accel-Buffering": "no",  # 禁用 Nginx 缓冲
            "Content-Type": "text/event-stream",
            "Transfer-Encoding": "chunked",
            "Connection": "keep-alive",
            "X-Content-Type-Options": "nosniff",
            "X-Frame-Options": "DENY",
            "X-XSS-Protection": "1; mode=block",
            "Content-Security-Policy": "default-src 'self'",
            "Connection": "keep-alive",
            "Keep-Alive": "timeout=300",
        }
    ) 