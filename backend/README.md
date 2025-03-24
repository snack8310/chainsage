# Aurora API

这是一个基于FastAPI和OpenAI的智能对话系统后端API。

## 功能特点

- 用户意图分析
- 基于OpenAI的智能对话
- RESTful API接口
- 向量数据库支持

## 安装

1. 克隆项目
2. 安装 Poetry（如果还没有安装）：
```bash
curl -sSL https://install.python-poetry.org | python3 -
```

3. 安装项目依赖：
```bash
poetry install
```

4. 配置环境变量：
- 复制 `.env.example` 到 `.env`
- 在 `.env` 文件中设置你的 OpenAI API key
- 如果需要，配置 Qdrant 服务器地址和认证信息

## 运行

使用 Poetry 运行项目：
```bash
poetry run uvicorn app.main:app --reload
```

或者先进入 Poetry shell 再运行：
```bash
poetry shell
uvicorn app.main:app --reload
```

## 开发

### 代码格式化
```bash
poetry run black .
poetry run isort .
```

### 代码检查
```bash
poetry run flake8
```

### 运行测试
```bash
poetry run pytest
```

## API 文档

启动服务后访问：
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 主要接口

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
