# PriceLens Nigeria

> 🔍 Smart Retail Price Intelligence Platform for Nigeria

Compare grocery prices across markets and supermarkets in **Lagos**, **Abuja**, **Enugu**, **Rivers**, **Kano** & **Kaduna**. AI-powered basket optimisation to save you money on every shop.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Web Frontend** | Next.js 14 (App Router) + TypeScript |
| **REST API** | NestJS + TypeScript |
| **AI Service** | FastAPI (Python) |
| **Database** | PostgreSQL + Prisma ORM |
| **Cache** | Redis |
| **File Storage** | AWS S3 |
| **Payments** | Paystack |
| **Deployment** | AWS |

## Project Structure

```
pricelens/
├── apps/
│   ├── web/          # Next.js frontend (port 3000)
│   ├── api/          # NestJS REST API (port 3001)
│   └── ai/           # FastAPI AI service (port 8000)
├── packages/
│   └── database/     # Prisma schema & migrations
├── infrastructure/
│   └── docker/       # Docker configs
├── docker-compose.yml
├── package.json
└── turbo.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- Docker Desktop (for PostgreSQL & Redis)
- Python 3.11+ (for AI service)

### Setup

```bash
# 1. Clone the repo
git clone <repo-url>
cd pricelens

# 2. Install dependencies
npm install

# 3. Start database services
npm run docker:up

# 4. Copy environment variables
cp .env.example .env

# 5. Run database migrations
npm run db:migrate

# 6. Seed the database
npm run db:seed

# 7. Start development servers
npm run dev
```

### Access

- **Web App**: http://localhost:3000
- **API**: http://localhost:3001
- **API Docs**: http://localhost:3001/api/docs
- **AI Service**: http://localhost:8000/ai/docs
- **Prisma Studio**: `npm run db:studio`

## Coverage

6 Nigerian States | 60 Cities | 117+ Stores | 500+ Products

## License

Proprietary — All rights reserved.
