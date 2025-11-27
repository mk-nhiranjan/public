# Figma to React Quick Reference

## 🎨 Using Figma Design Tokens

```tsx
// Import tokens
import { tokens, getCurrentColors } from '@/design-system/tokens';

// Use in components
const colors = getCurrentColors();
const { typography, spacing } = tokens;

// Apply to elements
<div style={{ 
  color: colors.primary,
  fontFamily: typography.fontFamily.primary,
  borderRadius: spacing.radius.md 
}}>
```

## 🖼️ Working with Assets

```tsx
// Using images from Figma
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';

<ImageWithFallback 
  src="/assets/images/hero.png" 
  alt="Hero image"
  optimize // Enable WebP optimization
/>

// Using icons
<img src="/assets/icons/arrow.svg" alt="Arrow" />
```

## 🧩 Component Usage

### Button (from Figma design)
```tsx
import { Button } from '@/components/ui/button';

<Button variant="default">Primary Action</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Delete</Button>
```

### Input (with Figma styling)
```tsx
import { Input } from '@/components/ui/input';

<Input 
  placeholder="Search filings..."
  className="bg-input-background" // Uses Figma token
/>
```

### Card (Figma card design)
```tsx
import { Card, CardHeader, CardContent } from '@/components/ui/card';

<Card>
  <CardHeader>Title</CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

## 🎭 Theme Support

The design system supports light and dark themes:

```tsx
// Toggle theme class on <html>
document.documentElement.classList.toggle('dark');

// Components automatically adapt to theme
<div className="bg-background text-foreground">
  Auto-themed content
</div>
```

## 📐 Spacing & Layout

Use Figma spacing tokens:

```tsx
// Tailwind classes (configured with Figma values)
<div className="p-4 m-2 rounded-lg">

// Or use tokens directly
<div style={{ padding: spacing.spacing[4] }}>
```

## 🔄 Updating from Figma

1. **Export from Figma Dev Mode**
   - Select component → Dev Mode (Shift+D)
   - Copy CSS or export assets

2. **Update tokens if needed**
   - Edit `/src/styles/globals.css`
   - Update `/src/design-system/tokens/`

3. **Add new assets**
   - Images → `/public/assets/images/`
   - Icons → `/public/assets/icons/`

## 📝 Common Patterns

### Filing Card (Custom Figma Component)
```tsx
<FilingCard 
  filing={{
    debtorName: "Company Name",
    caseNumber: "24-12345",
    chapter: "11",
    // ...
  }}
  onClick={handleClick}
/>
```

### Dashboard Layout
```tsx
<div className="flex">
  <Sidebar />
  <main className="flex-1">
    <Header />
    <Dashboard />
  </main>
</div>
```

## 🚀 Best Practices

1. **Always use design tokens** - Don't hardcode colors
2. **Prefer shadcn/ui components** - They're pre-styled with tokens
3. **Optimize images** - Use ImageWithFallback component
4. **Keep names consistent** - Match Figma layer names
5. **Test both themes** - Ensure dark mode works

## 📂 File Structure

```
/frontend/src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   └── figma/          # Figma-specific components
├── design-system/       # Design tokens & assets
│   ├── tokens/         # TypeScript token definitions
│   ├── assets/         # Documentation for assets
│   └── styles/         # Global styles
└── public/assets/      # Static assets from Figma
    ├── images/
    └── icons/
```

## 🔗 Resources

- [Component Mapping](./COMPONENT_MAPPING.md) - Full component reference
- [Design Tokens](./tokens/README.md) - Token documentation  
- [Assets Guide](./assets/README.md) - Asset management
- [Figma File](https://www.figma.com/design/kdrGPCLsd90g89RubUxwpB/) - Source designs
