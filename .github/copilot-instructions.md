# Copilot Instructions for Interactive Questionnaire System

## Project Overview

This is an interactive web-based questionnaire system built with React + TypeScript (frontend) and Express.js (backend). The application is designed to assess potential partner merchants' willingness to cooperate and evaluate existing partners' performance and feedback.

**Key Features:**
- Dual-path questionnaire flow (potential vs. existing partners)
- Smart skip logic based on user responses
- Progress bar tracking
- Responsive design with dark/light theme support
- Form validation (frontend and backend)
- Google Sheets integration for response export

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React Query (@tanstack/react-query)
- **Routing**: Wouter
- **Forms**: React Hook Form with Zod validation
- **Animations**: Framer Motion

### Backend
- **Runtime**: Node.js with Express.js
- **Type System**: TypeScript
- **Validation**: Zod
- **Database**: Drizzle ORM with Neon Database
- **Sessions**: Express Session with MemoryStore
- **External APIs**: Google Sheets API

## Project Structure

```
interactive-questionnaire-system/
├── client/                  # Frontend application
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   │   └── steps/      # Questionnaire step components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   ├── App.tsx         # Main app component
│   │   └── main.tsx        # Entry point
│   └── index.html          # HTML template
├── server/                  # Backend application
│   ├── index.ts            # Server entry point
│   ├── routes.ts           # API routes
│   ├── storage.ts          # Data storage logic
│   ├── googleSheets.ts     # Google Sheets integration
│   └── vite.ts             # Vite development server
├── shared/                  # Shared code (types, schemas)
│   └── schema.ts           # Zod validation schemas
├── design_guidelines.md     # UI/UX design specifications
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── vite.config.ts          # Vite configuration
└── drizzle.config.ts       # Database configuration
```

## Build, Test, and Development Commands

### Development
```bash
npm run dev              # Start development server (port 5000)
```

### Build
```bash
npm run build           # Build frontend and backend for production
```

### Type Checking
```bash
npm run check           # Run TypeScript type checker (no emit)
```

### Database
```bash
npm run db:push         # Push database schema changes
```

### Production
```bash
npm start               # Start production server
```

## Code Conventions and Best Practices

### TypeScript
- Use strict TypeScript with all strict checks enabled
- Define types for all function parameters and return values
- Use Zod schemas for runtime validation and derive TypeScript types from them
- Prefer type inference where possible, but be explicit for public APIs
- Use ESNext module syntax (`import`/`export`)

### React
- Use functional components with hooks (no class components)
- Use TypeScript for all component props
- Follow React Query patterns for data fetching
- Use React Hook Form for form handling
- Keep components focused and single-purpose
- Place reusable components in `client/src/components/`
- Place page components in `client/src/pages/`

### Styling
- Use Tailwind CSS utility classes for styling
- Follow the design system defined in `design_guidelines.md`
- Use shadcn/ui components for UI elements
- Maintain consistency with existing color palette:
  - Primary accent: `#06C167` (green)
  - Support both light and dark themes
- Use responsive breakpoint at 768px for mobile adjustments
- Follow spacing primitives: 2, 3, 4, 5, 6, 8, 12, 16, 20, 24

### File Organization
- Keep related files close together
- Use path aliases: `@/*` for client/src, `@shared/*` for shared
- Place shared types and schemas in `shared/` directory
- Keep API routes in `server/routes.ts`
- Keep business logic separate from route handlers

### Validation
- Define validation schemas in `shared/schema.ts` using Zod
- Validate on both frontend (React Hook Form) and backend (Express middleware)
- Return meaningful error messages for validation failures
- Use `zod-validation-error` for user-friendly error messages

### API Design
- RESTful API endpoints under `/api/` prefix
- Current endpoints:
  - `POST /api/responses` - Submit questionnaire response
  - `GET /api/responses` - Get all responses
  - `GET /api/responses/:id` - Get specific response
- Return appropriate HTTP status codes
- Use JSON for request/response bodies
- Include error messages in error responses

### Comments
- Write self-documenting code where possible
- Add comments for complex logic or business rules
- Document non-obvious decisions
- Use JSDoc for exported functions and types
- Comments should be in English (code is in English, but UI text may be in Traditional Chinese)

### Error Handling
- Handle errors gracefully in both frontend and backend
- Show user-friendly error messages
- Log errors appropriately on the server
- Use try-catch blocks for async operations
- Validate all user inputs

## Important Context

### Questionnaire Flow
The application has two main questionnaire paths determined by the initial question:

**Path A: Potential Partners**
- Question A1: Willingness to cooperate (yes/no)
- Questions A2-A5: If willing, collect company info
- Question A6: If not willing, ask for reasons (multiple choice)
- Different thank you messages based on response

**Path B: Existing Partners**
- Question B1: Cooperation duration
- Question B2: Number of new users
- Questions B3-B6: Various ratings (1-5 scale)
  - Overall effectiveness
  - Customer satisfaction improvement
  - Order growth impact
  - Quality maintenance
- Thank you message

### Design System
- Refer to `design_guidelines.md` for detailed design specifications
- Maintain consistent spacing, typography, and color usage
- Support both light and dark themes
- Ensure accessibility (ARIA labels, keyboard navigation, contrast)
- Mobile-first responsive design

### Google Sheets Integration
- Responses can be exported to Google Sheets
- Configuration uses Replit connectors via environment variables
- Handle API errors gracefully

## Testing Guidelines

Currently, this project does not have automated tests. When adding features:
- Manually test all user flows
- Test both questionnaire paths (A and B)
- Verify form validation (required fields, format validation)
- Test on different screen sizes (mobile and desktop)
- Test both light and dark themes
- Verify API endpoints with tools like curl or Postman

## Common Tasks

### Adding a New Question
1. Update the schema in `shared/schema.ts`
2. Create or update the step component in `client/src/components/steps/`
3. Update the questionnaire flow logic in the main form component
4. Update progress calculation if needed
5. Test the new question in both questionnaire paths

### Adding a New API Endpoint
1. Define the route in `server/routes.ts`
2. Add validation schema in `shared/schema.ts`
3. Implement the handler function
4. Update storage logic in `server/storage.ts` if needed
5. Test the endpoint

### Styling Changes
1. Refer to `design_guidelines.md` for the design system
2. Use existing Tailwind classes where possible
3. Maintain consistency with existing components
4. Test in both light and dark themes
5. Ensure responsive behavior

### Database Schema Changes
1. Update schema in database configuration
2. Run `npm run db:push` to apply changes
3. Update related TypeScript types
4. Test CRUD operations

## Dependencies Management

- Keep dependencies up to date for security
- Avoid adding unnecessary dependencies
- Use `npm` (not yarn or pnpm)
- Check for breaking changes before upgrading major versions
- Update `package.json` and run `npm install`

## Language and Localization

- Code (variables, functions, comments): English
- UI text and content: Traditional Chinese (繁體中文)
- Error messages for users: Traditional Chinese
- Internal error logs: English

## Notes for Copilot

- This is a production application used for real business purposes
- Maintain backwards compatibility when making changes
- Consider the user experience for non-technical users
- The design system is well-defined - follow it closely
- Always validate user inputs on both client and server
- Test changes in development mode before building for production
- Consider mobile users - many respondents may use mobile devices
