---
applies_to:
  - shared/**/*
---

# Shared Code Instructions

## Purpose

The `shared/` directory contains code that is used by both the frontend (client) and backend (server). This includes:
- Zod validation schemas
- TypeScript types derived from schemas
- Shared constants
- Shared utility functions

## Zod Schemas

### Schema Definition
- Define all validation schemas in `shared/schema.ts`
- Use Zod for runtime type validation
- Export schemas and their TypeScript types
- Keep schemas DRY (Don't Repeat Yourself)

### Schema Patterns
```typescript
import { z } from 'zod';

// Define schema
export const questionnaireResponseSchema = z.object({
  questionId: z.string(),
  answer: z.string().min(1, '答案不能為空'),
  timestamp: z.string().datetime().optional()
});

// Derive TypeScript type
export type QuestionnaireResponse = z.infer<typeof questionnaireResponseSchema>;
```

### Validation Rules
- Use appropriate Zod types: `.string()`, `.number()`, `.boolean()`, `.enum()`, etc.
- Add validation constraints: `.min()`, `.max()`, `.email()`, `.regex()`, etc.
- Provide error messages in Traditional Chinese
- Make fields optional with `.optional()` when needed
- Use `.nullable()` for nullable fields

### Error Messages
- Write error messages in Traditional Chinese
- Be specific and helpful
- Guide users on how to fix the error

Example:
```typescript
z.string()
  .min(2, '名稱至少需要2個字元')
  .max(50, '名稱不能超過50個字元')
```

## Type Safety

### Deriving Types
- Always derive TypeScript types from Zod schemas using `z.infer<>`
- Don't define types separately - let Zod be the source of truth
- Export both schemas and types

```typescript
export const userSchema = z.object({
  name: z.string(),
  email: z.string().email()
});

export type User = z.infer<typeof userSchema>;
```

### Using Types
In client code:
```typescript
import { User, userSchema } from '@shared/schema';
```

In server code:
```typescript
import { userSchema } from '@shared/schema';
```

## Shared Constants

### Defining Constants
- Export constants that are used in multiple places
- Use UPPER_SNAKE_CASE for constants
- Group related constants in objects

Example:
```typescript
export const QUESTION_PATHS = {
  POTENTIAL: 'A',
  EXISTING: 'B'
} as const;

export const RATING_SCALE = {
  MIN: 1,
  MAX: 5
} as const;
```

## Shared Utilities

### Utility Functions
- Place shared utility functions in separate files
- Export functions with clear names
- Add JSDoc comments for documentation
- Keep functions pure (no side effects)

Example:
```typescript
/**
 * Validates an email address format
 * @param email - The email address to validate
 * @returns true if valid, false otherwise
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
```

## Schema Composition

### Reusing Schemas
- Use Zod's composition features
- Extend schemas with `.extend()`
- Pick fields with `.pick()`
- Omit fields with `.omit()`
- Merge schemas with `.merge()`

Example:
```typescript
const baseQuestionSchema = z.object({
  id: z.string(),
  text: z.string()
});

const ratingQuestionSchema = baseQuestionSchema.extend({
  minRating: z.number(),
  maxRating: z.number()
});
```

### Discriminated Unions
- Use `.discriminatedUnion()` for type-safe unions
- Useful for different question types or response types

Example:
```typescript
const questionSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('text'),
    placeholder: z.string()
  }),
  z.object({
    type: z.literal('rating'),
    scale: z.number()
  })
]);
```

## Validation Patterns

### Optional Fields
```typescript
z.object({
  required: z.string(),
  optional: z.string().optional()
});
```

### Default Values
```typescript
z.object({
  status: z.string().default('pending')
});
```

### Transformations
```typescript
z.string().transform((val) => val.trim().toLowerCase())
```

### Refinements
```typescript
z.string().refine(
  (val) => val.length >= 2,
  { message: '至少需要2個字元' }
)
```

## Testing Schemas

### Manual Testing
- Test schemas with valid data
- Test schemas with invalid data
- Verify error messages are correct
- Test edge cases

Example:
```typescript
// In development console or test
const result = schema.safeParse(data);
if (!result.success) {
  console.error(result.error.issues);
}
```

## Path Aliases

Import shared code using path alias:
```typescript
// From client
import { schema } from '@shared/schema';

// From server
import { schema } from '@shared/schema';
```

## Versioning Considerations

### Breaking Changes
- Avoid breaking changes when possible
- If schema changes, update both client and server
- Consider versioning APIs if needed
- Test thoroughly after schema changes

### Backward Compatibility
- Add new fields as optional
- Use default values for new fields
- Don't remove fields without migration
- Don't change validation rules drastically

## Documentation

### JSDoc Comments
- Add JSDoc comments to exported schemas
- Document field purposes and constraints
- Explain complex validation logic

Example:
```typescript
/**
 * Schema for questionnaire response submission
 * 
 * @property questionId - Unique identifier of the question
 * @property answer - User's answer (1-5 for rating, text for open-ended)
 * @property path - Questionnaire path (A for potential, B for existing)
 */
export const responseSchema = z.object({
  questionId: z.string(),
  answer: z.string(),
  path: z.enum(['A', 'B'])
});
```

## Common Pitfalls to Avoid

- Don't define types separately from schemas
- Don't skip error messages
- Don't make breaking changes without considering impact
- Don't use loose validation rules
- Don't forget to export schemas and types
- Don't duplicate validation logic between client and server

## Best Practices

- Keep schemas close to the data they validate
- Use Zod's built-in validators when possible
- Write descriptive error messages
- Test schemas with edge cases
- Document complex schemas
- Keep shared code minimal and focused
- Ensure changes work for both client and server
