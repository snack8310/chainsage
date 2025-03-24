# Chainsage

Chainsage 是一个基于 FastAPI 和 OpenAI 的智能对话系统，提供用户企业培训建议

## 项目结构

```
chainsage/
├── backend/           # 后端服务
│   ├── app/          # 应用主代码
│   ├── tests/        # 测试文件
│   └── README.md     # 后端文档
├── frontend/         # 前端应用
└── README.md         # 项目文档
```

## 快速开始

### 后端服务启动

1. 安装 Poetry（如果还没有安装）：
```bash
curl -sSL https://install.python-poetry.org | python3 -
```

2. 进入后端目录并安装依赖：
```bash
cd backend
poetry install
```

3. 配置环境变量：
- 复制 `.env.example` 到 `.env`
- 在 `.env` 文件中设置你的 OpenAI API key
- 如果需要，配置 Qdrant 服务器地址和认证信息

4. 启动服务：
```bash
poetry run uvicorn app.main:app --reload
```

服务启动后可以访问：
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### 开发指南

#### 代码格式化
```bash
cd backend
poetry run black .
poetry run isort .
```

#### 代码检查
```bash
cd backend
poetry run flake8
```

#### 运行测试
```bash
cd backend
poetry run pytest
```

## 主要功能

- 用户意图分析
- 基于 OpenAI 的智能对话
- RESTful API 接口
- 向量数据库支持

## API 示例

### 意图分析

POST /api/v1/analyze-intent

请求体：
```json
{
    "text": "用户输入的文本",
    "user_id": "用户ID",
    "session_id": "会话ID"
}
```

响应：
```json
{
    "intent": "意图",
    "confidence": 0.95,
    "entities": {
        "key": "value"
    }
}
``` 