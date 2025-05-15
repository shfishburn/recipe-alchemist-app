
# Getting Started with Recipe Alchemy Development

This guide helps new developers get set up with the Recipe Alchemy codebase and start contributing effectively.

## Development Environment Setup

### Prerequisites

Before you begin, make sure you have:

- Node.js (v16+)
- npm (v8+) or Yarn (v1.22+)
- Git
- A Supabase account (for backend access)
- An OpenAI API key (for development)

### Repository Setup

Clone the repository and install dependencies:

```bash
# Clone the repository
git clone https://github.com/your-org/recipe-alchemy.git

# Navigate to the project directory
cd recipe-alchemy

# Install dependencies
npm install
```

### Environment Configuration

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Update the following variables in `.env.local`:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   OPENAI_API_KEY=your_openai_api_key
   ```

3. Additional environment setups for specific features:
   ```
   NUTRITION_API_URL=nutrition_api_endpoint
   FEATURE_FLAGS={"enableScienceContent":true,"betaFeatures":false}
   ```

### Running the Development Server

Start the local development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173/`

### Running Tests

Execute the test suite:

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific tests
npm test -- RecipeGeneration
```

## Project Structure

Recipe Alchemy follows a feature-based organization pattern:

```
src/
├── api/               # API clients and utilities
├── components/        # React components
│   ├── ui/            # Reusable UI components
│   ├── recipe-detail/ # Recipe detail components
│   ├── quick-recipe/  # Quick recipe components
│   └── ...            # Other feature directories
├── hooks/             # Custom React hooks
├── stores/            # State management
├── utils/             # Utility functions
├── types/             # TypeScript type definitions
├── styles/            # CSS and styling
└── main.tsx           # Application entry point
```

### Key Directories

- **api/**: Contains API client code for backend services
- **components/**: React components organized by feature
- **hooks/**: Custom React hooks for shared logic
- **utils/**: Shared utility functions
- **styles/**: CSS and styling files
- **types/**: TypeScript interfaces and type definitions

## Key Technologies

Recipe Alchemy is built with:

- **React**: UI library
- **TypeScript**: Type-safe JavaScript
- **Vite**: Build tool and development server
- **Tailwind CSS**: Utility-first styling
- **Shadcn UI**: Component framework
- **React Query**: Data fetching and caching
- **Zustand**: State management
- **Supabase**: Backend services
- **OpenAI API**: AI capabilities

## Development Workflow

### Branching Strategy

We follow a feature branch workflow:

1. Create a new branch from `main` for your feature/fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes, committing regularly with descriptive messages

3. Push your branch and create a pull request:
   ```bash
   git push -u origin feature/your-feature-name
   ```

### Pull Request Process

1. Ensure your code passes all tests
2. Update documentation as needed
3. Get at least one code review
4. Squash commits before merging

### Code Style

Recipe Alchemy uses ESLint and Prettier for code formatting:

```bash
# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

## Common Development Tasks

### Creating a New Component

1. Create a new file in the appropriate directory
2. Use the component template pattern:

```tsx
import React from 'react';

interface MyComponentProps {
  // Define props here
}

export function MyComponent({ prop1, prop2 }: MyComponentProps) {
  // Component logic

  return (
    <div>
      {/* Component JSX */}
    </div>
  );
}
```

### Working with AI Features

When working with AI-powered features:

1. Use the OpenAI client from `api/openai-client.ts`
2. Handle errors and loading states appropriately
3. Implement proper fallbacks for API failures
4. Consider token usage and optimization

### Adding a New API Endpoint

1. Create a new edge function in the `supabase/functions` directory
2. Implement the API logic
3. Create a corresponding client in the `src/api` directory
4. Add appropriate TypeScript types
5. Deploy using Supabase CLI

## Troubleshooting

### Common Issues

- **API Keys Not Working**: Ensure your environment variables are correctly set
- **Build Errors**: Run `npm clean-install` to reset dependencies
- **Type Errors**: Check interfaces and type definitions
- **Supabase Connection Issues**: Verify project URL and API key

### Getting Help

- Check the [Recipe Alchemy internal wiki](https://wiki.example.com/recipe-alchemy)
- Ask in the `#dev-help` channel on Slack
- Review existing issues on GitHub

## Related Documentation

- [Code Structure](./code-structure.md) - Detailed code organization
- [Contribution Guide](./contribution-guide.md) - How to contribute
- [Testing Strategy](./testing-strategy.md) - How to test your code
- [System Architecture](../architecture/system-architecture.md) - Overall system design
