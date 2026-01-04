# EthAum.ai - API Documentation

**Version:** 1.0  
**Base URL:** `https://api.ethaum.ai/v1`  
**Date:** January 4, 2026  

---

## 1. Overview

### 1.1 Authentication
All authenticated endpoints require a Bearer token or session cookie.

```http
Authorization: Bearer <access_token>
```

### 1.2 Response Format
All responses follow this structure:

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "hasMore": true
  },
  "error": null
}
```

### 1.3 Error Response
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      { "field": "email", "message": "Invalid email format" }
    ]
  }
}
```

### 1.4 Rate Limiting
- **Public endpoints:** 100 requests/minute
- **Authenticated:** 500 requests/minute
- **Widget endpoints:** 1000 requests/minute

---

## 2. Authentication Endpoints

### POST /auth/register
Create a new user account.

**Request:**
```json
{
  "email": "founder@startup.com",
  "password": "SecurePass123!",
  "name": "Sarah Chen"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_abc123",
      "email": "founder@startup.com",
      "name": "Sarah Chen",
      "role": "USER"
    },
    "accessToken": "eyJhbG..."
  }
}
```

---

### POST /auth/login
Authenticate existing user.

**Request:**
```json
{
  "email": "founder@startup.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "accessToken": "eyJhbG..."
  }
}
```

---

### GET /auth/me
Get current authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "usr_abc123",
    "email": "founder@startup.com",
    "name": "Sarah Chen",
    "image": "https://...",
    "role": "STARTUP_ADMIN",
    "companies": [
      {
        "id": "com_xyz789",
        "name": "TechStartup Inc",
        "role": "OWNER"
      }
    ]
  }
}
```

---

## 3. Company Endpoints

### GET /companies
List all companies with filters.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `page` | int | Page number (default: 1) |
| `limit` | int | Items per page (default: 20, max: 50) |
| `category` | string | Category slug filter |
| `revenueStage` | string | SERIES_A, SERIES_B, SERIES_C, SERIES_D |
| `search` | string | Search query |
| `featured` | boolean | Only featured companies |

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "com_xyz789",
      "name": "TechStartup Inc",
      "slug": "techstartup-inc",
      "tagline": "AI-powered solutions",
      "logoUrl": "https://...",
      "revenueStage": "SERIES_B",
      "category": {
        "id": "cat_123",
        "name": "AI & Machine Learning"
      },
      "credibilityScore": 85,
      "verified": true
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150
  }
}
```

---

### POST /companies
Create a new company.

**Request:**
```json
{
  "name": "TechStartup Inc",
  "tagline": "AI-powered solutions for enterprise",
  "description": "We build intelligent...",
  "website": "https://techstartup.com",
  "revenueStage": "SERIES_B",
  "categoryId": "cat_123"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "com_xyz789",
    "slug": "techstartup-inc",
    ...
  }
}
```

---

### GET /companies/:slug
Get company details.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "com_xyz789",
    "name": "TechStartup Inc",
    "slug": "techstartup-inc",
    "tagline": "AI-powered solutions",
    "description": "Full description...",
    "logoUrl": "https://...",
    "website": "https://...",
    "revenueStage": "SERIES_B",
    "teamSize": "SIZE_11_50",
    "foundedAt": "2022-01-01",
    "verified": true,
    "category": { ... },
    "products": [ ... ],
    "credibilityScore": {
      "overall": 85,
      "review": 80,
      "launch": 90,
      "engagement": 85
    }
  }
}
```

---

## 4. Product Endpoints

### GET /products
List products with filters.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `page` | int | Page number |
| `limit` | int | Items per page |
| `category` | string | Category slug |
| `company` | string | Company slug |
| `search` | string | Search query |
| `tags` | string[] | Tag slugs (comma-separated) |

---

### POST /companies/:slug/products
Create product under company.

**Request:**
```json
{
  "name": "AI Analytics Pro",
  "tagline": "Instant insights from your data",
  "description": "Full product description...",
  "websiteUrl": "https://...",
  "features": ["Real-time analytics", "AI predictions"]
}
```

---

### GET /products/:slug
Get product details with reviews summary.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "prod_abc",
    "name": "AI Analytics Pro",
    "slug": "ai-analytics-pro",
    "company": { ... },
    "tagline": "...",
    "description": "...",
    "media": [...],
    "reviewSummary": {
      "averageRating": 4.5,
      "totalReviews": 25,
      "verified": 20
    },
    "launches": [...],
    "pilots": [...]
  }
}
```

---

## 5. Launch Endpoints

### GET /launches
Get launches with filters.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `date` | string | Filter by date (YYYY-MM-DD) |
| `status` | string | LIVE, COMPLETED |
| `featured` | boolean | Only featured |
| `category` | string | Category slug |

---

### GET /launches/today
Get today's launches (featured endpoint).

