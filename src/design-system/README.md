# Design System

This directory contains the design tokens and assets exported from Figma, organized for use in the React application.

## Structure

```
design-system/
├── tokens/          # Design tokens (colors, typography, spacing)
├── assets/          # Images, icons, and other static assets
└── styles/          # Global CSS and utility styles
```

## Usage

### Design Tokens

Design tokens are available as TypeScript objects with full type safety:

```tsx
import { tokens, lightColors, darkColors, getCurrentColors } from '@/design-system/tokens';

// Access specific token categories
const colors = getCurrentColors(); // Gets current theme colors
const { typography, spacing } = tokens;

// Use in components
const buttonStyles = {
  backgroundColor: colors.primary,
  color: colors.primaryForeground,
  borderRadius: spacing.radius.md,
  fontFamily: typography.fontFamily.primary,
  fontSize: typography.fontSize.md
};
```

### Color Tokens

Colors are defined in both light and dark themes:
- Primary brand colors: `primary`, `primaryForeground`
- Secondary colors: `secondary`, `secondaryForeground`
- UI colors: `background`, `foreground`, `border`, `input`
- Semantic colors: `destructive`, `muted`, `accent`
- Chart colors: `chart1` through `chart5`

### Typography Tokens

Typography tokens include:
- Font families: `fontFamily.primary`
- Font sizes: `fontSize.xs` through `fontSize.4xl`
- Font weights: `fontWeight.normal`, `medium`, `semibold`, `bold`
- Line heights: `lineHeight.tight`, `normal`, `relaxed`

### Spacing Tokens

Spacing tokens provide consistent spacing and border radius values:
- Border radius: `radius.sm` through `radius.full`
- Spacing: `spacing.1` (4px) through `spacing.64` (256px)

## Figma Integration

The design tokens are synchronized with Figma variables. When updating from Figma:

1. Export the updated CSS variables from Figma
2. Update `styles/globals.css` with the new values
3. Update the corresponding TypeScript token files if needed
4. Test that all components render correctly with the new tokens

## Component Mapping

The application uses shadcn/ui components styled with these Figma tokens. See the component mapping documentation for details on which Figma components map to which React components.
