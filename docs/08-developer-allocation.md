# EthAum.ai - Developer Feature Allocation

**Version:** 1.0  
**Date:** January 4, 2026  
**Team:** Vinod, Venu, Sandeep, Rani  

---

## Team Allocation Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ETHAUM.AI DEVELOPMENT TEAM                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   VINOD                VENU                SANDEEP              RANI         │
│   ──────              ──────              ────────             ──────        │
│   Auth &              Launches &          Reviews &            Insights &    │
│   Core Setup          Marketplace         Testimonials         Deals         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔐 VINOD - Authentication & Core Infrastructure

**Focus Area:** Foundation, Auth, User Management, Core Setup

### Frontend Tasks
| Task | Priority | Description |
|------|----------|-------------|
| Project Setup | P0 | Initialize Next.js 14+, TypeScript, Tailwind CSS, shadcn/ui |
| Design System | P0 | Implement color palette, typography, spacing from wireframes |
| Layout Components | P0 | Header, Footer, Navigation, Sidebar components |
| Auth Pages | P0 | Login, Register, Forgot Password pages |
| OAuth Buttons | P0 | Google and LinkedIn OAuth button components |
| User Profile Page | P0 | View/Edit profile, avatar upload |
| Protected Routes | P0 | Route guards for authenticated pages |
| Onboarding Flow | P1 | New user onboarding wizard (Founder/Buyer selection) |

### Backend Tasks
| Task | Priority | Description |
|------|----------|-------------|
| Database Setup | P0 | Configure Prisma + PostgreSQL (Supabase/Neon) |
| User Schema | P0 | User, Account, Session models |
| NextAuth Setup | P0 | Configure NextAuth.js with providers |
| Google OAuth | P0 | Implement Google OAuth provider |
| LinkedIn OAuth | P0 | Implement LinkedIn OAuth provider |
| Email/Password Auth | P0 | Email verification, password reset |
| User API Routes | P0 | GET/PUT /api/auth/me, profile endpoints |
| Session Management | P0 | JWT tokens, session handling |
| Role-Based Access | P1 | RBAC middleware (USER, STARTUP_ADMIN, etc.) |

### Database Models Owned
- `User`
- `Account`
- `Session`
- `VerificationToken`

---

## 🚀 VENU - Launches & Marketplace

**Focus Area:** Product Hunt-Inspired Launch System, Products, Companies

### Frontend Tasks
| Task | Priority | Description |
|------|----------|-------------|
| Homepage | P0 | Hero section, Today's Launches, Trending Categories |
| Launch Feed | P0 | Launch card list with infinite scroll |
| Launch Card Component | P0 | Upvote button, comment count, product info |
| Launch Detail Page | P0 | Full launch view with media gallery |
| Launch Creation Wizard | P0 | Multi-step form (Basic → Media → Schedule → Review) |
| Upvote System | P0 | Real-time upvote toggle with animation |
| Comment System | P0 | Threaded comments with replies |
| Company Profile Page | P0 | Company info, products list, team |
| Product Listing Page | P0 | Product cards grid with filters |
| Search & Filters | P0 | Category filters, search bar, sorting |
| Category Pages | P1 | Category browse with subcategories |

### Backend Tasks
| Task | Priority | Description |
|------|----------|-------------|
| Company Schema | P0 | Company, UserCompany models |
| Product Schema | P0 | Product, ProductTag, Tag models |
| Launch Schema | P0 | Launch, Upvote, Comment models |
| Category Schema | P0 | Category model (hierarchical) |
| Company API | P0 | CRUD /api/companies endpoints |
| Product API | P0 | CRUD /api/products endpoints |
| Launch API | P0 | CRUD /api/launches endpoints |
| Upvote API | P0 | POST/DELETE /api/launches/:id/upvote |
| Comment API | P0 | CRUD /api/launches/:id/comments |
| Today's Launches | P0 | GET /api/launches/today endpoint |
| Search API | P1 | Full-text search across products/companies |

### Database Models Owned
- `Company`
- `UserCompany`
- `Product`
- `ProductTag`
- `Tag`
- `Launch`
- `Upvote`
- `Comment`
- `Category`

---

## ⭐ SANDEEP - Reviews & Testimonials

**Focus Area:** G2-Inspired Review System, Credibility, Verification

### Frontend Tasks
| Task | Priority | Description |
|------|----------|-------------|
| Review List Component | P0 | Reviews with ratings, verified badges |
| Review Card Component | P0 | Author info, pros/cons, rating stars |
| Review Submission Form | P0 | Rating, text review, pros/cons inputs |
| Video Upload Component | P1 | Video testimonial upload/recording |
| Product Reviews Tab | P0 | Reviews section on product page |
| Review Star Rating | P0 | Interactive 5-star rating component |
| Credibility Score Display | P0 | Score badge with breakdown tooltip |
| Embeddable Badge Widget | P0 | Credibility badge for external sites |
| Embeddable Reviews Widget | P1 | Review carousel widget |
| LinkedIn Verification UI | P0 | Verify identity button and flow |
| Verification Badges | P0 | Verified reviewer badge component |

