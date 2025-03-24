import pytest
import os
import sys

# 添加项目根目录到 Python 路径
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# 配置 pytest-asyncio
pytest_plugins = ('pytest_asyncio',)

@pytest.fixture(autouse=True)
def setup_test_env():
    """Setup test environment."""
    # 这里可以添加测试环境的设置，比如设置测试数据库等
    yield
    # 清理测试环境
    pass 