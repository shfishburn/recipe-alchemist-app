
# Technical Stack

This document provides a comprehensive overview of the technologies, libraries, and architecture patterns used in the Recipe Alchemy application.

## Core Technologies

### Frontend Framework

- **React (v18.3.1+)** - Component-based UI library providing declarative rendering and efficient DOM updates
- **TypeScript (v5)** - Strongly typed programming language built on JavaScript

### Build and Development

- **Vite** - Modern build tool and development server with HMR (Hot Module Replacement)
- **ESLint** - JavaScript/TypeScript linter for code quality and consistency
- **PostCSS** - Tool for transforming CSS with JavaScript plugins

### Styling

- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **CSS Modules** - Component-scoped CSS to avoid style conflicts
- **PostCSS plugins** - For advanced CSS processing and optimization

## UI Component Libraries

### Base Component System

- **Shadcn UI** - Component collection built on Radix UI
- **Radix UI (v1+)** - Unstyled, accessible component primitives
  - Provides accessibility features like proper ARIA attributes, keyboard navigation, and focus management
  - Low-level primitives like Dialog, Dropdown, Tooltip, etc.

### Icon System

- **Lucide React (v0.462.0+)** - Comprehensive icon library
  - Tree-shakable import system
  - Customizable icon properties (size, color, stroke width)
  - Accessibility support

## State Management

### Client-side State

- **React Context** - For shared global state
- **Custom Hooks** - For component-level and shared logic
- **Zustand (v5.0.3+)** - Lightweight state management with a simple API

### Server State

- **TanStack Query (v5.56.2+)** - Data fetching, caching, and state management
  - Handles loading, error, and success states
  - Automatic retries and refetching
  - Cache invalidation and background updates
  - Pagination and infinite scrolling support

## Routing and Navigation

- **React Router (v6.26.2+)** - Client-side routing
  - Declarative routing with nested routes
  - Route-based code splitting
  - Programmatic navigation

## Form Handling

- **React Hook Form (v7.53.0+)** - Form state and validation library
  - Uncontrolled components for better performance
  - Built-in validation
  - Error handling

- **Zod (v3.23.8+)** - TypeScript-first schema validation
  - Type inference
  - Detailed error messages
  - Composable validation schemas

## Data Visualization

- **Recharts (v2.12.7+)** - Composable charting library for React
  - Built on D3.js
  - Responsive charts
  - Customizable styling
  - Animation support

## Animation

- **Framer Motion (v6.5.1+)** - Animation library for React
  - Declarative animations
  - Gesture support
  - Layout animations
  - Exit animations

- **Tailwind CSS Animate** - Animation utilities for Tailwind
  - Keyframe definitions
  - Animation utilities
  - Transition utilities

## UI Enhancement Libraries

- **Embla Carousel (v8.3.0+)** - Carousel/slider library
  - Touch support
  - Responsive design
  - Customizable options

- **React Day Picker (v8.10.1+)** - Flexible date picker
  - Customizable styling
  - Range selection
  - Accessibility support

- **Vaul (v1.1.2+)** - Drawer component for mobile interfaces
  - Spring animations
  - Touch gestures
  - Customizable behavior

- **Sonner (v1.5.0+)** - Toast notification system
  - Stacked notifications
  - Custom rendering
  - Accessibility support

- **CMDK (v1.0.0+)** - Command palette interface
  - Keyboard navigation
  - Fuzzy search
  - Customizable rendering

- **React Select (v5.10.1+)** - Enhanced select inputs
  - Searchable options
  - Multi-select support
  - Async loading

## Authentication and Backend

- **Supabase JS (v2.49.4+)** - Client library for Supabase
  - Authentication
  - Database operations
  - Storage integration
  - Realtime subscriptions

## Utilities and Helpers

- **Date-fns (v3.6.0+)** - Date utility library
  - Date formatting
  - Date parsing
  - Date arithmetic
  - Timezone support

- **Class Variance Authority (v0.7.1+)** - For building UI component variants
  - Type-safe variants
  - Conditional class composition

- **Tailwind Merge (v2.5.2+)** - Utility for merging Tailwind CSS classes
  - Prevents class conflicts
  - Handles complex class combinations

- **CLSX (v2.1.1)** - Utility for constructing className strings
  - Conditional class addition
  - Array and object support

## Developer Experience

- **React DevTools** - Chrome/Firefox extension for React debugging
  - Component inspection
  - State inspection
  - Performance profiling

- **TypeScript** - For type safety and better developer experience
  - Type definitions
  - Code completion
  - Error prevention
  - Documentation

## Accessibility Support

- **ARIA Attributes** - For enhanced accessibility
  - Screen reader support
  - Keyboard navigation
  - Focus management

- **Radix UI Primitives** - Accessible by default
  - WCAG 2.1 compliant
  - Keyboard navigation
  - Screen reader announcements

## Architecture Patterns

### Component Structure

The application follows these component organization patterns:

1. **Atomic Design Methodology**
   - Atoms: Smallest UI components like buttons, inputs
   - Molecules: Groups of atoms like form fields with labels
   - Organisms: Complex UI components like navigation bars
   - Templates: Page layouts without specific content
   - Pages: Complete page implementations

2. **Feature-based Organization**
   - Components are grouped by feature/domain
   - Shared components in common directories
   - Feature-specific components co-located with feature code

### Code Organization

```
src/
├── components/         # UI components
│   ├── ui/             # Base UI components
│   ├── layout/         # Layout components
│   ├── recipe-detail/  # Recipe detail components
│   ├── quick-recipe/   # Quick recipe components
│   └── ...
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── api/                # API integration
├── types/              # TypeScript type definitions
├── styles/             # Global styles and theming
├── store/              # State management
└── ...
```

## Performance Optimizations

- **React.memo** - For preventing unnecessary re-renders
- **Code splitting** - For reducing initial bundle size
- **Dynamic imports** - For lazy-loading components
- **Image optimization** - For faster page loads
- **Virtualization** - For rendering large lists efficiently

## Testing Approach

- **Jest** - Testing framework
- **React Testing Library** - For testing React components
- **Cypress** - For end-to-end testing

## Package Management

- **npm/yarn/pnpm** - For dependency management
- **package.json** - For dependency declarations
- **lockfiles** - For deterministic dependency resolution

## Deployment and Hosting

- **CI/CD Pipeline** - For automated testing and deployment
- **Environment configuration** - For environment-specific settings
- **Static hosting** - For serving the frontend application

## API Integration

- **REST API** - For data fetching
- **OpenAI API** - For AI-powered recipe generation
- **Supabase API** - For database operations

## Additional Resources

- [Component Documentation](./design/components.md) - Detailed component API documentation
- [Architecture Documentation](./architecture/system-architecture.md) - System architecture overview
- [Accessibility Guidelines](./design/accessibility.md) - Accessibility standards and implementation

This technical stack is continuously evolving as we adopt new tools and techniques to improve the application.
