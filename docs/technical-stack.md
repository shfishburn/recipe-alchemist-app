
# Recipe Alchemy Technical Stack

## Core Technologies

- **React**: Front-end library for building the user interface
- **TypeScript**: Type-safe JavaScript for improved developer experience and code quality
- **Vite**: Build tool and development server for fast development and optimized production builds
- **Tailwind CSS**: Utility-first CSS framework for styling

## UI Framework

- **Shadcn UI**: Component library built on Radix UI primitives
- **Radix UI**: Headless UI components for building accessible interfaces
  - Accordion, Alert Dialog, Avatar, Badge, Button, Calendar, etc.

## State Management

- **React Query (TanStack Query)**: Data fetching, caching, and state management
  - Used for all API requests with automatic caching and revalidation
- **Zustand**: Lightweight state management for global application state
  - Used for managing UI state across components

## Routing

- **React Router**: Client-side routing for single-page application
  - Used for navigation between pages without full page reloads

## Data Visualization

- **Recharts**: Charting library for nutrition data visualization
  - Used for macronutrient distribution charts, nutrition analysis, etc.

## Form Handling

- **React Hook Form**: Form state management and validation
- **Zod**: Schema validation library for form validation
  - Used in conjunction with React Hook Form for type-safe validation

## Animation & UI Effects

- **Framer Motion**: Animation library for React
  - Used for transitions, micro-interactions, and page transitions
- **Tailwind CSS Animate**: Animation utilities integrated with Tailwind
  - Used for simple animations and transitions

## Utility Libraries

- **date-fns**: Date formatting and manipulation
- **clsx** and **tailwind-merge**: Conditional class name utilities
- **Lucide React**: Icon library with React components
  - Used for consistent iconography throughout the application

## Backend Integration

- **Supabase JS Client**: Integration with Supabase backend services
  - Authentication, database, storage, and edge functions

## Development Tools

- **ESLint**: Code linting for consistent code quality
- **Prettier**: Code formatting for consistent style
- **Vitest**: Unit testing framework
- **React Testing Library**: Component testing utilities

## Package Management

All packages are managed via npm with strict version control to ensure consistent behavior across environments.

## Key Package Versions

- React: v18.3.1
- React DOM: v18.3.1
- TypeScript: Latest stable
- Tailwind CSS: Latest stable
- React Router DOM: v6.26.2
- TanStack React Query: v5.56.2
- Radix UI components: v1.x and v2.x (component dependent)
- Lucide React: v0.462.0
- React Hook Form: v7.53.0
- Zod: v3.23.8
- Recharts: v2.12.7
- date-fns: v3.6.0

## Package Organization

The project uses a standard npm package structure with:

- **Dependencies**: Production dependencies
- **DevDependencies**: Development-only dependencies

### Core Dependencies

```json
{
  "@hookform/resolvers": "^3.9.0",
  "@radix-ui/*": "^1.x and ^2.x",
  "@supabase/supabase-js": "^2.49.4",
  "@tanstack/react-query": "^5.56.2",
  "date-fns": "^3.6.0",
  "lucide-react": "^0.462.0",
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-hook-form": "^7.53.0",
  "react-router-dom": "^6.26.2",
  "recharts": "^2.12.7",
  "tailwind-merge": "^2.5.2",
  "tailwindcss-animate": "^1.0.7",
  "zod": "^3.23.8"
}
```

## Directory Structure

The application follows a feature-based organization:

```
src/
├── api/              # API clients and utilities
├── components/       # React components
│   ├── ui/           # Reusable UI components
│   ├── layout/       # Layout components
│   ├── recipe-detail/ # Recipe detail components
│   ├── quick-recipe/ # Quick recipe components
│   └── ...           # Other feature directories
├── contexts/         # React contexts
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
├── styles/           # CSS and style files
└── main.tsx          # Application entry point
```