### Backend Tasks
| Task | Priority | Description |
|------|----------|-------------|
| Review Schema | P0 | Review model with all fields |
| Review API | P0 | CRUD /api/products/:slug/reviews |
| Review Verification | P0 | AI verification logic (basic) |
| LinkedIn Verify | P0 | LinkedIn identity verification flow |
| Credibility Score Schema | P0 | CredibilityScore model |
| Score Calculator | P0 | Algorithm to compute credibility scores |
| Credibility API | P0 | GET /api/companies/:slug/credibility |
| Widget API | P0 | GET /api/widget/badge/:slug |
| Widget Embed Code | P0 | Generate embeddable HTML/JS |
| Review Statistics | P1 | Average rating, distribution calculation |

### Database Models Owned
- `Review`
- `CredibilityScore`

---

## 📊 RANI - Insights & Deals (Pilots)

**Focus Area:** AppSumo-Inspired Pilots, Matchmaking, Insights Dashboard

### Frontend Tasks
| Task | Priority | Description |
|------|----------|-------------|
| Pilot Listing Page | P0 | Browse all active pilots with filters |
| Pilot Card Component | P0 | Pricing, spots left, CTA button |
| Pilot Detail Page | P0 | Full pilot info, requirements, deliverables |
| Pilot Creation Form | P0 | Create pilot offering (for startups) |
| Pilot Inquiry Form | P0 | Request access to pilot |
| Pilot Management Dashboard | P0 | Manage inquiries, status updates |
| Startup Dashboard | P0 | Overview, stats, quick actions |
| Analytics Charts | P1 | Upvotes over time, engagement charts |
| Trending Section | P0 | Trending startups, categories on homepage |
| Notification Center | P1 | Bell icon with notification dropdown |
| Activity Feed | P1 | Recent activity on dashboard |

### Backend Tasks
| Task | Priority | Description |
|------|----------|-------------|
| Pilot Schema | P0 | Pilot, PilotInquiry models |
| Pilot API | P0 | CRUD /api/pilots endpoints |
| Pilot Inquiry API | P0 | POST /api/pilots/:id/inquire |
| Inquiry Management | P0 | Accept/Reject inquiry endpoints |
| Notification Schema | P0 | Notification model |
| Notification API | P0 | GET /api/notifications endpoints |
| Trending API | P0 | GET /api/insights/trending |
| Dashboard Stats API | P0 | Aggregated stats for startup dashboard |
| Email Notifications | P1 | Send email on pilot inquiry, review, etc. |
| Basic Matchmaking | P2 | Simple category-based recommendations |

### Database Models Owned
- `Pilot`
- `PilotInquiry`
- `Notification`

---

## Shared Responsibilities

### All Team Members
- Write unit tests for their features
- Document API endpoints they create
- Review PRs from other team members
- Follow the design system and coding standards

### Integration Points

| Integration | Owner 1 | Owner 2 | Description |
|-------------|---------|---------|-------------|
| Auth → Company | Vinod | Venu | User creates company on signup |
| Launch → Reviews | Venu | Sandeep | Show review count on launch page |
| Reviews → Credibility | Sandeep | Sandeep | Score updates on new review |
| Pilots → Notifications | Rani | Rani | Notify on pilot inquiry |
| Dashboard → All | Rani | All | Dashboard pulls data from all modules |

---

## Sprint Breakdown

### Sprint 1 (Week 1-2): Foundation
| Developer | Tasks |
|-----------|-------|
| **Vinod** | Project setup, Auth system, User schema |
| **Venu** | Company/Product schemas, basic CRUD APIs |
| **Sandeep** | Review schema, basic review form |
| **Rani** | Pilot schema, notification model |

### Sprint 2 (Week 3-4): Core Features
| Developer | Tasks |
|-----------|-------|
| **Vinod** | Profile page, onboarding flow, RBAC |
| **Venu** | Homepage, Launch wizard, Upvote system |
| **Sandeep** | Review list, star ratings, basic verification |
| **Rani** | Pilot listing, inquiry system, dashboard |

### Sprint 3 (Week 5-6): Enhanced Features
| Developer | Tasks |
|-----------|-------|
| **Vinod** | Settings page, OAuth polish, security |
| **Venu** | Comments, search, category pages |
| **Sandeep** | Credibility scoring, embeddable widgets |
| **Rani** | Notification center, trending, analytics |

### Sprint 4 (Week 7-8): Polish & Deploy
| Developer | Tasks |
|-----------|-------|
| **Vinod** | Auth edge cases, performance optimization |
| **Venu** | Launch scheduling, featured launches |
| **Sandeep** | Widget embed code, LinkedIn verification |
| **Rani** | Email notifications, dashboard polish |

---

## Communication & Git Workflow

### Branch Naming
```
feature/vinod/auth-google-oauth
feature/venu/launch-wizard
feature/sandeep/review-form
feature/rani/pilot-inquiry
```

### Daily Sync
- 10:00 AM standup (15 min)
- Share blockers and updates
- Coordinate on integration points

### Code Review
- PRs require 1 approval before merge
- Cross-review between paired features
