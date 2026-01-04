# EthAum.ai - Technical Architecture Document

**Version:** 1.0  
**Date:** January 4, 2026  
**Status:** Draft  

---

## 1. System Overview

### 1.1 Architecture Philosophy
EthAum.ai is designed as a modern, cloud-native web application following microservices-ready architecture principles. The MVP will start as a modular monolith for faster development, with clear boundaries that allow future service extraction.

### 1.2 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   Web App    │  │  Mobile Web  │  │   Widgets    │  │  Admin Panel │    │
│  │   (Next.js)  │  │ (Responsive) │  │  (Embeds)    │  │  (Next.js)   │    │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              API GATEWAY                                     │
│                         (Next.js API Routes / Edge)                          │
├─────────────────────────────────────────────────────────────────────────────┤
│  Authentication │ Rate Limiting │ Request Routing │ Response Caching        │
└─────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           APPLICATION LAYER                                  │
├────────────────┬────────────────┬────────────────┬─────────────────────────┤
│   Launches     │    Reviews     │    Insights    │    Deals & Matching     │
│    Module      │     Module     │     Module     │        Module           │
├────────────────┴────────────────┴────────────────┴─────────────────────────┤
│                           SHARED SERVICES                                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │   Auth   │  │  Search  │  │  Notify  │  │  Media   │  │  AI/ML   │     │
│  │ Service  │  │  Engine  │  │ Service  │  │ Storage  │  │ Service  │     │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘     │
└─────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            DATA LAYER                                        │
├────────────────┬────────────────┬────────────────┬─────────────────────────┤
│   PostgreSQL   │     Redis      │   Blob Store   │   Vector DB (Future)    │
│  (Primary DB)  │   (Caching)    │ (Media Files)  │   (AI Embeddings)       │
└────────────────┴────────────────┴────────────────┴─────────────────────────┘
```

---

## 2. Technology Stack

### 2.1 Frontend Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Framework | Next.js 14+ | SSR, API routes, excellent DX |
| Language | TypeScript | Type safety, better maintainability |
| Styling | Tailwind CSS | Rapid prototyping, consistent design |
| Components | shadcn/ui | Beautiful, accessible components |
| State | Zustand + React Query | Simple state + server state management |
| Forms | React Hook Form + Zod | Performant forms with validation |
| Charts | Recharts | Data visualization |
| Animations | Framer Motion | Smooth UI animations |

### 2.2 Backend Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Runtime | Node.js 20+ | JavaScript ecosystem, async I/O |
| Framework | Next.js API Routes | Unified codebase, easy deployment |
| ORM | Prisma | Type-safe database access |
| Validation | Zod | Runtime type validation |
| Auth | NextAuth.js | Built-in OAuth, sessions |
| Queue | BullMQ (Redis) | Background job processing |
| Real-time | Socket.io / Pusher | Live notifications |

### 2.3 Infrastructure & DevOps

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Hosting | Vercel | Native Next.js support, edge network |
| Database | Supabase / Neon | Managed PostgreSQL, generous free tier |
| Cache | Upstash Redis | Serverless Redis |
| Storage | Cloudflare R2 / AWS S3 | Media file storage |
| CDN | Cloudflare | Global content delivery |
| Monitoring | Sentry | Error tracking |
| Analytics | PostHog | Product analytics |
| CI/CD | GitHub Actions | Automated deployments |

### 2.4 AI/ML Services

| Service | Provider | Use Case |
|---------|----------|----------|
| LLM | OpenAI GPT-4 / Gemini | Content generation, analysis |
| Embeddings | OpenAI / Cohere | Semantic search, matching |
| Verification | Custom + GPT | Review authenticity |
| Vision | GPT-4 Vision | Asset quality assessment |

---

## 3. Database Schema

### 3.1 Entity Relationship Diagram

```
┌──────────────────┐          ┌──────────────────┐
│      User        │          │     Company      │
├──────────────────┤          ├──────────────────┤
│ id               │──────────│ id               │
│ email            │     1:N  │ name             │
│ name             │          │ slug             │
│ avatar_url       │          │ logo_url         │
│ linkedin_id      │          │ revenue_stage    │
│ role (enum)      │          │ arr_range        │
│ created_at       │          │ description      │
│ updated_at       │          │ website          │
└──────────────────┘          │ category_id      │
         │                    │ founded_at       │
         │                    │ team_size        │
         │ 1:N                │ verified         │
         ▼                    │ created_at       │
