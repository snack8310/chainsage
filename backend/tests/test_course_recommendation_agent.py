import pytest
import os
from pathlib import Path
import PyPDF2
from PyPDF2.generic import StreamObject
from app.agents.course_recommendation_agent import CourseRecommendationAgent
from app.agents.models import UserContext, IntentAnalysis

@pytest.fixture
def agent():
    return CourseRecommendationAgent()

@pytest.fixture
def sample_context():
    return UserContext(
        messages=[{"role": "user", "content": "如何进行AI培训"}],
        user_id="test_user",
        session_id="test_session"
    )

@pytest.fixture
def sample_intent():
    return IntentAnalysis(
        intent="AI培训咨询",
        confidence=0.95,
        entities={
            "topic": "AI培训",
            "level": "",
            "format": "",
            "target_audience": "",
            "key_points": [],
            "practical_examples": [],
            "expected_outcome": "了解AI培训方法",
            "urgency": "",
            "is_work_method": True
        }
    )

@pytest.fixture
def test_pdf_file():
    """使用真实的课程PDF文件"""
    pdf_dir = Path(__file__).parent.parent / "app" / "data" / "courses"
    pdf_files = list(pdf_dir.glob("*.pdf"))
    if not pdf_files:
        pytest.skip("No PDF files found in app/data/courses directory")
    return pdf_files[0]

@pytest.mark.asyncio
async def test_calculate_relevance(agent):
    """测试相关度计算方法"""
    # 完全匹配
    assert await agent._calculate_relevance("AI培训", "AI培训") == 1.0
    
    # 部分匹配
    assert await agent._calculate_relevance("AI培训", "如何进行AI培训") > 0.5
    
    # 关键词匹配
    assert await agent._calculate_relevance("AI 培训", "人工智能培训课程") > 0.05
    
    # 不相关
    assert await agent._calculate_relevance("AI培训", "其他内容") < 0.1

@pytest.mark.asyncio
async def test_ai_training_relevance(agent, test_pdf_file):
    """测试AI培训查询与PDF内容的相关度"""
    # 加载课程内容
    agent._load_course_contents()
    
    # 测试查询
    query = "如何进行AI培训"
    
    # 获取PDF内容
    pages = agent._extract_text_from_pdf(str(test_pdf_file))
    assert len(pages) > 0
    
    # 计算相关度
    relevance_scores = []
    for page in pages:
        relevance = await agent._calculate_relevance(query, page["content"])
        relevance_scores.append(relevance)
    
    # 验证相关度分数
    assert len(relevance_scores) > 0
    assert max(relevance_scores) > 0  # 至少应该有一些相关性
    assert any(score > 0.5 for score in relevance_scores)  # 应该有一些高相关度的内容
    
    # 打印相关度分数，帮助调试
    print(f"\nAI培训查询相关度分数:")
    for i, score in enumerate(relevance_scores):
        print(f"页面 {i+1}: {score:.2f}")

def test_extract_text_from_pdf(agent, test_pdf_file):
    """测试PDF文本提取"""
    pages = agent._extract_text_from_pdf(str(test_pdf_file))
    assert isinstance(pages, list)
    assert len(pages) > 0
    
    # 验证提取的内容
    content = pages[0]["content"]
    assert len(content) > 0  # 确保有内容被提取
    assert isinstance(content, str)  # 确保内容是字符串

def test_load_course_contents(agent, test_pdf_file):
    """测试课程内容加载"""
    loading_info = agent._load_course_contents()
    assert isinstance(loading_info, str)
    assert "PDF加载完成" in loading_info
    
    # 验证课程内容是否被正确加载
    assert hasattr(agent, 'course_contents')
    assert hasattr(agent, 'course_summaries')
    
    # 验证加载的课程
    assert len(agent.course_contents) > 0
    assert len(agent.course_summaries) > 0

@pytest.mark.asyncio
async def test_search_relevant_content(agent, test_pdf_file):
    """测试相关内容搜索"""
    # 确保课程内容已加载
    agent._load_course_contents()
    
    results = []
    async for result in agent._search_relevant_content("AI培训"):
        if result["type"] == "results":
            results = result["data"]
    
    # 验证结果格式
    assert len(results) > 0
    assert "title" in results[0]
    assert "relevance_score" in results[0]
    assert "content" in results[0]
    assert "source" in results[0]
    assert "page" in results[0]
    
    # 验证内容相关性
    assert any("AI" in result["content"] or "培训" in result["content"] for result in results)

@pytest.mark.asyncio
async def test_recommend_courses_stream(agent, sample_context, sample_intent, test_pdf_file):
    """测试课程推荐流程"""
    async for result in agent.recommend_courses_stream(sample_context, sample_intent):
        if result["type"] == "course_recommendation":
            data = result["data"]
            assert "recommendations" in data
            assert "metadata" in data
            assert "logs" in data
            
            # 验证推荐结果
            assert len(data["recommendations"]) > 0
            recommendation = data["recommendations"][0]
            assert "title" in recommendation
            assert "relevance_score" in recommendation
            assert "summary" in recommendation
            assert "source" in recommendation
            assert "page" in recommendation
            
            # 验证元数据
            assert "total_courses" in data["metadata"]
            assert "query_context" in data["metadata"]
            
            # 验证日志
            assert any("课程推荐开始" in log for log in data["logs"])
            assert any("课程推荐完成" in log for log in data["logs"])
            # 验证课程名出现在日志中
            course_name = test_pdf_file.stem
            assert any(course_name in log for log in data["logs"]) 