# 构建阶段
FROM registry.cn-shanghai.aliyuncs.com/goblin-oversea/node:18-alpine AS builder

WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制源代码
COPY src ./src
COPY public ./public
COPY webpack.config.js ./
COPY tsconfig.json ./
COPY .babelrc ./

# 设置构建时的环境变量
ARG API_URL
ENV API_URL=${API_URL:-http://106.15.34.30:8060}

# 构建应用
RUN npm run build

# 生产阶段
FROM registry.cn-shanghai.aliyuncs.com/goblin-oversea/node:18-alpine

WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装所有依赖（包括开发依赖）
RUN npm install

# 从构建阶段复制构建产物
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

# 设置运行时环境变量
ENV API_URL=${API_URL:-http://106.15.34.30:8060}

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["npm", "start"] 