
# Scientific Content Styling Guide

## Overview

Recipe Alchemy presents scientific information through various components and features. This document outlines the styling guidelines for scientific content presentation to ensure consistency, readability, and visual distinction from regular content.

## Scientific Content Types

The application handles multiple types of scientific content:

1. **Science Notes**: Explanatory notes about cooking science
2. **Chemical Reactions**: Descriptions of reactions occurring during cooking
3. **Nutritional Science**: Scientific explanations of nutritional concepts
4. **Temperature Effects**: Scientific descriptions of temperature impacts
5. **Texture Development**: Explanations of texture formation mechanisms

## Visual Styling

### Typography

Scientific content uses:

- Base font size of `0.95rem` for readability while distinguishing from regular content
- Line height of `1.5` for improved readability of complex scientific terminology
- Slightly increased letter spacing for chemical terms and formulas
- Proper handling of superscripts and subscripts in chemical formulas

### Structure

Scientific content typically follows this structure:

- **Headings**: Clear headings for sections using h3 and h4
- **Lists**: Bulleted lists for related items with proper indentation
- **Paragraphs**: Concise paragraphs with adequate spacing
- **Term Highlighting**: Important scientific terms are emphasized

### CSS Classes

The primary class for scientific content is `.scientific-content` with these properties:

```css
.scientific-content {
  font-size: 0.95rem;
  line-height: 1.5;
}

.scientific-content h3, 
.scientific-content h4 {
  font-weight: 600;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

.scientific-content ul {
  list-style-type: disc;
  padding-left: 1.25rem;
  margin: 0.75rem 0;
}

.scientific-content ol {
  list-style-type: decimal;
  padding-left: 1.25rem;
  margin: 0.75rem 0;
}
```

## López-Alt Style Science Notes

Science notes follow the J. Kenji López-Alt style of scientific explanation:

### Style Characteristics

1. **Precise Temperature Specifications**: Both °F and °C are provided
   - Example: `375°F/190°C`

2. **Exact Timing Guidelines**: Specific times with explanations
   - Example: `8-10 minutes (until proteins denature)`

3. **Scientific Terminology with Explanations**: Complex terms with accessible definitions
   - Example: `Maillard reaction (the browning of proteins and sugars)`

4. **Sensory Indicators**: Visual, tactile, or other sensory cues
   - Example: `until the surface turns deep amber and becomes fragrant`

5. **Chemical Explanations**: Explanations at molecular level
   - Example: `as starch molecules gelatinize and absorb water`

## Implementation Examples

### Recipe Step with Scientific Explanation

```jsx
<div className="scientific-content">
  <p>
    Sear the steak at high heat (375°F/190°C) for 2-3 minutes per side. 
    This triggers the <strong>Maillard reaction</strong>, a complex interaction 
    between amino acids and reducing sugars that creates hundreds of new flavor 
    compounds and the characteristic brown crust.
  </p>
</div>
```

### Science Notes Section

```jsx
<div className="scientific-content">
  <h3>The Science of Caramelization</h3>
  <p>
    Unlike the Maillard reaction which involves proteins, caramelization is 
    the pyrolysis of sugars. It begins when sugars are heated to 320°F/160°C, 
    causing them to break down and form new compounds that contribute complex 
    flavors and brown color.
  </p>
  <ul>
    <li>Sucrose begins to caramelize at 320°F/160°C</li>
    <li>Fructose caramelizes at 230°F/110°C</li>
    <li>Glucose requires temperatures of 300°F/150°C</li>
  </ul>
</div>
```

## Animation

Scientific content occasionally uses subtle animations to enhance engagement:

- Fade-in effects when content is first displayed
- Subtle highlighting for important terms or reactions
- Sequential reveals for multi-step processes

```css
.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

## Responsive Behavior

Scientific content is optimized for all screen sizes:

- **Desktop**: Full content presentation with formatted tables and diagrams
- **Tablet**: Slightly condensed presentation with maintained readability
- **Mobile**: Simplified format with preserved scientific accuracy but adapted layout

## Accessibility Considerations

Scientific content follows these accessibility guidelines:

- **Screen Readers**: All content is properly structured for screen reader compatibility
- **Color Contrast**: Sufficient contrast for all text to background colors
- **Text Scaling**: Content remains readable when text is scaled up to 200%
- **Link and Button Clarity**: Interactive elements are clearly identified
