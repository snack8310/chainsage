FROM registry.cn-shanghai.aliyuncs.com/goblin-oversea/python-poetry:3.11

# Set working directory
WORKDIR /app

# Set environment variables for Poetry
ENV POETRY_REPOSITORIES_ALIYUN_URL=https://mirrors.aliyun.com/pypi/simple/

# Copy project files
COPY pyproject.toml ./
COPY . .

# Install dependencies
RUN poetry install --only main

# Expose port
EXPOSE 8060

# Run the application
CMD ["poetry", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8060"]
