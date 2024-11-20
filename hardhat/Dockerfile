# 使用官方的 Node.js 镜像作为基础镜像
FROM node:20

# 设置工作目录为容器中的 /app
WORKDIR /app

# 复制当前目录中的 package.json 和 yarn.lock 到容器内的 /app 目录
COPY package.json yarn.lock ./

# 安装依赖
RUN yarn install

# 复制 hardhat 目录下的所有内容到容器内的 /app 目录
COPY . .

# 设置容器启动时执行的命令
CMD ["yarn", "hardhat", "run", "scripts/deploy.ts", "--network", "sepolia"]
