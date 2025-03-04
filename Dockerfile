# Этап сборки
FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . ./
RUN npm run build

# Этап выполнения (чистый контейнер)
FROM node:20 AS runtime

WORKDIR /app

# Копируем package.json и устанавливаем только прод-зависимости
COPY package*.json ./
COPY . ./
RUN npm install --omit=dev

# Копируем только билд
COPY --from=builder /app/dist ./src/server/build

EXPOSE 80
CMD ["npm", "start"]