**Response (200):**
```json
{
  "success": true,
  "data": {
    "featured": [
      {
        "id": "launch_abc",
        "title": "AI Analytics Pro 2.0",
        "tagline": "Now with predictive insights",
        "product": { ... },
        "upvoteCount": 156,
        "commentCount": 23,
        "userHasUpvoted": false
      }
    ],
    "regular": [ ... ]
  }
}
```

---

### POST /launches
Create a new launch.

**Request:**
```json
{
  "productId": "prod_abc",
  "title": "AI Analytics Pro 2.0",
  "tagline": "Now with predictive insights",
  "description": "Major update introducing...",
  "media": [
    { "type": "image", "url": "https://...", "caption": "Dashboard" }
  ],
  "scheduledAt": "2026-01-15T09:00:00Z"
}
```

---

### POST /launches/:id/upvote
Toggle upvote on launch.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "upvoted": true,
    "upvoteCount": 157
  }
}
```

---

### GET /launches/:id/comments
Get launch comments.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "com_123",
      "content": "This looks amazing!",
      "author": { ... },
      "createdAt": "2026-01-10T...",
      "replies": [ ... ]
    }
  ]
}
```

---

### POST /launches/:id/comments
Add comment to launch.

**Request:**
```json
{
  "content": "Great product! How does it handle...",
  "parentId": null
}
```

---

## 6. Review Endpoints

### GET /products/:slug/reviews
Get product reviews.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `sort` | string | recent, helpful, rating_high, rating_low |
| `verified` | boolean | Only verified reviews |
| `rating` | int | Filter by rating (1-5) |

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "rev_abc",
      "rating": 5,
      "title": "Game changer for our team",
      "content": "We've been using...",
      "pros": "Easy to use, great support",
      "cons": "Could use more integrations",
      "author": {
        "name": "Michael T.",
        "company": "Fortune 500 Corp",
        "verified": true
      },
      "videoUrl": null,
      "createdAt": "2026-01-05T..."
    }
  ],
  "meta": {
    "averageRating": 4.5,
    "distribution": {
      "5": 15,
      "4": 8,
      "3": 2,
      "2": 0,
      "1": 0
    }
  }
}
```

---

### POST /products/:slug/reviews
Submit a review.

**Request:**
```json
{
  "rating": 5,
  "title": "Excellent tool",
  "content": "Detailed review content...",
  "pros": "Fast, reliable, great UX",
  "cons": "Pricing could be better",
  "videoUrl": "https://..."
}
```

---

## 7. Pilot Endpoints

### GET /pilots
Get all active pilots.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `category` | string | Category slug |
| `type` | string | FREE_TRIAL, POC, DISCOUNTED |
| `priceMax` | int | Maximum pilot price |

---

### POST /products/:slug/pilots
Create a pilot offering.

**Request:**
```json
{
  "title": "30-Day Enterprise Pilot",
  "description": "Full access to all features...",
  "pilotType": "ENTERPRISE_PILOT",
  "originalPrice": 5000,
  "pilotPrice": 500,
  "durationDays": 30,
  "spotsTotal": 5,
  "requirements": "Must have 100+ employees",
  "deliverables": "Full implementation, training..."
}
```

---

### POST /pilots/:id/inquire
Request access to pilot.

**Request:**
```json
{
  "companyName": "Enterprise Corp",
  "message": "We're looking to evaluate..."
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "inquiryId": "inq_abc",
    "status": "PENDING"
  }
}
```

---

## 8. Insights Endpoints

### GET /insights/trending
Get trending startups and launches.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "trendingLaunches": [ ... ],
    "risingCompanies": [ ... ],
    "popularCategories": [ ... ]
  }
}
```

---

### GET /companies/:slug/credibility
Get detailed credibility report.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "overallScore": 85,
    "breakdown": {
      "reviews": { "score": 80, "count": 25 },
      "launches": { "score": 90, "successRate": 0.95 },
      "engagement": { "score": 85, "upvotes": 500 },
      "verification": { "score": 100, "verified": true }
    },
    "badges": ["verified", "trending", "top-rated"],
    "calculatedAt": "2026-01-10T..."
  }
}
```

---

## 9. Widget Endpoints

### GET /widget/badge/:companySlug
Get embeddable badge data.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `theme` | string | light, dark |
| `type` | string | score, reviews, full |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "company": "TechStartup Inc",
    "score": 85,
    "reviewCount": 25,
    "avgRating": 4.5,
    "badges": ["verified"],
    "embedHtml": "<div class='ethaum-badge'>...</div>"
  }
}
```

---

### GET /widget/reviews/:productSlug
Get embeddable reviews widget data.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `limit` | int | Number of reviews (max 5) |
| `theme` | string | light, dark |

---

## 10. Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Invalid or missing auth token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid input data |
| `RATE_LIMITED` | 429 | Too many requests |
| `SERVER_ERROR` | 500 | Internal server error |
