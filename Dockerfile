FROM node:22-alpine AS frontend-build
WORKDIR /app/Frontend
COPY Frontend/package.json Frontend/package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY Frontend/ ./
RUN npm run build

FROM node:22-alpine AS app
ENV NODE_ENV=production
ENV PORT=3000
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts
COPY api/ ./api/
COPY server/ ./server/
COPY --from=frontend-build /app/Frontend/dist ./Frontend/dist
USER node
EXPOSE 3000
CMD ["node", "server/app.cjs"]
