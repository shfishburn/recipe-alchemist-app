
# Recipe Alchemy Design System

## Design Language

Recipe Alchemy uses a consistent design language built on a foundation of:

### Core Visual Elements

- **Typography**: Clean, readable fonts with clear hierarchy
- **Color Palette**: Purple-centric with complementary accent colors
- **Iconography**: Lucide React icons for consistent visual language
- **Spacing**: Systematic spacing using Tailwind's spacing scale
- **Shadows**: Subtle shadows for depth and elevation
- **Borders**: Light borders and rounded corners for definition
- **Animation**: Subtle animations for improved user experience

### Colors

The primary palette consists of:

- **Primary Purple**: `#9b87f5` - Used for primary actions, highlights, and brand identity
- **Secondary Purple**: `#7E69AB` - Used for secondary elements and hover states
- **Tertiary Purple**: `#6E59A5` - Used for tertiary elements
- **Dark Purple**: `#1A1F2C` - Used for text and dark backgrounds
- **Supporting Colors**:
  - Green (`#59a52c`, `#04a118`) - Used for success states and highlights
  - Orange (`#fb923c`) - Used for warnings and attention-grabbing elements
  - Yellow (`#facc15`) - Used for highlights and decorative elements
  - Teal (`#14b8a6`) - Used for information and categories
  - Amber (`#d97706`) - Used for dietary indicators

### Typography

- **Primary Font**: System font stack for optimal performance and native feel
- **Headings**: Bold weight with slightly reduced letter spacing
- **Body Text**: Regular weight with comfortable line height for readability
- **Responsive Sizing**: Font sizes scale appropriately across different screen sizes

## Layout System

### Page Structure

Recipe Alchemy uses a structured layout system with:

1. **Container Classes**: 
   - `container-page`: Main container with responsive padding
   - `content-width-default`: Standard content width (max-width: 4xl)
   - `content-width-narrow`: Narrower content width for forms (max-width: 2xl)
   - `content-width-full`: Full-width content (max-width: 7xl)

2. **Spacing System**:
   - `section-spacing`: Consistent vertical padding for page sections
   - `spacing-y-responsive`: Responsive vertical spacing between elements
   - `spacing-x-responsive`: Responsive horizontal spacing between elements

3. **Responsive Behavior**:
   - Mobile-first approach with breakpoints at sm (640px), md (768px), lg (1024px)
   - Adaptive layouts that reflow content appropriately at different screen sizes
   - Touch-optimized spacing on mobile devices

### Component Layout

- **Card Layout**: Consistent card styling with `recipe-card` class
- **Form Layout**: Standardized form field spacing and alignment
- **List Layout**: Consistent list styling with appropriate spacing
- **Grid Layout**: Flexible grid system using Tailwind's grid utilities

## CSS Architecture

### Organization

The CSS is organized into modular files:

```
src/styles/
├── index.css          # Main entry point
├── main.css           # Global styles and imports
├── theme.css          # Theme variables
├── components.css     # Component-specific imports
├── layout.css         # Layout utilities
├── buttons.css        # Button styles
├── forms.css          # Form styles
├── cards.css          # Card styles
├── touch.css          # Touch optimization
├── scientific-content.css # Science content styling
├── carousel/          # Carousel-specific styles
│   ├── index.css      # Main carousel entry
│   ├── base.css       # Base carousel styles
│   ├── navigation.css # Carousel navigation
│   ├── pagination.css # Carousel pagination
│   ├── progress.css   # Carousel progress
│   ├── mobile.css     # Mobile optimizations
│   └── misc.css       # Miscellaneous carousel styles
└── transitions.css    # Animation and transitions
```

### CSS Methodology

Recipe Alchemy uses a hybrid approach:

1. **Tailwind Utilities**: Primary styling method using Tailwind's utility classes
2. **Component Classes**: Custom component-specific classes for complex components
3. **CSS Variables**: Theme values stored as CSS variables for consistent theming
4. **Responsive Utilities**: Mobile-first responsive classes

### Key CSS Features

- **Touch Optimization**: Special classes for touch targets and feedback
- **Animations**: Subtle animations for improved UX
- **Accessibility**: High-contrast colors and appropriate focus states
- **Dark Mode Support**: Theme variables support light/dark mode switching
- **Performance Optimizations**: Hardware acceleration for smooth animations

### Naming Conventions

- **BEM-like for Component Classes**: `component__element--modifier` pattern for custom classes
- **Tailwind Utilities**: Standard Tailwind naming for utility classes
- **Descriptive Variable Names**: Clear, purpose-indicating names for CSS variables

## UI Components

Recipe Alchemy uses a component library built on Shadcn UI, with custom components for specific needs:

- **Core UI Components**: Buttons, inputs, cards, etc. from Shadcn UI
- **Recipe-Specific Components**: Custom components for recipe display, nutrition visualization
- **Form Components**: Enhanced form controls with validation states
- **Data Visualization**: Charts and graphs for nutrition data

## Mobile & Responsive Design

- **Mobile-First Approach**: Designed for mobile first, then enhanced for larger screens
- **Touch-Optimized Controls**: Larger touch targets on mobile devices
- **Responsive Typography**: Font sizes adjust based on screen size
- **Adaptive Layouts**: Layouts reflow appropriately at different breakpoints
- **Performance Optimizations**: Special considerations for mobile performance
