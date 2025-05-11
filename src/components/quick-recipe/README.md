
# Recipe Generation Flow Architecture

This document outlines the architecture of the recipe generation flow, issues that have been addressed, and remaining tech debt.

## Flow Overview

1. **User Input**: User enters ingredients and options in QuickRecipeForm
2. **Form Submission**: useQuickRecipeForm handles validation and state preparation
3. **Loading Transition**: User is redirected to LoadingPage with proper transitions
4. **Recipe Generation**: Loading page initiates and monitors recipe generation
5. **Completion**: On success, user is redirected to QuickRecipePage with the recipe
6. **Error Handling**: If errors occur, appropriate error UI is shown with retry options

## Recent Fixes

### Hook Order Issues
- Ensured hooks are called unconditionally in all components
- Fixed race conditions in useState/useEffect patterns
- Added proper dependency arrays to useEffect hooks

### Navigation Flow
- Implemented TransitionController pattern for coordinated transitions
- Added navigation guards to prevent premature navigation
- Improved transition animations between pages

### Error Handling
- Standardized error normalization across the application
- Added better timeout detection and messaging
- Improved error recovery paths with retry functionality

### Request Coordination
- Added request queue to prevent multiple simultaneous API calls
- Implemented isSubmitting flags to prevent duplicate form submissions
- Added proper cleanup of async operations

### UI Feedback
- Ensured animations complete before state transitions
- Improved progress bar behavior during loading
- Added better feedback during retries and cancellations

## Remaining Tech Debt

1. **State Management**: Consider migrating to a more structured state machine pattern
2. **API Response Handling**: Standardize API response handling further
3. **Loading State**: Implement real progress tracking instead of simulated progress
4. **Form Data Validation**: Add more comprehensive validation before submission
5. **Animation System**: Consider using a dedicated animation library for complex transitions

## Architecture Guidelines

- **Page Components**: Should focus only on layout and composition
- **Logic in Hooks**: Business logic should live in hooks, not components
- **Transitions**: Use TransitionController for coordinated navigation
- **Error Handling**: Normalize errors and provide user-friendly messages
- **State Updates**: Avoid race conditions by using functional state updates

## Debugging

To enable detailed debugging of transitions and state changes:
1. Set `DEBUG_ENABLED` to `true` in `transition-debugger.ts`
2. Use `logTransition()` to track important events
3. Call `printTransitionHistory()` to view the transition log when issues occur
