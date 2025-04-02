from fastapi import APIRouter, Depends, Request, Query, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.responses import StreamingResponse, JSONResponse
from app.agents.llm_agent import LLMAgent, UserContext, IntentAnalysis
from app.agents.training_advisor_agent import TrainingAdvisorAgent
from app.agents.ai_response_agent import AIResponseAgent
from app.agents.course_recommendation_agent import CourseRecommendationAgent
from app.core.config import get_settings
from app.core.auth import verify_password, create_access_token, verify_token, ACCESS_TOKEN_EXPIRE_MINUTES, get_password_hash
from app.models.user import User, Token
from pydantic import BaseModel
import json
import asyncio
import logging
from datetime import datetime, timedelta
from typing import Optional

# 配置日志
logger = logging.getLogger(__name__)

router = APIRouter()

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# 模拟用户数据库
fake_users_db = {
    "admin": {
        "username": "admin",
        "hashed_password": get_password_hash("admin"),  # 重新生成密码哈希
        "is_active": True,
    }
}

# 打印密码哈希值用于调试
print("Admin password hash:", fake_users_db["admin"]["hashed_password"])

def get_llm_agent():
    return LLMAgent()

def get_training_advisor_agent():
    return TrainingAdvisorAgent()

def get_ai_response_agent():
    return AIResponseAgent()

def get_course_recommendation_agent():
    return CourseRecommendationAgent()

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

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    token_data = verify_token(token)
    if token_data is None or token_data.username is None:
        raise credentials_exception
    user = fake_users_db.get(token_data.username)
    if user is None:
        raise credentials_exception
    return user

@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = fake_users_db.get(form_data.username)
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

