import pytest
import os
import sys
from pathlib import Path

# 添加项目根目录到 Python 路径
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

# 配置 pytest-asyncio
pytest_plugins = ('pytest_asyncio',)

@pytest.fixture(autouse=True)
def setup_test_env():
    """Setup test environment."""
    # 这里可以添加测试环境的设置，比如设置测试数据库等
    yield
    # 清理测试环境
    pass

@pytest.fixture(autouse=True)
def setup_test_data():
    """设置测试数据目录"""
    test_data_dir = project_root / "app" / "data" / "courses"
    test_data_dir.mkdir(parents=True, exist_ok=True)
    yield test_data_dir
    # 清理测试数据
    for file in test_data_dir.glob("*.pdf"):
        file.unlink()

@pytest.fixture
def mock_pdf_content():
    """创建测试用的PDF内容"""
    return """
    AI培训课程大纲
    
    第一章：人工智能基础
    1.1 什么是人工智能
    1.2 AI的发展历史
    1.3 AI的应用领域
    
    第二章：机器学习入门
    2.1 机器学习基础概念
    2.2 常见机器学习算法
    2.3 实践案例
    
    第三章：深度学习
    3.1 神经网络基础
    3.2 深度学习框架
    3.3 实战项目
    """ 