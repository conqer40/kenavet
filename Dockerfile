FROM node:20-alpine AS base

# Install dependencies only when needed
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Copy source code and build
COPY . .
ENV NODE_ENV=production
ENV ALLOW_LOCAL_DB=true
ENV PORT=3000

RUN npm run build

EXPOSE 3000

CMD ["sh", "-c", "npm run db:migrate && npm run db:seed && npm start"]
