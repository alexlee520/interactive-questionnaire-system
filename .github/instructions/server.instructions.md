---
applies_to:
  - server/**/*
---

# Backend (Server) Instructions

## API Development

### Express.js Routes
- Define routes in `server/routes.ts`
- Use Express Router for organization
- Follow RESTful conventions
- Use async/await for asynchronous operations
- Handle errors with try-catch blocks

### Route Structure
```typescript
app.post('/api/responses', async (req, res) => {
  try {
    // Validate request body
    const validatedData = schema.parse(req.body);
    
    // Process request
    const result = await storage.save(validatedData);
    
    // Send response
    res.status(201).json(result);
  } catch (error) {
    // Handle errors
    res.status(400).json({ error: error.message });
  }
});
```

## Validation

### Zod Schemas
- Import schemas from `@shared/schema`
- Validate all incoming data
- Use `.parse()` for synchronous validation
- Use `.parseAsync()` for async validation
- Return validation errors to client

Example:
```typescript
import { responseSchema } from '@shared/schema';

const validatedData = responseSchema.parse(req.body);
```

### Error Handling
- Catch Zod validation errors
- Return 400 status for validation failures
- Use `zod-validation-error` for user-friendly messages
- Log errors for debugging

## Data Storage

### Storage Module
- Use `server/storage.ts` for data persistence
- Abstract storage logic from routes
- Use Drizzle ORM for database operations
- Handle database errors gracefully

### Database Operations
```typescript
// Insert
await db.insert(responses).values(data);

// Query
await db.select().from(responses).where(eq(responses.id, id));

// Update
await db.update(responses).set(data).where(eq(responses.id, id));
```

## Google Sheets Integration

### Google Sheets API
- Use `server/googleSheets.ts` for Google Sheets operations
- Handle API errors gracefully
- Check for environment variables before calling API
- Log success/failure of sheet operations

### Environment Variables
- Use `process.env` for configuration
- Required vars: `REPLIT_CONNECTORS_HOSTNAME`, `REPL_IDENTITY`
- Check for missing variables at startup
- Don't commit `.env` files

## Session Management

### Express Session
- Configure in `server/index.ts`
- Use MemoryStore (or PostgreSQL in production)
- Set secure cookie options
- Handle session errors

## TypeScript

### Type Safety
- Define types for request/response
- Use TypeScript for all server code
- Import types from `@shared` when possible
- Avoid `any` type

### Request Typing
```typescript
import { Request, Response } from 'express';
import { z } from 'zod';

type TypedRequest<T> = Request<{}, {}, T>;

app.post('/api/endpoint', async (req: TypedRequest<z.infer<typeof schema>>, res: Response) => {
  // req.body is typed
});
```

## Error Handling

### HTTP Status Codes
- 200: Success
- 201: Created
- 400: Bad Request (validation errors)
- 404: Not Found
- 500: Internal Server Error

### Error Response Format
```json
{
  "error": "Error message",
  "details": "Additional details if available"
}
```

### Logging
- Log errors with context
- Use console.error for errors
- Use console.log for info
- Include timestamps if needed

## Security

### Input Validation
- Validate all user inputs
- Sanitize data before storage
- Use parameterized queries (Drizzle handles this)
- Validate content types

### CORS
- Configure CORS if needed
- Restrict origins in production
- Handle preflight requests

### Rate Limiting
- Consider rate limiting for production
- Prevent abuse of API endpoints

## Database

### Drizzle ORM
- Define schema in database schema file
- Use Drizzle Kit for migrations
- Run `npm run db:push` to apply changes
- Use typed queries

### Neon Database
- Connection configured in `drizzle.config.ts`
- Use connection pooling
- Handle connection errors

## API Endpoints

### Current Endpoints
- `POST /api/responses` - Submit new response
- `GET /api/responses` - Get all responses
- `GET /api/responses/:id` - Get specific response

### Adding New Endpoints
1. Define schema in `@shared/schema`
2. Add route in `server/routes.ts`
3. Implement handler with validation
4. Add storage logic if needed
5. Test with curl or Postman

## Development Server

### Vite Integration
- Configure in `server/vite.ts`
- Serves frontend in development
- Hot module replacement (HMR)
- Proxy API requests

### Server Startup
- Listen on port 5000
- Log startup message
- Handle startup errors
- Graceful shutdown if needed

## Testing

### Manual Testing
- Use curl for API testing
- Test with Postman or similar tools
- Verify validation works
- Test error cases
- Check database persistence

Example curl:
```bash
curl -X POST http://localhost:5000/api/responses \
  -H "Content-Type: application/json" \
  -d '{"data": "test"}'
```

## Path Aliases

Use TypeScript path aliases:
- `@shared/*` maps to `shared/*`

Example:
```typescript
import { responseSchema } from '@shared/schema';
```

## Language

- Code: English
- Comments: English
- Error logs: English
- User-facing error messages: Traditional Chinese

## Performance

- Use async/await for I/O operations
- Avoid blocking the event loop
- Stream large responses if needed
- Cache frequently accessed data
- Monitor response times

## Common Pitfalls to Avoid

- Don't skip input validation
- Don't expose sensitive error details to client
- Don't use synchronous file operations
- Don't ignore TypeScript errors
- Don't commit secrets or credentials
- Don't trust client data - always validate
- Don't forget error handling in routes

## Production Considerations

- Set NODE_ENV=production
- Use production-ready database
- Enable logging and monitoring
- Configure proper CORS
- Use HTTPS in production
- Set secure session cookies
- Handle process signals for graceful shutdown
