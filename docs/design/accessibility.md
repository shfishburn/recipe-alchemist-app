
# Accessibility

Recipe Alchemy is committed to creating an inclusive experience for all users, regardless of their abilities or how they access the application. This document outlines our accessibility standards, implementation guidelines, and testing procedures.

## Standards and Compliance

Recipe Alchemy targets the following accessibility standards:

- **WCAG 2.1 AA Compliance** - Our baseline accessibility standard
- **WAI-ARIA 1.2** - For enhanced accessibility of dynamic content
- **Keyboard Accessibility** - Full functionality without requiring a mouse
- **Screen Reader Compatibility** - Support for major screen readers
- **Mobile Accessibility** - Touch-optimized experiences for mobile devices

## Design Principles

Our accessibility approach is guided by these principles:

### 1. Perceivable

Information and interface components must be presentable to users in ways they can perceive:

- Provide text alternatives for non-text content
- Provide captions and alternatives for multimedia
- Create content that can be presented in different ways
- Make it easier for users to see and hear content

### 2. Operable

User interface components and navigation must be operable:

- Make all functionality available from a keyboard
- Give users enough time to read and use content
- Do not use content that causes seizures or physical reactions
- Help users navigate and find content

### 3. Understandable

Information and operation of the user interface must be understandable:

- Make text readable and understandable
- Make content appear and operate in predictable ways
- Help users avoid and correct mistakes

### 4. Robust

Content must be robust enough to be interpreted by a variety of user agents:

- Maximize compatibility with current and future user tools
- Use semantic HTML and follow web standards
- Test with assistive technologies

## Implementation Guidelines

### Color and Contrast

#### Minimum Contrast Requirements

- **Text and images of text**: 4.5:1 contrast ratio minimum
- **Large text** (18pt or 14pt bold): 3:1 contrast ratio minimum
- **User interface components and graphical objects**: 3:1 contrast ratio minimum

#### Implementation Techniques

- Use the design token system to ensure consistent color usage
- Test color combinations using contrast checkers
- Don't rely solely on color to convey information
- Provide additional indicators (icons, patterns, text)

Example:

```tsx
// Good: Uses both color and icon for error state
<div className="text-red-500 flex items-center gap-2">
  <AlertCircle size={16} />
  <span>Error message</span>
</div>

// Bad: Relies only on color
<div className="text-red-500">
  <span>Error message</span>
</div>
```

### Keyboard Navigation

#### Focus Management

- Ensure all interactive elements can receive focus
- Maintain a logical tab order that follows visual layout
- Make focus indicators clearly visible
- Manage focus during interactions with modals and drawers

#### Focus Styles

Recipe Alchemy uses enhanced focus styles:

```css
/* Global focus styles */
*:focus-visible {
  outline: 2px solid var(--recipe-blue);
  outline-offset: 2px;
}

/* Custom focus ring for interactive elements */
button:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible {
  box-shadow: 0 0 0 2px white, 0 0 0 4px var(--recipe-blue);
}
```

### Semantic HTML

- Use proper HTML elements for their intended purpose
- Apply ARIA roles, states, and properties when HTML semantics are insufficient
- Maintain proper heading hierarchy (h1 > h2 > h3)
- Use lists for groups of related items
- Use tables for tabular data

Example:

```tsx
// Good: Uses semantic HTML
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/recipes">Recipes</a></li>
  </ul>
</nav>

// Bad: Doesn't use semantic HTML
<div>
  <div><a href="/">Home</a></div>
  <div><a href="/recipes">Recipes</a></div>
</div>
```

### Forms and Inputs

- Associate labels with form controls using `for` attribute or nesting
- Provide clear instructions and error messages
- Group related form controls with `fieldset` and `legend`
- Use validation and provide helpful error messages
- Support keyboard navigation through forms

Example:

```tsx
// Good: Label associated with input
<div className="form-group">
  <label htmlFor="name">Name</label>
  <input id="name" type="text" aria-describedby="name-hint" />
  <p id="name-hint" className="text-sm text-muted-foreground">
    Enter your full name
  </p>
</div>

// Bad: Missing label and hint text association
<div className="form-group">
  <span>Name</span>
  <input type="text" />
  <span className="text-sm text-muted-foreground">
    Enter your full name
  </span>
</div>
```

### Images and Media

- Provide alternative text for images
- Use appropriate alt text based on image purpose
- Make decorative images use empty alt text
- Provide captions and transcripts for video/audio content
- Ensure media is pausable and doesn't auto-play

Example:

```tsx
// Good: Informative alt text
<img 
  src="/images/mediterranean-salad.jpg" 
  alt="Mediterranean salad with chickpeas, tomatoes, cucumber, and feta cheese" 
/>

// Good: Decorative image with empty alt
<img src="/images/decorative-divider.svg" alt="" role="presentation" />

// Bad: Missing alt text
<img src="/images/mediterranean-salad.jpg" />
```

