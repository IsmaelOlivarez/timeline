# insta-mono

Monorepo for:
- `apps/mobile` — Expo React Native app
- `apps/web` — Next.js web app
- `services/api` — Java Spring Boot (WebFlux) backend
- `infra` — Docker Compose for Postgres, Redis, MinIO (local S3)

## Quick start
See /infra/docker-compose.yml, then run:
- `docker compose up -d` (from /infra)
- `./gradlew bootRun` (from /services/api)
- `npx expo start --ios` (from /apps/mobile)
- `npm run dev` (from /apps/web)
