# Design System Assets

This directory contains all visual assets exported from Figma.

## Directory Structure

```
assets/
├── images/      # Raster images (PNG, JPG, WebP)
├── icons/       # SVG icons
└── logos/       # Brand logos
```

## Figma Export Guidelines

### Exporting Images

1. Select the image/frame in Figma
2. Use Export settings:
   - PNG: 2x for retina displays
   - JPG: For photos (quality 80-90%)
   - WebP: For modern browsers (preferred)
3. Name files using kebab-case: `hero-background.png`

### Exporting Icons

1. Select the icon in Figma
2. Export as SVG with these settings:
   - Include "id" attribute: OFF
   - Outline text: ON
   - Outline strokes: ON (if applicable)
   - Simplify: ON
3. Name icons descriptively: `arrow-right.svg`, `user-profile.svg`

### Exporting from Figma Dev Mode

1. Open Dev Mode in Figma (Shift + D)
2. Select the component/frame
3. In the right panel, find "Export"
4. Choose appropriate format and scale
5. Copy to clipboard or download

## Usage in React

### Using Images

```tsx
// Import from public directory
<img src="/assets/images/hero-background.png" alt="Hero" />

// Or use the ImageWithFallback component for error handling
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';

<ImageWithFallback 
  src="/assets/images/hero-background.png" 
  alt="Hero background"
  className="w-full h-auto"
/>
```

### Using SVG Icons

```tsx
// As an image
<img src="/assets/icons/arrow-right.svg" alt="Arrow" />

// Or import as React component (requires @svgr/webpack)
import { ReactComponent as ArrowIcon } from '@/design-system/assets/icons/arrow-right.svg';

<ArrowIcon className="w-6 h-6 text-primary" />
```

## Asset Optimization

Before adding assets to the repository:

1. **Images**: 
   - Compress using tools like TinyPNG or ImageOptim
   - Use appropriate formats (WebP for modern support, PNG/JPG fallbacks)
   - Consider responsive sizes

2. **SVG Icons**:
   - Optimize with SVGO
   - Remove unnecessary attributes
   - Ensure consistent viewBox

## Naming Conventions

- Use lowercase kebab-case: `my-asset-name.ext`
- Be descriptive: `checkout-success-illustration.svg`
- Include context: `icon-`, `logo-`, `bg-`, `hero-`
- Version variants: `logo-light.svg`, `logo-dark.svg`
