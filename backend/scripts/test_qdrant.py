import sys
import os

# 添加项目根目录到 Python 路径
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.vector_store.test_qdrant import test_qdrant_operations

if __name__ == "__main__":
    success = test_qdrant_operations()
    sys.exit(0 if success else 1) 