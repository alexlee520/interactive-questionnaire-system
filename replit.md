# Uber Partner Questionnaire Application

## Overview

This is a multi-step questionnaire application designed for Uber's partner merchant onboarding program. The application collects business information from potential partners through an interactive, form-based interface. It features a modern, Typeform-inspired design with full dark mode support and smooth animations.

The application is built as a full-stack TypeScript project with a React frontend and Express backend, designed to capture partner responses and sync them to Google Sheets for business processing.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **Framework:** React 18 with TypeScript
- **Routing:** Wouter (lightweight client-side routing)
- **State Management:** React hooks with local state management
- **UI Library:** Radix UI primitives with custom shadcn/ui components
- **Styling:** Tailwind CSS with custom design system
- **Build Tool:** Vite

**Design System:**
- Custom theme system supporting light/dark modes with CSS variables
- Responsive layouts optimized for mobile and desktop
- Accessibility-first approach with ARIA labels and semantic HTML
- Animation system using CSS transitions and Tailwind utilities
- Design inspired by Typeform/Google Forms aesthetics

**Key Frontend Components:**
- **Multi-step Form:** Progressive disclosure pattern with 11 steps including welcome, data collection, and completion
- **Theme Provider:** Context-based theme management with localStorage persistence
- **Progress Tracking:** Visual progress bar indicating completion percentage
- **Particle Background:** Decorative animated background for visual appeal
- **Form Validation:** Client-side validation with real-time feedback

### Backend Architecture

**Technology Stack:**
- **Runtime:** Node.js with Express.js
- **Language:** TypeScript with ES modules
- **Database ORM:** Drizzle ORM (configured for PostgreSQL via Neon)
- **Development:** Vite middleware integration for hot module replacement

**API Design:**
- RESTful API endpoints for questionnaire responses
- POST `/api/responses` - Submit new questionnaire response
- GET `/api/responses` - Retrieve all responses
- GET `/api/responses/:id` - Retrieve specific response

**Data Storage:**
- **Primary Storage:** In-memory storage (MemStorage class) for development/demo
- **Schema:** PostgreSQL schema defined with Drizzle ORM
- **Validation:** Zod schemas for runtime type validation

**Request Flow:**
1. Client submits form data
2. Server validates against Zod schema
3. Data persisted to storage
4. Response asynchronously synced to Google Sheets
5. Success response returned to client

### Data Schema

**Response Model:**
```typescript
{
  id: UUID (auto-generated)
  email: string
  businessName: string
  privacyConsent: string
  intention: string
  contactName: string
  contactPhone: string
  infoSource: string[]
  referral?: string
  notInterestedReason?: string
  submittedAt: timestamp
}
```

## External Dependencies

### Third-Party Services

**Google Sheets Integration:**
- Uses Google Sheets API v4 for data export
- OAuth2 authentication via Replit Connectors (connection ID: conn_google-sheet_01K7RTWQZ57MHXGSW9BYDF5M9P)
- Asynchronous append operations to prevent blocking responses
- Automatic token refresh handling
- Spreadsheet auto-creation: "Uber 店家新用戶獎勵專案 - 問卷回應"
- Header formatting: Black background, white text, bold, centered
- Function: `appendResponseToSheet()` in server/googleSheets.ts handles data sync
- Data mapping: Taiwan timezone formatting, arrays to comma-separated strings, enum values to Chinese labels
- Fixed bug: Uses `includeSpreadsheetInResponse: true` to correctly retrieve sheetId

**Replit Platform Services:**
- Replit Connectors for OAuth management
- Environment-based authentication using `REPL_IDENTITY` or `WEB_REPL_RENEWAL`
- Development tools: Cartographer and Dev Banner plugins

### Database

**Neon Serverless PostgreSQL:**
- Configured via `@neondatabase/serverless` driver
- Connection managed through `DATABASE_URL` environment variable
- Schema migrations handled by Drizzle Kit
- Note: Currently using in-memory storage; PostgreSQL schema defined but not actively used

### UI Component Libraries

**Radix UI Primitives:**
- Accordion, Alert Dialog, Checkbox, Dialog, Dropdown Menu
- Hover Card, Label, Navigation Menu, Popover, Progress
- Radio Group, Scroll Area, Select, Separator, Slider
- Switch, Tabs, Toast, Tooltip, Toggle

**Styling and Utilities:**
- Tailwind CSS for utility-first styling
- class-variance-authority for component variants
- clsx and tailwind-merge for className management
- Lucide React for icons

### Development Tools

- **Type Safety:** TypeScript with strict mode enabled
- **Validation:** Zod for runtime schema validation, Drizzle-Zod for ORM integration
- **Date Handling:** date-fns for date manipulation
- **Build:** esbuild for production server bundling
- **HMR:** Vite's development server with React Fast Refresh

### Key Configuration Files

- `drizzle.config.ts` - Database configuration and migration settings
- `tailwind.config.ts` - Custom design tokens and theme configuration
- `vite.config.ts` - Build and development server settings
- `components.json` - shadcn/ui component configuration