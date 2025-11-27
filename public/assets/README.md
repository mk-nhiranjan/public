# Public Assets Directory

This directory contains static assets that are served directly by the web server.

## Structure

```
public/assets/
├── images/      # Raster images (PNG, JPG, WebP)
├── icons/       # SVG icons  
└── README.md    # This file
```

## How to Add Assets from Figma

1. **Export from Figma**:
   - Open your Figma file
   - Select the asset you want to export
   - Press Cmd/Ctrl + Shift + E or use the Export panel
   - Choose the appropriate format and scale
   - Save to the corresponding directory here

2. **Optimize before committing**:
   - Images: Use compression tools (TinyPNG, ImageOptim)
   - SVGs: Use SVGO for optimization
   - Keep file sizes under 500KB when possible

3. **Naming**:
   - Use kebab-case: `my-image-name.png`
   - Be descriptive: `dashboard-header-bg.jpg`
   - Include size for variants: `logo-sm.svg`, `logo-lg.svg`

## Usage

Assets in this directory are accessible via the `/assets` path:

```tsx
// In React components
<img src="/assets/images/logo.png" alt="Logo" />
<img src="/assets/icons/menu.svg" alt="Menu" />

// In CSS
background-image: url('/assets/images/background.jpg');
```

## File Size Guidelines

- **Icons**: < 10KB (SVG preferred)
- **Logos**: < 50KB
- **Images**: < 500KB (use WebP when possible)
- **Hero images**: < 1MB (consider lazy loading)

## Notes

- Assets here are publicly accessible
- They are not processed by Webpack/Vite
- Use the `src/design-system/assets` directory for assets that need processing
