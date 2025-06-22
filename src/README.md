# Project Structure Guide

This document explains the organized file structure of Travel Rogue.

## 📁 Directory Structure

```
src/
├── frontend/           # Frontend React/Next.js components and pages
│   ├── app/           # Next.js 13+ App Router pages
│   ├── components/    # Reusable UI components
│   ├── contexts/      # React Context providers
│   ├── hooks/         # Custom React hooks
│   └── public/        # Static assets (images, icons, etc.)
│
├── backend/           # Backend API and server logic
│   └── api/           # API route handlers
│       ├── app-routes/    # Next.js App Router API routes
│       ├── auth/          # Authentication endpoints
│       ├── community-plans.ts
│       ├── feedback.ts
│       ├── plans.ts
│       └── users.ts
│
└── shared/            # Shared utilities and types
    └── lib/           # Shared libraries and utilities
        ├── actions/   # Server actions
        ├── gemini/    # AI integration
        ├── openai/    # OpenAI integration
        ├── types/     # TypeScript type definitions
        ├── authApi.ts
        ├── constants.tsx
        ├── db.ts      # Database connection
        └── utils.ts
```

## 🎯 What Goes Where

### `/src/frontend/`
- **Purpose**: All client-side React components, pages, and UI logic
- **Contains**:
  - React components and UI elements
  - Next.js pages and layouts
  - Frontend-specific hooks and contexts
  - Static assets and public files

### `/src/backend/`
- **Purpose**: Server-side API routes and business logic
- **Contains**:
  - API endpoint handlers
  - Authentication logic
  - Database operations
  - Server-side validation

### `/src/shared/`
- **Purpose**: Code that's used by both frontend and backend
- **Contains**:
  - TypeScript type definitions
  - Utility functions
  - Constants and configurations
  - Database schemas
  - AI integration services

## 🔄 Import Paths

With this structure, you should update your import paths:

```typescript
// Before
import { Button } from "@/components/ui/button"
import { db } from "@/lib/db"

// After  
import { Button } from "@/src/frontend/components/ui/button"
import { db } from "@/src/shared/lib/db"
```

## 📝 Benefits

1. **Clear Separation**: Frontend and backend code are clearly separated
2. **Easy Navigation**: Developers can quickly find what they're looking for
3. **Shared Resources**: Common utilities are in one place
4. **Scalability**: Structure supports growth and team collaboration
5. **Maintainability**: Easier to maintain and debug specific areas

## 🚀 Next Steps

1. Update `tsconfig.json` path mappings
2. Update import statements throughout the codebase
3. Update any build scripts or deployment configurations
4. Consider moving middleware and configuration files to appropriate folders
