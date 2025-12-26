FROM node:22-alpine AS base
WORKDIR /app
FROM base AS build-stage
RUN apk add --no-cache libc6-compat python3 make g++
COPY package*.json ./
RUN npm ci --omit=optional
COPY . .
RUN npm run build
FROM build-stage AS pruner
RUN npm prune --omit=dev
FROM base AS runner
WORKDIR /app
RUN apk add --no-cache \
    bash \
    postgresql-client \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont
RUN ln -s /usr/bin/chromium-browser /tmp/chromium
COPY --from=pruner /app/node_modules ./node_modules
COPY --from=build-stage /app/dist ./dist
RUN sed -i "s#'src/migrations#'dist/migrations#g" /app/dist/src/core/database/data-source.js
RUN sed -i "s#'\\.ts'#'\\.js'#g" /app/dist/src/core/database/data-source.js
COPY package*.json ./
COPY package-lock.json ./
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh
RUN npm install --omit=dev sharp
RUN chown -R node:node /app
EXPOSE 3000
USER node
ENTRYPOINT [ "/usr/local/bin/entrypoint.sh" ]