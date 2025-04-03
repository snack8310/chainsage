FROM registry.cn-shanghai.aliyuncs.com/goblin-oversea/python-poetry:3.11

# Set working directory
WORKDIR /app

ADD ./* ./
RUN ls -rtl
# RUN poetry install --no-dev

# Expose port
EXPOSE 8000

# Run the application
CMD ["poetry", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
