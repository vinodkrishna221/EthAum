# EthAum.ai - Database Design Document

**Version:** 1.0  
**Date:** January 4, 2026  
**Database:** PostgreSQL  

---

## 1. Schema Overview

This document provides the complete database schema for EthAum.ai MVP, including all tables, relationships, and indexes required for the platform.

---

## 2. Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// =====================
// USER & AUTHENTICATION
// =====================

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  emailVerified DateTime?
  name          String?
  image         String?
  bio           String?
  linkedinUrl   String?
  twitterUrl    String?
  role          UserRole  @default(USER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  accounts      Account[]
  sessions      Session[]
  companies     UserCompany[]
  upvotes       Upvote[]
  comments      Comment[]
  reviews       Review[]
  pilotInquiries PilotInquiry[]
  notifications  Notification[]

  @@map("users")
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
  @@map("verification_tokens")
}

enum UserRole {
  USER
  STARTUP_ADMIN
  ENTERPRISE_BUYER
  ADMIN
}

// =====================
// COMPANIES & PRODUCTS
// =====================

model Company {
  id            String       @id @default(cuid())
  name          String
  slug          String       @unique
  tagline       String?
  description   String?      @db.Text
  logoUrl       String?
  website       String?
  linkedinUrl   String?
  twitterUrl    String?
  revenueStage  RevenueStage?
  arrRange      String?
  teamSize      TeamSize?
  foundedAt     DateTime?
  headquarters  String?
  verified      Boolean      @default(false)
  featured      Boolean      @default(false)
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt

  // Relations
  categoryId       String?
  category         Category?          @relation(fields: [categoryId], references: [id])
  members          UserCompany[]
  products         Product[]
  credibilityScore CredibilityScore?

  @@index([slug])
  @@index([categoryId])
  @@index([revenueStage])
  @@map("companies")
}

model UserCompany {
  id        String            @id @default(cuid())
  userId    String
  companyId String
  role      CompanyMemberRole @default(MEMBER)
  createdAt DateTime          @default(now())

  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  company Company @relation(fields: [companyId], references: [id], onDelete: Cascade)

  @@unique([userId, companyId])
  @@map("user_companies")
}

enum CompanyMemberRole {
  OWNER
  ADMIN
  MEMBER
}

enum RevenueStage {
  PRE_REVENUE
  SERIES_A    // $1M - $5M ARR
  SERIES_B    // $5M - $15M ARR
  SERIES_C    // $15M - $30M ARR
  SERIES_D    // $30M+ ARR
}

enum TeamSize {
  SIZE_1_10
  SIZE_11_50
  SIZE_51_200
  SIZE_201_500
  SIZE_500_PLUS
}

model Product {
  id          String   @id @default(cuid())
  companyId   String
  name        String
  slug        String   @unique
  tagline     String?
  description String?  @db.Text
  logoUrl     String?
  websiteUrl  String?
  pricingUrl  String?
  media       Json?    // Array of {type, url, caption}
  features    Json?    // Array of feature strings
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  company   Company   @relation(fields: [companyId], references: [id], onDelete: Cascade)
  launches  Launch[]
  reviews   Review[]
  pilots    Pilot[]
  tags      ProductTag[]

  @@index([slug])
  @@index([companyId])
  @@map("products")
}

model ProductTag {
  id        String  @id @default(cuid())
  productId String
  tagId     String

  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  tag     Tag     @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@unique([productId, tagId])
  @@map("product_tags")
}

model Tag {
  id        String       @id @default(cuid())
  name      String       @unique
  slug      String       @unique
  createdAt DateTime     @default(now())

  products  ProductTag[]

  @@map("tags")
}

// =====================
// CATEGORIES
// =====================

model Category {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String?
  icon        String?
  color       String?
  parentId    String?
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Self-relation for hierarchical categories
  parent   Category?  @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children Category[] @relation("CategoryHierarchy")

  companies Company[]

  @@index([slug])
  @@index([parentId])
  @@map("categories")
}

// =====================
// LAUNCHES
// =====================

model Launch {
  id            String       @id @default(cuid())
  productId     String
  title         String
  tagline       String
  description   String?      @db.Text
  media         Json?        // Array of {type, url, caption}
  scheduledAt   DateTime?
  launchedAt    DateTime?
  status        LaunchStatus @default(DRAFT)
  featured      Boolean      @default(false)
  upvoteCount   Int          @default(0)
  commentCount  Int          @default(0)
  viewCount     Int          @default(0)
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt

  // Relations
  product   Product   @relation(fields: [productId], references: [id], onDelete: Cascade)
  upvotes   Upvote[]
  comments  Comment[]

  @@index([productId])
  @@index([launchedAt])
  @@index([status])
  @@index([featured])
  @@map("launches")
}

enum LaunchStatus {
  DRAFT
  SCHEDULED
  LIVE
  COMPLETED
  CANCELLED
}

model Upvote {
  id        String   @id @default(cuid())
  launchId  String
  userId    String
  createdAt DateTime @default(now())

  launch Launch @relation(fields: [launchId], references: [id], onDelete: Cascade)
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([launchId, userId])
  @@index([launchId])
  @@index([userId])
  @@map("upvotes")
}

