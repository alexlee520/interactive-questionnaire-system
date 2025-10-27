---
applies_to:
  - client/**/*
---

# Frontend (Client) Instructions

## Component Development

### React Components
- Use functional components with TypeScript
- Define prop types using TypeScript interfaces
- Export components as default exports
- Keep components focused on a single responsibility
- Place reusable components in `client/src/components/`
- Place page components in `client/src/pages/`
- Place questionnaire step components in `client/src/components/steps/`

### Component Structure
```typescript
import React from 'react';

interface ComponentProps {
  // Define props with TypeScript
  title: string;
  onSubmit: (data: FormData) => void;
}

export default function Component({ title, onSubmit }: ComponentProps) {
  // Component logic
  return (
    // JSX
  );
}
```

## Styling Guidelines

### Tailwind CSS
- Use Tailwind utility classes for all styling
- Follow the design system in `design_guidelines.md`
- Use the design tokens:
  - Primary color: `#06C167` (text-[#06C167], bg-[#06C167])
  - Spacing: 2, 3, 4, 5, 6, 8, 12, 16, 20, 24
  - Border radius: rounded-lg (10px), rounded-xl (12px)
  - Borders: 2px solid (border-2)

### shadcn/ui Components
- Import components from `@/components/ui/`
- Use existing shadcn/ui components before creating custom ones
- Follow shadcn/ui patterns for customization
- Available components: Button, Input, Card, Label, RadioGroup, Checkbox, Progress, etc.

### Theme Support
- Ensure all components work in both light and dark themes
- Use Tailwind's dark mode classes: `dark:bg-gray-800`
- Test theme switching before committing

### Responsive Design
- Mobile-first approach
- Breakpoint: 768px (md: prefix in Tailwind)
- Test on mobile viewport (< 768px) and desktop (≥ 768px)
- Use responsive classes: `text-base md:text-lg`

## Form Handling

### React Hook Form
- Use React Hook Form for all forms
- Integrate with Zod for validation
- Import schemas from `@shared/schema`
- Use `useForm` hook with resolver

Example:
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { questionSchema } from '@shared/schema';

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(questionSchema)
});
```

## Data Fetching

### React Query
- Use React Query for all API calls
- Use `useMutation` for POST/PUT/DELETE
- Use `useQuery` for GET requests
- Handle loading and error states
- Cache invalidation after mutations

Example:
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';

const mutation = useMutation({
  mutationFn: async (data) => {
    const response = await fetch('/api/responses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },
  onSuccess: () => {
    queryClient.invalidateQueries(['responses']);
  }
});
```

## State Management

- Use React hooks for component-level state
- Use React Query for server state
- Use Context API for theme/global state if needed
- Avoid prop drilling - use composition or context

## Routing

### Wouter
- Import from 'wouter'
- Use `<Route>` and `<Link>` components
- Keep routes in `App.tsx`
- Use path parameters for dynamic routes

## Animations

### Framer Motion
- Use for page transitions and micro-interactions
- Keep animations subtle and performant
- Follow existing animation patterns
- Duration: 0.15-0.45s for most animations

## Accessibility

- Use semantic HTML elements
- Add ARIA labels where needed
- Ensure keyboard navigation works
- Maintain color contrast (WCAG AA)
- Test with screen readers when adding new UI
- Use focus-visible for focus styles

## Error Handling

- Display user-friendly error messages in Traditional Chinese
- Show validation errors inline with form fields
- Handle network errors gracefully
- Use toast notifications for global errors
- Log errors to console for debugging

## Performance

- Lazy load routes if needed
- Optimize images and assets
- Avoid unnecessary re-renders
- Use React.memo for expensive components
- Monitor bundle size

## Testing

- Manually test all user interactions
- Test both questionnaire paths (A and B)
- Verify form validation
- Test responsive layouts
- Test theme switching
- Test in Chrome and Safari (if possible)

## Path Aliases

Use TypeScript path aliases:
- `@/*` maps to `client/src/*`
- `@shared/*` maps to `shared/*`

Example:
```typescript
import Button from '@/components/ui/button';
import { responseSchema } from '@shared/schema';
```

## Language

- Code: English
- UI text: Traditional Chinese (繁體中文)
- Comments: English
- Variable names: English, descriptive

## Common Pitfalls to Avoid

- Don't use inline styles - use Tailwind classes
- Don't create custom CSS files - use Tailwind
- Don't bypass validation - always validate inputs
- Don't ignore TypeScript errors - fix them
- Don't break dark mode - always test
- Don't ignore mobile view - test responsive design
