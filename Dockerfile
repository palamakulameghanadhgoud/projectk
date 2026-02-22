# Optional: production Docker image for DAA platform
FROM node:20-alpine AS base

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN npx prisma generate

FROM base AS build
RUN npm ci
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
EXPOSE 3000
CMD ["npm", "start"]
