# HireDesk Typography Guide

## Font Selection

### Why Not Google Sans?
Google Sans is a proprietary font exclusively licensed for Google's products and services. It's not available for public use or download. Using it without permission would violate Google's intellectual property rights.

### Our Choice: Roboto
We've implemented **Roboto** as the primary font for HireDesk because:
- ✅ Created by Google (same design team)
- ✅ Open source and free to use
- ✅ Similar clean, modern aesthetic to Google Sans
- ✅ Excellent readability across all devices
- ✅ Supports multiple weights (300, 400, 500, 700)
- ✅ Widely recognized and trusted

## Implementation Details

### Font Loading
Roboto is loaded via Google Fonts in `_document.tsx`:
```typescript
<link
  href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
  rel="stylesheet"
/>
```

### Typography Scale
Our typography system follows Material Design principles:

- **H1**: 300 weight, 2.5rem
- **H2**: 300 weight, 2rem
- **H3**: 400 weight, 1.75rem
- **H4**: 400 weight, 1.5rem
- **H5**: 400 weight, 1.25rem
- **H6**: 500 weight, 1rem
- **Body**: 400 weight, 1rem/0.875rem
- **Button**: 500 weight, 0.875rem

### Letter Spacing
We've implemented precise letter-spacing values that match Google's Material Design specifications for optimal readability.

## Visual Result
The combination of Roboto font with our Material-UI theme creates a professional, modern interface that's:
- Clean and minimalist
- Highly readable
- Consistent with Google's design language
- Professional for an enterprise rental platform

## Additional Resources
- [Roboto on Google Fonts](https://fonts.google.com/specimen/Roboto)
- [Material Design Typography](https://material.io/design/typography/)
- [Google Design](https://design.google/) 