┌──────────────────┐          └──────────────────┘
│   UserCompany    │                   │
├──────────────────┤                   │
│ user_id          │                   │ 1:N
│ company_id       │                   ▼
│ role (enum)      │          ┌──────────────────┐
│ created_at       │          │     Product      │
└──────────────────┘          ├──────────────────┤
                              │ id               │
                              │ company_id       │
                              │ name             │
                              │ slug             │
                              │ tagline          │
                              │ description      │
                              │ logo_url         │
                              │ media (json)     │
                              │ created_at       │
                              └──────────────────┘
                                       │
              ┌────────────────────────┼────────────────────────┐
              │ 1:N                    │ 1:N                    │ 1:N
              ▼                        ▼                        ▼
┌──────────────────┐          ┌──────────────────┐    ┌──────────────────┐
│     Launch       │          │     Review       │    │     Pilot        │
├──────────────────┤          ├──────────────────┤    ├──────────────────┤
│ id               │          │ id               │    │ id               │
│ product_id       │          │ product_id       │    │ product_id       │
│ title            │          │ author_id        │    │ title            │
│ description      │          │ rating           │    │ description      │
│ tagline          │          │ content          │    │ pilot_type       │
│ scheduled_at     │          │ pros             │    │ original_price   │
│ launched_at      │          │ cons             │    │ pilot_price      │
│ status (enum)    │          │ verified         │    │ duration_days    │
│ upvote_count     │          │ video_url        │    │ spots_available  │
│ comment_count    │          │ created_at       │    │ status           │
│ featured         │          └──────────────────┘    │ created_at       │
│ created_at       │                                  └──────────────────┘
└──────────────────┘
         │
         │ 1:N
         ▼
┌──────────────────┐
│     Upvote       │
├──────────────────┤
│ id               │
│ launch_id        │
│ user_id          │
│ created_at       │
└──────────────────┘

┌──────────────────┐          ┌──────────────────┐
│    Category      │          │  CredibilityScore│
├──────────────────┤          ├──────────────────┤
│ id               │          │ id               │
│ name             │          │ company_id       │
│ slug             │          │ overall_score    │
│ description      │          │ review_score     │
│ icon             │          │ launch_score     │
│ parent_id        │          │ engagement_score │
│ created_at       │          │ verification_score│
└──────────────────┘          │ calculated_at    │
                              └──────────────────┘
```

### 3.2 Key Tables Description

| Table | Purpose | Relationships |
|-------|---------|---------------|
| `users` | User accounts and profiles | Has many companies (via UserCompany) |
| `companies` | Startup organizations | Has many products, users, belongs to category |
| `products` | Individual products/tools | Has many launches, reviews, pilots |
| `launches` | Product Hunt-style launches | Has many upvotes, comments |
| `reviews` | G2-style testimonials | Belongs to product and author |
| `pilots` | AppSumo-style deals | Belongs to product |
| `categories` | Hierarchical categories | Self-referencing for nesting |
| `credibility_scores` | AI-computed scores | Belongs to company |

---

## 4. API Design

### 4.1 API Architecture
- **REST-first** approach for CRUD operations
- **GraphQL consideration** for complex queries (future)
- **Versioned endpoints** (`/api/v1/...`)

### 4.2 Core Endpoints

#### Authentication
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/oauth/{provider}
GET    /api/v1/auth/me
```

#### Companies & Products
```
GET    /api/v1/companies
POST   /api/v1/companies
GET    /api/v1/companies/{slug}
PUT    /api/v1/companies/{slug}
GET    /api/v1/companies/{slug}/products
POST   /api/v1/companies/{slug}/products
GET    /api/v1/products/{slug}
PUT    /api/v1/products/{slug}
```

#### Launches
```
GET    /api/v1/launches
GET    /api/v1/launches/today
GET    /api/v1/launches/featured
POST   /api/v1/launches
GET    /api/v1/launches/{id}
POST   /api/v1/launches/{id}/upvote
DELETE /api/v1/launches/{id}/upvote
GET    /api/v1/launches/{id}/comments
POST   /api/v1/launches/{id}/comments
```

#### Reviews
```
GET    /api/v1/products/{slug}/reviews
POST   /api/v1/products/{slug}/reviews
GET    /api/v1/reviews/{id}
PUT    /api/v1/reviews/{id}
GET    /api/v1/reviews/recent
```

