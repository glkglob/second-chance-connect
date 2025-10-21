# Design Tokens Documentation

This document outlines the design system tokens used throughout Second Chance Connect.

## Color System

### Brand Colors

#### Primary (Navy Blue)
- **Hex**: `#003366`
- **OKLCH**: `oklch(0.25 0.08 250)`
- **Usage**: Primary actions, headers, navigation, brand elements
- **Meaning**: Trust, professionalism, stability, authority
- **Contrast**: White text (WCAG-AAA compliant)

#### Secondary (Light Blue)
- **Hex**: `#4A90E2`
- **OKLCH**: `oklch(0.62 0.12 240)`
- **Usage**: Secondary actions, highlights, links, progress indicators
- **Meaning**: Hope, opportunity, progress, accessibility
- **Contrast**: White text (WCAG-AA compliant)

### Neutral Colors

#### Background
- **Light Mode**: `#F4F6F8` - `oklch(0.98 0 0)`
- **Dark Mode**: `#212529` - `oklch(0.15 0 0)`
- **Usage**: Page backgrounds, large surfaces

#### Foreground (Text)
- **Light Mode**: `#212529` - `oklch(0.15 0 0)`
- **Dark Mode**: `#FFFFFF` - `oklch(0.98 0 0)`
- **Usage**: Primary text content

#### Muted
- **Light Mode**: `oklch(0.95 0 0)`
- **Dark Mode**: `oklch(0.22 0 0)`
- **Usage**: Subtle backgrounds, disabled states

#### Muted Foreground
- **Light Mode**: `oklch(0.5 0 0)`
- **Dark Mode**: `oklch(0.65 0 0)`
- **Usage**: Secondary text, captions, metadata

### Semantic Colors

#### Success (Green)
- **OKLCH**: `oklch(0.55 0.15 150)`
- **Usage**: Success messages, completed states, positive indicators
- **Contrast**: White text (WCAG-AA compliant)

#### Destructive (Red)
- **OKLCH**: `oklch(0.55 0.22 25)`
- **Usage**: Error messages, delete actions, warnings
- **Contrast**: White text (WCAG-AA compliant)

### UI Element Colors

#### Card
- **Light Mode**: `#FFFFFF` - `oklch(1 0 0)`
- **Dark Mode**: `oklch(0.18 0 0)`
- **Usage**: Card backgrounds, elevated surfaces

#### Border
- **Light Mode**: `oklch(0.88 0 0)`
- **Dark Mode**: `oklch(0.25 0 0)`
- **Usage**: Borders, dividers, separators

#### Input
- **Light Mode**: `oklch(0.88 0 0)`
- **Dark Mode**: `oklch(0.25 0 0)`
- **Usage**: Input field borders, form elements

#### Ring (Focus)
- **Light Mode**: `oklch(0.25 0.08 250)` (Primary)
- **Dark Mode**: `oklch(0.62 0.12 240)` (Secondary)
- **Usage**: Focus indicators, keyboard navigation

## Typography

### Font Family

#### Sans Serif (Primary)
- **Font**: Inter
- **Weights**: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
- **Usage**: All UI text, headings, body content
- **Fallback**: system-ui, -apple-system, sans-serif

#### Monospace
- **Font**: Geist Mono
- **Usage**: Code snippets, technical content
- **Fallback**: monospace

### Font Sizes

- **xs**: 0.75rem (12px)
- **sm**: 0.875rem (14px)
- **base**: 1rem (16px) - Minimum for body text
- **lg**: 1.125rem (18px)
- **xl**: 1.25rem (20px)
- **2xl**: 1.5rem (24px)
- **3xl**: 1.875rem (30px)
- **4xl**: 2.25rem (36px)
- **5xl**: 3rem (48px)
- **6xl**: 3.75rem (60px)

### Line Heights

- **Body Text**: 1.5-1.6 (leading-relaxed, leading-6)
- **Headings**: 1.2-1.3 (leading-tight)
- **Captions**: 1.4 (leading-snug)

### Font Weights

- **Regular**: 400 - Body text
- **Medium**: 500 - Emphasized text
- **Semibold**: 600 - Subheadings
- **Bold**: 700 - Headings, strong emphasis

