import pytest
import os
from pathlib import Path
import PyPDF2
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
def test_pdf_file(setup_test_data, mock_pdf_content):
    """创建测试用的PDF文件"""
    pdf_path = setup_test_data / "test_course.pdf"
    
    # 创建PDF文件
    writer = PyPDF2.PdfWriter()
    page = PyPDF2.PageObject.create_blank_page(width=612, height=792)
    page.merge_page(PyPDF2.PageObject.create_text_page(mock_pdf_content))
    writer.add_page(page)
    
    with open(pdf_path, 'wb') as output_file:
        writer.write(output_file)
    
    return pdf_path

def test_calculate_relevance(agent):
    """测试相关度计算方法"""
    # 完全匹配
    assert agent._calculate_relevance("AI培训", "AI培训") == 1.0
    
    # 部分匹配
    assert agent._calculate_relevance("AI培训", "如何进行AI培训") > 0.5
    
    # 关键词匹配
    assert agent._calculate_relevance("AI 培训", "人工智能培训课程") > 0.05
    
    # 不相关
    assert agent._calculate_relevance("AI培训", "其他内容") < 0.1

def test_extract_text_from_pdf(agent, test_pdf_file):
    """测试PDF文本提取"""
    pages = agent._extract_text_from_pdf(str(test_pdf_file))
    assert isinstance(pages, list)
    assert len(pages) > 0
    
    # 验证提取的内容
    content = pages[0]["content"]
    assert "AI培训课程大纲" in content
    assert "第一章：人工智能基础" in content
    assert "第二章：机器学习入门" in content
    assert "第三章：深度学习" in content

def test_load_course_contents(agent, test_pdf_file):
    """测试课程内容加载"""
    loading_info = agent._load_course_contents()
    assert isinstance(loading_info, str)
    assert "PDF加载完成" in loading_info
    
    # 验证课程内容是否被正确加载
    assert hasattr(agent, 'course_contents')
    assert hasattr(agent, 'course_summaries')
    
    # 验证加载的课程
    assert "test_course" in agent.course_contents
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
    assert any("AI培训" in result["content"] for result in results)

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
            assert any("test_course" in log for log in data["logs"]) 