async def stream_analysis(request: IntentRequest, llm_agent: LLMAgent, training_advisor_agent: TrainingAdvisorAgent, ai_response_agent: AIResponseAgent, course_recommendation_agent: CourseRecommendationAgent):
    """
    流式处理分析过程
    """
    try:
        logger.info(f"开始处理用户请求: {request.message}")
        logger.info(f"用户ID: {request.user_id}, 会话ID: {request.session_id}")

        # 发送开始分析的消息
        yield f"data: {json.dumps({'type': 'status', 'status': 'started', 'message': '开始分析流程'})}\n\n"
        await asyncio.sleep(0.1)

        context = UserContext(
            messages=[{"role": "user", "content": request.message}],
            user_id=request.user_id,
            session_id=request.session_id
        )

        # 发送意图分析开始的消息
        yield f"data: {json.dumps({'type': 'status', 'status': 'intent_analysis_started', 'message': '分析意图'})}\n\n"
        await asyncio.sleep(0.1)

        # 进行意图分析，使用流式响应
        intent_analysis = None
        async for chunk in llm_agent.intent_agent.analyze_stream(context):
            if isinstance(chunk, dict):
                yield f"data: {json.dumps({'type': 'intent_analysis_progress', 'data': chunk})}\n\n"
                await asyncio.sleep(0.1)
            elif isinstance(chunk, IntentAnalysis):
                yield f"data: {json.dumps({'type': 'intent_analysis', 'data': chunk.dict()})}\n\n"
                await asyncio.sleep(0.1)
                intent_analysis = chunk

        if not intent_analysis:
            logger.error("意图分析失败")
            raise ValueError("意图分析失败")

        logger.info(f"意图分析完成: {intent_analysis.intent} (置信度: {intent_analysis.confidence})")

        # 发送意图分析完成的消息
        yield f"data: {json.dumps({'type': 'status', 'status': 'intent_analysis_completed', 'message': '意图分析完成'})}\n\n"
        await asyncio.sleep(0.1)

        # 生成标准聊天回答
        yield f"data: {json.dumps({'type': 'status', 'status': 'chat_response_started', 'message': '生成标准回答'})}\n\n"
        await asyncio.sleep(0.1)

        # 生成标准聊天回答
        chat_response = None
        async for chunk in ai_response_agent.generate_response_stream(context, intent_analysis):
            if isinstance(chunk, dict):
                yield f"data: {json.dumps({'type': 'chat_response', 'data': chunk})}\n\n"
                await asyncio.sleep(0.1)
                chat_response = chunk

        if not chat_response:
            logger.error("标准回答生成失败")
            raise ValueError("标准回答生成失败")

        logger.info("标准回答生成完成")

        # 发送标准回答完成的消息
        yield f"data: {json.dumps({'type': 'status', 'status': 'chat_response_completed', 'message': '标准回答已生成'})}\n\n"
        await asyncio.sleep(0.1)

        # 检查是否是工作方法相关的咨询
        is_work_method = intent_analysis.entities.get('is_work_method', False)
        
        # 只有在工作方法相关的咨询时才进行提问分析
        if is_work_method:
            logger.info("开始提问分析")
            yield f"data: {json.dumps({'type': 'status', 'status': 'question_analysis_started', 'message': '分析提问方式'})}\n\n"
            await asyncio.sleep(0.1)

            # 进行提问分析，使用流式响应
            question_analysis = None
            async for chunk in training_advisor_agent.analyze_question_stream(context, intent_analysis):
                if isinstance(chunk, dict):
                    yield f"data: {json.dumps({'type': 'question_analysis', 'data': chunk})}\n\n"
                    await asyncio.sleep(0.1)
                    question_analysis = chunk

            if not question_analysis:
                logger.error("提问分析失败")
                raise ValueError("提问分析失败")

            logger.info("提问分析完成")
            yield f"data: {json.dumps({'type': 'status', 'status': 'question_analysis_completed', 'message': '提问分析完成'})}\n\n"
            await asyncio.sleep(0.1)
        else:
            logger.info("非工作方法咨询，跳过提问分析")
            yield f"data: {json.dumps({'type': 'status', 'status': 'question_analysis_skipped', 'message': '非工作方法咨询，跳过提问分析'})}\n\n"
            await asyncio.sleep(0.1)

        # 开始课程推荐分析
        logger.info("开始课程推荐分析")
        yield f"data: {json.dumps({'type': 'status', 'status': 'course_recommendation_started', 'message': '开始课程推荐分析'})}\n\n"
        await asyncio.sleep(0.1)

        # 进行课程推荐分析
        course_recommendations = None
        async for chunk in course_recommendation_agent.recommend_courses_stream(context, intent_analysis):
            if isinstance(chunk, dict):
                yield f"data: {json.dumps({'type': 'course_recommendation', 'data': chunk})}\n\n"
                await asyncio.sleep(0.1)
                course_recommendations = chunk

        if not course_recommendations:
            logger.error("课程推荐失败")
            raise ValueError("课程推荐失败")

        logger.info("课程推荐完成")
        yield f"data: {json.dumps({'type': 'status', 'status': 'course_recommendation_completed', 'message': '课程推荐完成'})}\n\n"
        await asyncio.sleep(0.1)

        # 发送最终完成消息
        logger.info("分析流程完成")
        yield f"data: {json.dumps({'type': 'status', 'status': 'completed', 'message': '分析完成'})}\n\n"
        await asyncio.sleep(0.1)
        yield "event: complete\n\n"

    except Exception as e:
        logger.error(f"分析过程中出错: {str(e)}", exc_info=True)
        yield f"data: {json.dumps({'type': 'error', 'message': f'分析过程中出错: {str(e)}'})}\n\n"
        await asyncio.sleep(0.1)
        yield "event: complete\n\n"

@router.get("/analyze-intent")
@router.post("/analyze-intent")
async def analyze_intent(
    request: Request,
    message: str = Query(None),
    user_id: str = Query(None),
    session_id: str = Query(None),
    llm_agent: LLMAgent = Depends(get_llm_agent),
    training_advisor_agent: TrainingAdvisorAgent = Depends(get_training_advisor_agent),
    ai_response_agent: AIResponseAgent = Depends(get_ai_response_agent),
    course_recommendation_agent: CourseRecommendationAgent = Depends(get_course_recommendation_agent)
):
    """
    分析用户意图并生成AI回答的API接口（流式响应）
    """
    # 根据请求方法获取参数
    if request.method == "POST":
        body = await request.json()
        intent_request = IntentRequest(**body)
    else:
        if not message or not user_id or not session_id:
            logger.error("缺少必要参数")
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

    return StreamingResponse(
        stream_analysis(intent_request, llm_agent, training_advisor_agent, ai_response_agent, course_recommendation_agent),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache, no-transform",
            "Connection": "keep-alive",
            "Access-Control-Allow-Origin": "*",
            "X-Accel-Buffering": "no",
            "Content-Type": "text/event-stream",
            "Transfer-Encoding": "chunked",
            "Connection": "keep-alive",
            "X-Content-Type-Options": "nosniff",
            "X-Frame-Options": "DENY",
            "X-XSS-Protection": "1; mode=block",
            "Content-Security-Policy": "default-src 'self'",
            "Keep-Alive": "timeout=300",
        }
    ) 