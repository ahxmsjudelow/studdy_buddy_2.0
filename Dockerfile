FROM node:22-slim
WORKDIR /app
COPY package.json bun.lock* package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build
ENV NODE_ENV=production PORT=8080 DATA_DIR=/data
EXPOSE 8080
CMD ["npm", "start"]