## Spacing Scale

Based on Tailwind's default spacing scale (0.25rem = 4px base unit):

- **0**: 0px
- **1**: 0.25rem (4px)
- **2**: 0.5rem (8px)
- **3**: 0.75rem (12px)
- **4**: 1rem (16px)
- **5**: 1.25rem (20px)
- **6**: 1.5rem (24px)
- **8**: 2rem (32px)
- **10**: 2.5rem (40px)
- **12**: 3rem (48px)
- **16**: 4rem (64px)
- **20**: 5rem (80px)
- **24**: 6rem (96px)

## Border Radius

- **sm**: `calc(var(--radius) - 4px)` - Small elements
- **md**: `calc(var(--radius) - 2px)` - Medium elements
- **lg**: `var(--radius)` (0.5rem / 8px) - Default
- **xl**: `calc(var(--radius) + 4px)` - Large elements
- **full**: 9999px - Circular elements

## Breakpoints

Following Tailwind's default breakpoints:

- **sm**: 640px - Small tablets
- **md**: 768px - Tablets
- **lg**: 1024px - Laptops
- **xl**: 1280px - Desktops
- **2xl**: 1536px - Large desktops

## Accessibility Standards

### Contrast Ratios (WCAG-AA)

- **Normal Text**: Minimum 4.5:1
- **Large Text** (18px+ or 14px+ bold): Minimum 3:1
- **UI Components**: Minimum 3:1

### Touch Targets

- **Minimum Size**: 44x44px
- **Recommended**: 48x48px for primary actions
- **Spacing**: Minimum 8px between targets

### Focus Indicators

- **Visible**: Always visible when focused
- **Contrast**: Minimum 3:1 against background
- **Style**: 2px solid ring with offset

## Chart Colors

For data visualization:

1. **Chart 1**: Primary Navy - `oklch(0.25 0.08 250)`
2. **Chart 2**: Secondary Blue - `oklch(0.62 0.12 240)`
3. **Chart 3**: Success Green - `oklch(0.55 0.15 150)`
4. **Chart 4**: Accent Teal - `oklch(0.7 0.1 200)`
5. **Chart 5**: Accent Purple - `oklch(0.45 0.1 280)`

## Implementation

### CSS Variables

All design tokens are defined as CSS custom properties in `app/globals.css`:

\`\`\`css
:root {
  --primary: oklch(0.25 0.08 250);
  --secondary: oklch(0.62 0.12 240);
  /* ... other tokens */
}

.dark {
  --primary: oklch(0.62 0.12 240);
  --secondary: oklch(0.25 0.08 250);
  /* ... dark mode overrides */
}
\`\`\`

### Tailwind Configuration

Tokens are mapped to Tailwind utilities in the `@theme` directive:

\`\`\`css
@theme inline {
  --color-primary: var(--primary);
  --color-secondary: var(--secondary);
  /* ... other mappings */
}
\`\`\`

### Usage in Components

\`\`\`tsx
// Using semantic tokens
<div className="bg-primary text-primary-foreground">
  <h1 className="text-2xl font-bold">Heading</h1>
  <p className="text-muted-foreground">Description</p>
</div>

// Using spacing
<div className="p-6 space-y-4">
  <Button className="h-11 px-8">Action</Button>
</div>
\`\`\`

## Theme Switching

The application supports both light and dark themes:

- **Light Theme**: Default, optimized for daytime use
- **Dark Theme**: Reduced eye strain, better for low-light environments
- **System**: Follows user's OS preference

Theme switching is handled by the `theme-provider` component using `next-themes`.

## Best Practices

1. **Always use semantic tokens** instead of hard-coded colors
2. **Test contrast ratios** for all color combinations
3. **Maintain consistent spacing** using the spacing scale
4. **Use appropriate font sizes** (minimum 16px for body text)
5. **Ensure touch targets** meet minimum size requirements
6. **Test with screen readers** and keyboard navigation
7. **Provide focus indicators** for all interactive elements
8. **Use semantic HTML** with proper ARIA labels

---

Last updated: January 2025
