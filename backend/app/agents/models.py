from typing import List, Dict, Any
from pydantic import BaseModel

class UserContext(BaseModel):
    """用户上下文"""
    messages: List[Dict[str, str]]
    user_id: str
    session_id: str

class IntentAnalysis(BaseModel):
    """意图分析结果"""
    intent: str
    confidence: float
    entities: Dict[str, Any] 