from typing import AsyncGenerator
from app.agents.models import UserContext, IntentAnalysis
from app.agents.intent_agent import IntentAnalysisAgent
from app.agents.chat_agent import ChatAgent

class LLMAgent:
    """为了保持向后兼容的包装类"""
    def __init__(self):
        self.intent_agent = IntentAnalysisAgent()
        self.chat_agent = ChatAgent()

    async def analyze_intent(self, context: UserContext) -> IntentAnalysis:
        return await self.intent_agent.analyze(context)

    async def get_response(self, message: str) -> str:
        return await self.chat_agent.get_response(message)

    async def get_stream_response(self, message: str) -> AsyncGenerator[str, None]:
        async for chunk in self.chat_agent.get_stream_response(message):
            yield chunk 