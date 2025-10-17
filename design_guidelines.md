# Design Guidelines: Partnership Questionnaire Form

## Design Approach

**Reference-Based Approach**: Drawing inspiration from modern form applications like Typeform and Google Forms, combined with the sleek aesthetics of productivity tools. The existing design already establishes a strong foundation with its green accent (#06C167) and clean interface.

## Core Design Elements

### A. Color Palette

**Light Mode:**
- Background: 0 0% 100% (pure white)
- Text Primary: 220 13% 9% (#111827)
- Text Muted: 220 9% 46% (#6b7280)
- Panel: 216 12% 97% (#f7f8fa)
- Border: 214 14% 90% (#e5e7eb)
- Accent Primary: 149 95% 39% (#06C167)
- Accent Hover: 149 95% 33% (#05a557)
- Accent Light: 149 95% 95% (#e9fbf2)
- Error: 0 72% 59% (#ef4444)

**Dark Mode:**
- Background: 0 0% 8% (#141414)
- Text Primary: 0 0% 100% (white)
- Text Muted: 0 0% 70% (#B3B3B3)
- Panel: 0 0% 16% (#282828)
- Border: 0 0% 23% (#3a3a3a)
- Accent Primary: 149 95% 39% (#06C167) - consistent across themes
- Error: 0 72% 70% (#f87171)

### B. Typography

**Font Stack**: System fonts for optimal performance and native feel
```
-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'PingFang TC', 'Microsoft JhengHei', sans-serif
```

**Type Scale:**
- Hero Heading: 2.1rem / 800 weight / 1.3 line-height
- Question Number: 0.9rem / 600 weight / muted color
- Subtitle: 1.075rem / 400 weight / 1.7 line-height
- Body: 1.05rem / 400 weight
- Button: 1rem / 800 weight
- Hint Text: 0.92rem / 500 weight

### C. Layout System

**Spacing Primitives**: Use Tailwind units of 2, 3, 4, 5, 6, 8, 12, 16, 20, 24 for consistent rhythm

**Container:**
- Max-width: 760px (forms and content)
- Padding: 64px vertical (top), 20px horizontal
- Centering: Flexbox with align-items and justify-center

**Vertical Rhythm:**
- Section gaps: 20-28px between major sections
- Input spacing: 16-18px padding
- Button padding: 14px vertical, 22px horizontal
- Card/Option gaps: 12-14px in grids

### D. Component Library

**Input Fields:**
- Border: 2px solid, rounded-lg (10px)
- Padding: 16px vertical, 18px horizontal
- Focus state: Accent border with 6px soft glow ring (rgba opacity ~0.22)
- Error state: Red border with error-colored focus ring
- Placeholder: Muted color at 60% opacity

**Buttons:**
- Primary: Accent background, white text, 10px border-radius
- Secondary: White/dark background, 2px border, same radius
- Hover: Slight translateY(-1px) and enhanced shadow
- Disabled: 40% opacity, no pointer events

**Option Cards (Radio/Checkbox):**
- Base: 2px border, 12px border-radius, subtle shadow
- Padding: 18px vertical, 22px horizontal
- Hover: translateY(-2px), enhanced shadow, stronger border
- Selected: Accent-tinted background, accent border
- Letter badges: 34px circle, panel background, 8px radius

**Theme Toggle:**
- Fixed position: top-right (20px spacing)
- 48px circular button (44px on mobile)
- Panel background with border
- Icon size: 24px
- Smooth icon transition between sun/moon

**Progress Bar:**
- Fixed top, full-width, 4px height
- Accent color with subtle glow shadow
- Smooth width transition (0.3s)

**Alert Boxes:**
- Panel background, 2px border, 12px radius
- 18px padding, flex layout with icon gap
- Warning variant: Amber tinted background and border
- Icon: 24px, flex-shrink: 0

**Results Display:**
- Card container: Border, 14px radius, 22px padding
- Result items: 14px vertical padding, bottom border (except last)
- Labels: 700 weight, muted, 0.9rem, uppercase tracking
- Values: 1.02rem, 700 weight, primary text color

### E. Interactions & Animations

**Page Transitions:**
- Question fade-in: opacity 0→1, translateY(24px→0), 0.45s ease
- Active state reveals with smooth timing

**Particle Effects:**
- Fixed full-viewport overlay, pointer-events: none
- 3px circular particles, accent colored
- Float animation: 18s linear, translate(80px, -90vh)
- Opacity: 0.12 light mode, 0.15 dark mode

**Micro-interactions:**
- Checkbox checkmark: Scale animation (0→1.2→1) in 0.3s
- Hover transforms: 2px lift with shadow enhancement
- Focus rings: Soft accent-colored glow (0 0 0 4-6px rgba)
- All transitions: 0.15-0.3s ease timing

**Theme Toggle:**
- Icon cross-fade on theme change
- 0.3s transition for background and colors
- Scale on hover (1.1x)

### F. Accessibility Features

- Semantic HTML with proper ARIA labels
- Focus-visible outlines (2px accent, 2px offset)
- Screen reader text (.sr-only utility)
- Sufficient color contrast in both themes
- Large touch targets (minimum 44x44px)
- Keyboard navigation support
- Progress bar with ARIA attributes

### G. Responsive Behavior

**Breakpoint: 768px**

**Mobile Adjustments:**
- Hero heading: 1.6rem (from 2.1rem)
- Subtitle: 1rem (from 1.075rem)
- Input text: 1rem (from 1.05rem)
- Options: 1rem text, 16px/18px padding
- Theme toggle: 44px (from 48px), 16px spacing
- Maintain vertical spacing but slightly reduced
- Full-width buttons, maintain gaps

**Desktop:**
- Larger hero icon: 120x120px
- Spacious padding and margins
- Enhanced shadow effects
- Particle density optimized for larger screens

## Images

**Hero Icon:** Not a photographic image but rather an SVG icon illustration (layered books/documents symbol) displayed in a 120x120px rounded square container with accent-tinted background. The icon itself is 60x60px, stroke-based in accent color.

**No Large Hero Image:** This form-focused application does not use photographic hero imagery. The visual impact comes from the particle animation background, clean typography, and the small decorative hero icon.

## Critical Implementation Notes

- Maintain 2px borders throughout for visual consistency
- Use box-shadow layering: sm for resting state, md for elevated/hover
- Ensure smooth theme transitions affect all color properties
- Keep particle opacity low to avoid distraction
- Preserve the green accent across both themes without variation
- Input validation should show inline error messages below fields
- Progress bar width updates with each question transition
- Results screen displays all collected data in organized card format