# Figma to React Component Mapping

This document maps Figma components to their React/shadcn/ui implementations.

## Component Mapping Table

| Figma Component | React Component | Location | Notes |
|-----------------|-----------------|----------|-------|
| **Button** | `Button` | `@/components/ui/button` | Uses Figma color tokens |
| **Input Field** | `Input` | `@/components/ui/input` | Custom background from tokens |
| **Select/Dropdown** | `Select` | `@/components/ui/select` | Styled with Figma tokens |
| **Card** | `Card` | `@/components/ui/card` | Uses card/cardForeground tokens |
| **Badge/Tag** | `Badge` | `@/components/ui/badge` | Custom variants added |
| **Table** | `Table` | `@/components/ui/table` | Filing data tables |
| **Dialog/Modal** | `Dialog` | `@/components/ui/dialog` | Popover tokens applied |
| **Sidebar Navigation** | `Sidebar` + custom | `@/components/ui/sidebar` + `@/components/Sidebar` | Custom implementation |
| **Header Bar** | `Header` (custom) | `@/components/Header` | Custom component |
| **Filing Card** | `FilingCard` (custom) | `@/components/FilingCard` | Custom card variant |

## Design Token Integration

All components use the Figma design tokens defined in `globals.css`:

### Color Mappings

```css
/* Figma Variable -> CSS Variable -> Component Usage */
Primary Color -> --primary (#385854) -> Button primary variant
Background -> --background -> Page backgrounds
Card Background -> --card -> Card components
Muted -> --muted (#ececf0) -> Disabled states, secondary text
Destructive -> --destructive (#d4183d) -> Error states, delete actions
```

### Component Customizations

#### Button Component

The shadcn Button component is extended with Figma-specific variants:

```tsx
// Figma variants mapped to Button variants
<Button variant="default">  // Uses --primary
<Button variant="secondary"> // Uses --secondary  
<Button variant="destructive"> // Uses --destructive
<Button variant="outline">  // Uses --border
<Button variant="ghost">    // Transparent with hover state
```

#### Input Component

Custom styling applied via globals.css:

```css
/* Figma Input styling */
--input: transparent;
--input-background: #f3f3f5;
```

#### Card Component

Uses Figma card tokens:

```css
--card: #ffffff;
--card-foreground: oklch(0.145 0 0);
```

## Custom Components

### FilingCard

A custom component that combines:
- shadcn Card for structure
- Figma color tokens for styling
- Custom layout for bankruptcy filing data

### Dashboard

Custom implementation using:
- shadcn UI primitives (Button, Badge, Select, Input)
- Figma layout patterns
- Custom data visualization

### Sidebar

Hybrid approach:
- shadcn/ui sidebar for base functionality
- Custom styling with Figma sidebar tokens
- Custom menu items and navigation

## Styling Approach

### 1. Base Components (shadcn/ui)

All shadcn/ui components automatically use Figma tokens through CSS variables:

```tsx
// No additional styling needed - uses CSS variables
<Button>Click me</Button>
<Input placeholder="Search..." />
<Card>Content</Card>
```

### 2. Custom Styling

When Figma designs require modifications:

```tsx
// Using Tailwind classes with Figma tokens
<div className="bg-primary text-primary-foreground rounded-[var(--radius)]">
  Custom styled element
</div>

// Using design system tokens in components
import { tokens } from '@/design-system/tokens';

const customStyle = {
  fontFamily: tokens.typography.fontFamily.primary,
  borderRadius: tokens.spacing.radius.md
};
```

### 3. Component Variants

Extend shadcn components with custom variants:

```tsx
// Example: Custom FilingCard variant
<Card className="border-2 border-primary/10 hover:border-primary/20">
  <CardHeader className="bg-muted/50">
    <CardTitle>Filing Details</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

## Figma Export Workflow

### For New Components

1. **Design in Figma**
   - Use consistent naming (match React component names)
   - Apply Figma variables for colors and spacing
   - Use Auto Layout for responsive behavior

2. **Export from Figma**
   - Dev Mode: Get CSS properties
   - Export assets to `/public/assets/`
   - Copy color values to update tokens if needed

3. **Implement in React**
   - Check if shadcn/ui component exists
   - If yes: Apply custom className or variants
   - If no: Create custom component using primitives

### For Updates

1. **Update in Figma**
   - Modify the design
   - Update variables if needed

2. **Sync to React**
   - Update `globals.css` with new token values
   - Update TypeScript token definitions
   - Test all affected components

## Best Practices

### DO:
- ✅ Use existing shadcn/ui components when possible
- ✅ Apply Figma tokens via CSS variables
- ✅ Create custom variants rather than new components
- ✅ Keep component names synchronized between Figma and React
- ✅ Document any custom modifications

### DON'T:
- ❌ Override CSS variables with hardcoded values
- ❌ Create duplicate components when shadcn/ui has one
- ❌ Mix different token systems (stick to Figma tokens)
- ❌ Forget to test in both light and dark modes

## Component Status

| Component | Figma | React | Synced | Notes |
|-----------|-------|-------|--------|-------|
| Button | ✅ | ✅ | ✅ | Fully synced |
| Input | ✅ | ✅ | ✅ | Fully synced |
| Card | ✅ | ✅ | ✅ | Fully synced |
| Badge | ✅ | ✅ | ✅ | Fully synced |
| Select | ✅ | ✅ | ✅ | Fully synced |
| Table | ✅ | ✅ | ✅ | Fully synced |
| Dialog | ✅ | ✅ | ✅ | Fully synced |
| Sidebar | ✅ | ✅ | ⚠️ | Custom implementation |
| Header | ✅ | ✅ | ⚠️ | Custom implementation |
| FilingCard | ✅ | ✅ | ⚠️ | Custom component |
| Dashboard | ✅ | ✅ | ⚠️ | Custom layout |

Legend:
- ✅ Complete
- ⚠️ Partial/Custom
- ❌ Not implemented