#### Pilots
```
GET    /api/v1/pilots
GET    /api/v1/pilots/featured
POST   /api/v1/products/{slug}/pilots
GET    /api/v1/pilots/{id}
POST   /api/v1/pilots/{id}/inquire
```

#### Insights & Scores
```
GET    /api/v1/insights/trending
GET    /api/v1/insights/categories/{slug}
GET    /api/v1/companies/{slug}/credibility
GET    /api/v1/companies/{slug}/badge
```

### 4.3 Response Format
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  },
  "errors": null
}
```

---

## 5. Integration Points

### 5.1 Authentication Integrations

| Provider | Purpose | Priority |
|----------|---------|----------|
| Google OAuth | General sign-in | P0 |
| LinkedIn OAuth | Professional identity verification | P0 |
| Email/Password | Fallback authentication | P0 |

### 5.2 Third-Party Services

| Service | Integration Type | Use Case |
|---------|------------------|----------|
| Stripe | Payment processing | Pilot purchases, subscriptions |
| SendGrid / Resend | Transactional email | Notifications, alerts |
| Uploadcare / Cloudinary | Media processing | Image/video handling |
| OpenAI API | LLM integration | Content generation, verification |
| Slack | Webhooks | Team notifications |

### 5.3 Embed & Widget Integration

```javascript
// Embeddable Badge Widget
<script src="https://ethaum.ai/widget.js"></script>
<div data-ethaum-badge="company-slug" data-theme="light"></div>

// Embeddable Reviews Widget
<div data-ethaum-reviews="product-slug" data-limit="3"></div>
```

---

## 6. Security Architecture

### 6.1 Authentication & Authorization
- JWT-based session tokens (httpOnly cookies)
- OAuth 2.0 for third-party auth
- Role-based access control (RBAC)
- API key authentication for widgets

### 6.2 Data Security
- All data encrypted at rest (AES-256)
- TLS 1.3 for data in transit
- PII data handling compliance
- Rate limiting per IP/user

### 6.3 Security Headers
```
Content-Security-Policy: default-src 'self'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

---

## 7. Scalability Considerations

### 7.1 Immediate (MVP)
- Vercel serverless functions (auto-scaling)
- Edge caching for static content
- Database connection pooling

### 7.2 Growth Phase
- Redis caching layer for hot data
- Background job processing (BullMQ)
- CDN for all static assets

### 7.3 Scale Phase (Future)
- Read replicas for database
- Microservices extraction
- Event-driven architecture (Kafka/RabbitMQ)
- Multi-region deployment

---

## 8. Monitoring & Observability

### 8.1 Logging
- Structured JSON logging
- Log aggregation (Vercel Logs / Axiom)
- Error tracking (Sentry)

### 8.2 Metrics
- Application Performance Monitoring (APM)
- Database query performance
- API response times

### 8.3 Alerting
- Uptime monitoring
- Error rate thresholds
- Performance degradation alerts

---

## 9. Development Workflow

### 9.1 Git Workflow
```
main (production)
  └── develop (staging)
       └── feature/xxx (development)
```

### 9.2 Environment Strategy
| Environment | Purpose | URL |
|-------------|---------|-----|
| Development | Local development | localhost:3000 |
| Preview | PR previews | pr-xxx.vercel.app |
| Staging | Pre-production testing | staging.ethaum.ai |
| Production | Live environment | ethaum.ai |

### 9.3 CI/CD Pipeline
1. Lint + Type check
2. Unit tests
3. Build verification
4. Preview deployment
5. E2E tests (on staging)
6. Production deployment

---

## 10. MVP Implementation Phases

### Phase 1: Foundation (Week 1-2)
- Project setup (Next.js, Prisma, Auth)
- Database schema implementation
- Basic UI component library
- Authentication flow

### Phase 2: Core Features (Week 3-4)
- Company/Product CRUD
- Launch creation and listing
- Upvote system
- Basic dashboard

### Phase 3: Enhanced Features (Week 5-6)
- Review collection system
- Pilot listings
- Category browsing
- Search functionality

### Phase 4: Polish & Deploy (Week 7-8)
- Credibility scoring
- Embeddable widgets
- Admin panel basics
- Performance optimization
- Production deployment