### Text and Typography

- Use readable font sizes (minimum 16px for body text)
- Maintain proper line spacing (minimum 1.5 times font size)
- Ensure text can be resized up to 200% without loss of functionality
- Use relative units (rem/em) rather than fixed units (px)
- Maintain appropriate contrast for all text elements

### ARIA Implementation

- Use ARIA attributes judiciously and only when necessary
- Test ARIA implementations with screen readers
- Follow the first rule of ARIA: don't use ARIA if HTML can achieve the same result
- Keep ARIA attributes up-to-date with dynamic content

Example:

```tsx
// Good: Using ARIA for a custom control
<div 
  role="tab"
  aria-selected={isSelected}
  aria-controls="panel-1"
  tabIndex={isSelected ? 0 : -1}
>
  Tab Label
</div>

// Bad: Redundant ARIA on native element
<button role="button" aria-pressed="false">
  Click Me
</button>
```

## Component-Specific Guidelines

### Buttons

- Use native `<button>` elements when possible
- Include accessible labels for icon-only buttons
- Ensure buttons have sufficient touch target size (44px × 44px)
- Provide appropriate disabled states with `aria-disabled`

### Dialogs and Modals

- Use `role="dialog"` or `role="alertdialog"` with `aria-modal="true"`
- Set focus to an appropriate element when dialog opens
- Trap focus within the dialog
- Return focus to triggering element when closed
- Allow closing via Escape key

### Tabs

- Use appropriate ARIA roles (`tablist`, `tab`, `tabpanel`)
- Associate tabs with their panels using `aria-controls`
- Indicate selected state with `aria-selected`
- Implement proper keyboard navigation (arrow keys, Home/End)

### Tooltips and Popovers

- Ensure tooltips are keyboard accessible
- Use `aria-describedby` to associate tooltip with trigger
- Make tooltips dismissable and non-blocking
- Ensure tooltips don't obscure important content

### Form Validation

- Provide clear error messages
- Associate error messages with inputs using `aria-describedby`
- Use `aria-invalid` for invalid fields
- Announce errors to screen readers
- Provide suggestions for fixing errors

## Testing Procedures

### Automated Testing

Automated tools help identify basic accessibility issues:

- **Axe Core** for component-level testing
- **Lighthouse** for page-level testing
- **ESLint plugin jsx-a11y** for code-level testing

### Manual Testing

Essential manual checks include:

#### Keyboard Testing

- Tab through the entire interface
- Verify all interactive elements are focusable
- Confirm logical tab order
- Test keyboard shortcuts and focus trapping
- Ensure no keyboard traps

#### Screen Reader Testing

Test with multiple screen readers:

- **NVDA** (Windows)
- **VoiceOver** (macOS/iOS)
- **JAWS** (Windows)
- **TalkBack** (Android)

Verify:
- Proper element announcement
- Correct heading structure
- Form controls are properly labeled
- Images have appropriate alt text
- Dynamic content changes are announced

#### Color and Zoom Testing

- Test with high contrast mode
- Verify the interface at 200% zoom
- Check for text reflow at increased font sizes
- Test with color vision deficiency simulators

## Common Patterns and Implementation

### Loading States

- Use `aria-busy` for elements being updated
- Provide loading indicators with `role="status"`
- Announce loading and completion states to screen readers

```tsx
<div 
  role="status" 
  aria-live="polite"
  className="loading-container"
>
  <Loader2 className="animate-spin" />
  <span>Loading...</span>
</div>
```

### Expandable Content

Proper implementation of accordions and expandable sections:

```tsx
<div>
  <button
    aria-expanded={isExpanded}
    aria-controls="content-1"
    onClick={() => setIsExpanded(!isExpanded)}
  >
    Section Title
  </button>
  <div 
    id="content-1"
    hidden={!isExpanded}
  >
    Expandable content
  </div>
</div>
```

### Custom Select Components

Accessible custom select implementation:

```tsx
<div className="custom-select">
  <label id="country-label">Country</label>
  <button
    aria-haspopup="listbox"
    aria-labelledby="country-label country-button"
    id="country-button"
    aria-expanded={isOpen}
    onClick={() => setIsOpen(!isOpen)}
  >
    {selectedOption || "Select a country"}
  </button>
  <ul
    role="listbox"
    aria-labelledby="country-label"
    hidden={!isOpen}
  >
    {options.map(option => (
      <li
        key={option.value}
        role="option"
        aria-selected={option.value === selectedValue}
        onClick={() => selectOption(option.value)}
      >
        {option.label}
      </li>
    ))}
  </ul>
</div>
```

## Related Documentation

- [Visual Language](./visual-language.md) - Color and typography guidelines
- [Components](./components.md) - Component-specific implementation
- [Design Tokens](./tokens.md) - Design variables and theming
- [Layout System](./layout.md) - Responsive and accessible layouts
