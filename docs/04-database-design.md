# EthAum.ai - Database Design Document

**Version:** 1.1  
**Date:** January 4, 2026  
**Database:** MongoDB (via Mongoose)  

---

## 1. Schema Overview

This document provides the complete database schema for EthAum.ai MVP using MongoDB with Mongoose ODM, including all collections, relationships, and indexes.

---

## 2. Mongoose Schemas

```javascript
// models/User.js

import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  emailVerified: { type: Date },
  name: { type: String, trim: true },
  image: { type: String },
  bio: { type: String },
  linkedinUrl: { type: String },
  twitterUrl: { type: String },
  role: { 
    type: String, 
    enum: ['USER', 'STARTUP_ADMIN', 'ENTERPRISE_BUYER', 'ADMIN'],
    default: 'USER'
  }
}, { timestamps: true });

UserSchema.index({ email: 1 });

export default mongoose.models.User || mongoose.model('User', UserSchema);
```

```javascript
// models/Account.js

import mongoose from 'mongoose';

const AccountSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  type: { type: String, required: true },
  provider: { type: String, required: true },
  providerAccountId: { type: String, required: true },
  refresh_token: { type: String },
  access_token: { type: String },
  expires_at: { type: Number },
  token_type: { type: String },
  scope: { type: String },
  id_token: { type: String },
  session_state: { type: String }
}, { timestamps: true });

AccountSchema.index({ provider: 1, providerAccountId: 1 }, { unique: true });

export default mongoose.models.Account || mongoose.model('Account', AccountSchema);
```

```javascript
// models/Company.js

import mongoose from 'mongoose';

const CompanySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  tagline: { type: String },
  description: { type: String },
  logoUrl: { type: String },
  website: { type: String },
  linkedinUrl: { type: String },
  twitterUrl: { type: String },
  revenueStage: { 
    type: String, 
    enum: ['PRE_REVENUE', 'SERIES_A', 'SERIES_B', 'SERIES_C', 'SERIES_D']
  },
  arrRange: { type: String },
  teamSize: { 
    type: String, 
    enum: ['SIZE_1_10', 'SIZE_11_50', 'SIZE_51_200', 'SIZE_201_500', 'SIZE_500_PLUS']
  },
  foundedAt: { type: Date },
  headquarters: { type: String },
  verified: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  members: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { 
      type: String, 
      enum: ['OWNER', 'ADMIN', 'MEMBER'],
      default: 'MEMBER'
    },
    joinedAt: { type: Date, default: Date.now }
  }],
  credibilityScore: {
    overall: { type: Number, default: 0 },
    review: { type: Number, default: 0 },
    launch: { type: Number, default: 0 },
    engagement: { type: Number, default: 0 },
    verification: { type: Number, default: 0 },
    calculatedAt: { type: Date }
  }
}, { timestamps: true });

CompanySchema.index({ slug: 1 });
CompanySchema.index({ categoryId: 1 });
CompanySchema.index({ revenueStage: 1 });
CompanySchema.index({ 'members.userId': 1 });

export default mongoose.models.Company || mongoose.model('Company', CompanySchema);
```

```javascript
// models/Product.js

import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  companyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Company', 
    required: true 
  },
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  tagline: { type: String },
  description: { type: String },
  logoUrl: { type: String },
  websiteUrl: { type: String },
  pricingUrl: { type: String },
  media: [{
    type: { type: String, enum: ['image', 'video', 'gif'] },
    url: String,
    caption: String
  }],
  features: [{ type: String }],
  tags: [{ type: String, lowercase: true }]
}, { timestamps: true });

ProductSchema.index({ slug: 1 });
ProductSchema.index({ companyId: 1 });
ProductSchema.index({ tags: 1 });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
```

```javascript
// models/Launch.js

import mongoose from 'mongoose';

const LaunchSchema = new mongoose.Schema({
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  title: { type: String, required: true },
  tagline: { type: String, required: true },
  description: { type: String },
  media: [{
    type: { type: String, enum: ['image', 'video', 'gif'] },
    url: String,
    caption: String
  }],
  scheduledAt: { type: Date },
  launchedAt: { type: Date },
  status: { 
    type: String, 
    enum: ['DRAFT', 'SCHEDULED', 'LIVE', 'COMPLETED', 'CANCELLED'],
    default: 'DRAFT'
  },
  featured: { type: Boolean, default: false },
  upvoteCount: { type: Number, default: 0 },
  commentCount: { type: Number, default: 0 },
  viewCount: { type: Number, default: 0 }
}, { timestamps: true });

LaunchSchema.index({ productId: 1 });
LaunchSchema.index({ launchedAt: -1 });
LaunchSchema.index({ status: 1 });
LaunchSchema.index({ featured: 1 });

export default mongoose.models.Launch || mongoose.model('Launch', LaunchSchema);
```

```javascript
// models/Upvote.js

import mongoose from 'mongoose';

const UpvoteSchema = new mongoose.Schema({
  launchId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Launch', 
    required: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
}, { timestamps: true });

UpvoteSchema.index({ launchId: 1, userId: 1 }, { unique: true });
UpvoteSchema.index({ launchId: 1 });
UpvoteSchema.index({ userId: 1 });

export default mongoose.models.Upvote || mongoose.model('Upvote', UpvoteSchema);
```

