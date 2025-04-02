# Build stage
FROM python:3.11-slim as builder

# Set apt mirror to Aliyun
RUN sed -i 's/deb.debian.org/mirrors.aliyun.com/g' /etc/apt/sources.list && \
    sed -i 's/security.debian.org/mirrors.aliyun.com/g' /etc/apt/sources.list

# Install system dependencies with retry
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    curl \
    gcc \
    python3-dev \
    && rm -rf /var/lib/apt/lists/* || \
    (apt-get update && \
    apt-get install -y --no-install-recommends \
    curl \
    gcc \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*)

# Set pip mirror to Tsinghua
RUN pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple/

# Install poetry in a more reliable way
RUN pip install poetry==1.7.1

# Set workdir
WORKDIR /app

# Copy poetry files (only pyproject.toml if poetry.lock doesn't exist)
COPY pyproject.toml ./
COPY poetry.lock* ./

# Configure poetry to not create virtual environment
RUN poetry config virtualenvs.create false

# Install dependencies
RUN poetry install --no-dev --no-interaction --no-ansi

# Install additional dependencies
RUN pip install uvicorn pydantic-settings

# Final stage
FROM python:3.11-slim

# Set apt mirror to Aliyun
RUN sed -i 's/deb.debian.org/mirrors.aliyun.com/g' /etc/apt/sources.list && \
    sed -i 's/security.debian.org/mirrors.aliyun.com/g' /etc/apt/sources.list

# Set pip mirror to Tsinghua
RUN pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple/

# Install poetry and additional dependencies
RUN pip install poetry==1.7.1 uvicorn pydantic-settings

# Set workdir
WORKDIR /app

# Copy installed packages from builder
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Command to run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"] 