model Comment {
  id        String   @id @default(cuid())
  launchId  String
  userId    String
  parentId  String?
  content   String   @db.Text
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  launch   Launch    @relation(fields: [launchId], references: [id], onDelete: Cascade)
  user     User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  parent   Comment?  @relation("CommentReplies", fields: [parentId], references: [id])
  replies  Comment[] @relation("CommentReplies")

  @@index([launchId])
  @@index([userId])
  @@index([parentId])
  @@map("comments")
}

// =====================
// REVIEWS
// =====================

model Review {
  id            String       @id @default(cuid())
  productId     String
  authorId      String
  rating        Int          // 1-5 stars
  title         String?
  content       String       @db.Text
  pros          String?      @db.Text
  cons          String?      @db.Text
  videoUrl      String?
  verified      Boolean      @default(false)
  verifiedAt    DateTime?
  status        ReviewStatus @default(PENDING)
  helpfulCount  Int          @default(0)
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt

  // Relations
  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  author  User    @relation(fields: [authorId], references: [id], onDelete: Cascade)

  @@index([productId])
  @@index([authorId])
  @@index([status])
  @@index([verified])
  @@map("reviews")
}

enum ReviewStatus {
  PENDING
  APPROVED
  REJECTED
}

// =====================
// PILOTS & DEALS
// =====================

model Pilot {
  id              String      @id @default(cuid())
  productId       String
  title           String
  description     String      @db.Text
  pilotType       PilotType
  originalPrice   Decimal?    @db.Decimal(10, 2)
  pilotPrice      Decimal     @db.Decimal(10, 2)
  durationDays    Int
  spotsTotal      Int
  spotsRemaining  Int
  requirements    String?     @db.Text
  deliverables    String?     @db.Text
  status          PilotStatus @default(DRAFT)
  startsAt        DateTime?
  endsAt          DateTime?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  // Relations
  product   Product        @relation(fields: [productId], references: [id], onDelete: Cascade)
  inquiries PilotInquiry[]

  @@index([productId])
  @@index([status])
  @@map("pilots")
}

enum PilotType {
  FREE_TRIAL
  DISCOUNTED
  POC
  ENTERPRISE_PILOT
}

enum PilotStatus {
  DRAFT
  ACTIVE
  FULL
  COMPLETED
  CANCELLED
}

model PilotInquiry {
  id           String              @id @default(cuid())
  pilotId      String
  userId       String
  companyName  String?
  message      String?             @db.Text
  status       PilotInquiryStatus  @default(PENDING)
  respondedAt  DateTime?
  createdAt    DateTime            @default(now())
  updatedAt    DateTime            @updatedAt

  // Relations
  pilot Pilot @relation(fields: [pilotId], references: [id], onDelete: Cascade)
  user  User  @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([pilotId])
  @@index([userId])
  @@index([status])
  @@map("pilot_inquiries")
}

enum PilotInquiryStatus {
  PENDING
  ACCEPTED
  REJECTED
  COMPLETED
}

// =====================
// CREDIBILITY & SCORING
// =====================

model CredibilityScore {
  id                String   @id @default(cuid())
  companyId         String   @unique
  overallScore      Int      // 0-100
  reviewScore       Int      // 0-100
  launchScore       Int      // 0-100
  engagementScore   Int      // 0-100
  verificationScore Int      // 0-100
  breakdown         Json?    // Detailed scoring breakdown
  calculatedAt      DateTime @default(now())
  updatedAt         DateTime @updatedAt

  // Relations
  company Company @relation(fields: [companyId], references: [id], onDelete: Cascade)

  @@map("credibility_scores")
}

// =====================
// NOTIFICATIONS
// =====================

model Notification {
  id        String           @id @default(cuid())
  userId    String
  type      NotificationType
  title     String
  message   String
  data      Json?            // Additional context data
  read      Boolean          @default(false)
  readAt    DateTime?
  createdAt DateTime         @default(now())

  // Relations
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([read])
  @@index([createdAt])
  @@map("notifications")
}

enum NotificationType {
  LAUNCH_UPVOTE
  LAUNCH_COMMENT
  NEW_REVIEW
  PILOT_INQUIRY
  SYSTEM
}
```

---

## 3. Migration Strategy

### Initial Migration
```bash
# Generate initial migration
npx prisma migrate dev --name init

# Apply to production
npx prisma migrate deploy
```

### Seed Data Structure
```typescript
// prisma/seed.ts
async function main() {
  // 1. Create categories
  // 2. Create sample users
  // 3. Create sample companies
  // 4. Create sample products
  // 5. Create sample launches
}
```

---

## 4. Performance Optimizations

### Key Indexes
- All foreign keys indexed by default
- Additional indexes on:
  - `launches.launchedAt` (for daily launches query)
  - `launches.status` (filter live launches)
  - `reviews.verified` (filter verified reviews)
  - `companies.slug` (URL lookups)

### Query Optimization Notes
- Use `include` sparingly, prefer explicit `select`
- Paginate all list queries
- Cache frequently accessed data (categories, featured launches)
- Use connection pooling (PgBouncer or Prisma Accelerate)

---

## 5. Data Integrity Rules

| Rule | Implementation |
|------|----------------|
| Cascade deletes | Company → Products → Launches/Reviews |
| Unique constraints | slug fields, user-company membership |
| Required fields | Enforced at schema level |
| Soft deletes | Not implemented in MVP (add `deletedAt` later) |