```javascript
// models/Comment.js

import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  launchId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Launch', 
    required: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  parentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Comment',
    default: null
  },
  content: { type: String, required: true }
}, { timestamps: true });

CommentSchema.index({ launchId: 1 });
CommentSchema.index({ userId: 1 });
CommentSchema.index({ parentId: 1 });

export default mongoose.models.Comment || mongoose.model('Comment', CommentSchema);
```

```javascript
// models/Review.js

import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  authorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String },
  content: { type: String, required: true },
  pros: { type: String },
  cons: { type: String },
  videoUrl: { type: String },
  verified: { type: Boolean, default: false },
  verifiedAt: { type: Date },
  status: { 
    type: String, 
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
    default: 'PENDING'
  },
  helpfulCount: { type: Number, default: 0 }
}, { timestamps: true });

ReviewSchema.index({ productId: 1 });
ReviewSchema.index({ authorId: 1 });
ReviewSchema.index({ status: 1 });
ReviewSchema.index({ verified: 1 });

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema);
```

```javascript
// models/Pilot.js

import mongoose from 'mongoose';

const PilotSchema = new mongoose.Schema({
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  pilotType: { 
    type: String, 
    enum: ['FREE_TRIAL', 'DISCOUNTED', 'POC', 'ENTERPRISE_PILOT'],
    required: true
  },
  originalPrice: { type: Number },
  pilotPrice: { type: Number, required: true },
  durationDays: { type: Number, required: true },
  spotsTotal: { type: Number, required: true },
  spotsRemaining: { type: Number, required: true },
  requirements: { type: String },
  deliverables: { type: String },
  status: { 
    type: String, 
    enum: ['DRAFT', 'ACTIVE', 'FULL', 'COMPLETED', 'CANCELLED'],
    default: 'DRAFT'
  },
  startsAt: { type: Date },
  endsAt: { type: Date }
}, { timestamps: true });

PilotSchema.index({ productId: 1 });
PilotSchema.index({ status: 1 });

export default mongoose.models.Pilot || mongoose.model('Pilot', PilotSchema);
```

```javascript
// models/PilotInquiry.js

import mongoose from 'mongoose';

const PilotInquirySchema = new mongoose.Schema({
  pilotId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Pilot', 
    required: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  companyName: { type: String },
  message: { type: String },
  status: { 
    type: String, 
    enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED'],
    default: 'PENDING'
  },
  respondedAt: { type: Date }
}, { timestamps: true });

PilotInquirySchema.index({ pilotId: 1 });
PilotInquirySchema.index({ userId: 1 });
PilotInquirySchema.index({ status: 1 });

export default mongoose.models.PilotInquiry || mongoose.model('PilotInquiry', PilotInquirySchema);
```

```javascript
// models/Category.js

import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String },
  icon: { type: String },
  color: { type: String },
  parentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category',
    default: null
  },
  sortOrder: { type: Number, default: 0 }
}, { timestamps: true });

CategorySchema.index({ slug: 1 });
CategorySchema.index({ parentId: 1 });

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);
```

```javascript
// models/Notification.js

import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['LAUNCH_UPVOTE', 'LAUNCH_COMMENT', 'NEW_REVIEW', 'PILOT_INQUIRY', 'SYSTEM'],
    required: true
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  data: { type: mongoose.Schema.Types.Mixed },
  read: { type: Boolean, default: false },
  readAt: { type: Date }
}, { timestamps: true });

NotificationSchema.index({ userId: 1 });
NotificationSchema.index({ read: 1 });
NotificationSchema.index({ createdAt: -1 });

export default mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
```

---

## 3. Database Connection

```javascript
// lib/mongodb.js

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
```

---

## 4. Collections Summary

| Collection | Purpose | Key Indexes |
|------------|---------|-------------|
| `users` | User accounts and profiles | email, role |
| `accounts` | OAuth provider accounts | provider + providerAccountId |
| `companies` | Startup organizations | slug, categoryId, revenueStage |
| `products` | Individual products/tools | slug, companyId, tags |
| `launches` | Product Hunt-style launches | launchedAt, status, featured |
| `upvotes` | Launch upvotes | launchId + userId (unique) |
| `comments` | Launch comments | launchId, parentId |
| `reviews` | G2-style testimonials | productId, status, verified |
| `pilots` | AppSumo-style deals | productId, status |
| `pilotinquiries` | Pilot requests | pilotId, userId, status |
| `categories` | Hierarchical categories | slug, parentId |
| `notifications` | User notifications | userId, read, createdAt |

---

## 5. MongoDB Atlas Setup

### Environment Variables
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.xxxxx.mongodb.net/ethaum?retryWrites=true&w=majority
```

### Recommended Indexes (via Atlas UI)
1. Text search index on `companies.name`, `companies.description`
2. Text search index on `products.name`, `products.description`
3. Compound index on `launches` for homepage feed queries

---

## 6. Data Relationships

```
User ──┬──< Account (1:N - OAuth accounts)
       │
       └──< Company.members[] (embedded array)
       
Company ──< Product (1:N)
        └── Category (N:1)

Product ──< Launch (1:N)
        ├< Review (1:N)
        └< Pilot (1:N)

Launch ──< Upvote (1:N)
       └< Comment (1:N, self-referencing for replies)

Pilot ──< PilotInquiry (1:N)
```

---

## 7. Migration Notes

### From Empty Database
```bash
# Seed categories first
npm run seed:categories

# Then optionally seed demo data
npm run seed:demo
```

### Key Differences from SQL
- Use embedded documents where appropriate (e.g., company.members[])
- Use references (ObjectId) for truly separate entities
- Denormalize counts (upvoteCount, commentCount) for performance
