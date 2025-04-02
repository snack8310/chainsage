# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./



# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["node", "server.js"] 