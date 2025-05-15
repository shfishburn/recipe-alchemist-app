
# Scientific Styling Guide

This document provides guidelines for presenting scientific and nutritional content within Recipe Alchemy, ensuring accuracy, consistency, and readability across the application.

## Core Principles

### 1. Scientific Accuracy

All scientific content must be:
- **Factually correct** - Reflecting current scientific understanding
- **Properly sourced** - Based on reliable scientific literature
- **Appropriately contextualized** - Explaining relevance to cooking
- **Clearly presented** - Avoiding misinterpretation

### 2. Accessibility

Scientific content should be:
- **Approachable** - Understandable by non-experts
- **Engaging** - Interesting and relevant to users
- **Layered** - Providing basic understanding with options to learn more
- **Jargon-minimized** - Explaining technical terms when used

### 3. Visual Clarity

Scientific visualizations should:
- **Simplify complexity** - Present data clearly without oversimplification
- **Use consistent visual language** - Follow design system patterns
- **Support comprehension** - Use visualizations to aid understanding
- **Maintain accuracy** - Avoid misleading representations

## Typography for Scientific Content

### Special Typography Classes

Recipe Alchemy includes specialized typography for scientific content:

```css
/* Base scientific content styling */
.scientific-content {
  font-size: 0.95rem;
  line-height: 1.5;
}

/* Headings within scientific content */
.scientific-content h3, 
.scientific-content h4 {
  font-weight: 600;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

/* Lists within scientific content */
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

### Scientific Notation

For scientific notation:

```jsx
// Subscripts
<span>H<sub>2</sub>O</span>

// Superscripts
<span>10<sup>3</sup></span>

// Combined
<span>C<sub>6</sub>H<sub>12</sub>O<sub>6</sub></span>
```

### Units of Measurement

Format units consistently:

```jsx
// Space between value and unit
<span>200 mg</span>

// Complex units
<span>50 mg/dL</span>

// Range values
<span>25–30 g</span>
```

## Scientific Content Structure

### Section Organization

Structure scientific content consistently:

```jsx
<div className="scientific-content">
  <h3>Chemical Reactions in Cooking</h3>
  <p>
    When proteins are heated, they undergo denaturation, changing their structure
    and properties.
  </p>
  
  <h4>The Maillard Reaction</h4>
  <p>
    This reaction between amino acids and reducing sugars gives browned foods 
    their distinctive flavor.
  </p>
  
  <ul>
    <li>Occurs at temperatures between 140°C and 165°C</li>
    <li>Produces hundreds of different flavor compounds</li>
    <li>Requires both proteins and carbohydrates</li>
  </ul>
</div>
```

### Key Terms Highlighting

Highlight important scientific terms:

```jsx
<p>
  The <span className="font-medium">Maillard reaction</span> is responsible for the 
  complex flavors in many cooked foods.
</p>
```

## Nutritional Information Styling

### Nutrition Tables

Format nutrition tables consistently:

```jsx
<table className="nutrition-table w-full">
  <thead>
    <tr>
      <th className="text-left">Nutrient</th>
      <th className="text-right">Amount</th>
      <th className="text-right">% Daily Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Calories</td>
      <td className="text-right">240</td>
      <td className="text-right">12%</td>
    </tr>
    <tr>
      <td>Total Fat</td>
      <td className="text-right">10g</td>
      <td className="text-right">13%</td>
    </tr>
    {/* Additional nutrients */}
  </tbody>
</table>
```

### Nutrient Highlighting

Use consistent color coding for nutrients:

```css
/* Macronutrients */
.nutrient-protein { color: var(--color-protein); } /* Blue */
.nutrient-carbs { color: var(--color-carbs); } /* Green */
.nutrient-fat { color: var(--color-fat); } /* Orange */

/* Micronutrients */
.nutrient-vitamins { color: var(--color-vitamins); } /* Purple */
.nutrient-minerals { color: var(--color-minerals); } /* Teal */
```

## Data Visualization Standards

### Nutrition Charts

For consistent nutrition visualization:

```jsx
<MacroChart 
  data={nutritionData} 
  height={200}
  showLegend={true}
  showValues={true}
/>
```

### Chart Color System

Use consistent colors for nutrition data:

```javascript
// Standard colors for macronutrients
const MACRO_COLORS = {
  protein: "#4299E1", // Blue
  carbs: "#48BB78",   // Green
  fat: "#F6AD55",     // Orange
};

// Standard colors for micronutrient categories
const MICRO_COLORS = {
  vitamins: "#9F7AEA", // Purple
  minerals: "#38B2AC", // Teal
  other: "#A0AEC0",    // Gray
};
```

## Scientific Content Components

### ScienceNotes Component

For showing supplementary scientific information:

```jsx
<ScienceNotes 
  title="The Science of Caramelization"
  level="intermediate"
>
  <p>
    Caramelization is a non-enzymatic browning reaction that occurs when sugars 
    are heated to temperatures above 160°C (320°F).
  </p>
  <p>
    Unlike the Maillard reaction, caramelization doesn't involve amino acids and 
    produces a different flavor profile dominated by sweet and bitter notes.
  </p>
</ScienceNotes>
```

### Chemical Process Visualization

For illustrating chemical processes:

```jsx
<ChemicalProcess
  process="maillard"
  style="simplified"
  showLabels={true}
/>
```

## Content Generation Guidelines

### Complexity Levels

Define content complexity levels:

1. **Beginner** - Simple explanations without technical terms
2. **Intermediate** - More detailed with some technical terms (explained)
3. **Advanced** - In-depth with appropriate technical language

### Contextual Relevance

Always connect scientific content to practical cooking:

```jsx
// Good example
<p>
  Salt does more than add flavor—it also denatures proteins in meat, which helps 
  tenderize tough cuts during cooking.
</p>

// Avoid (too abstract, no cooking context)
<p>
  Sodium chloride causes protein denaturation by disrupting the electrostatic 
  interactions that maintain tertiary protein structure.
</p>
```

### Term Definitions

Include definitions for technical terms:

```jsx
<p>
  <span className="font-medium">Gelatinization</span>
  <span className="text-sm text-muted-foreground ml-1">
    (the process where starch granules absorb water and swell)
  </span>
  occurs when starches are heated in liquid, causing the sauce to thicken.
</p>
```

## Nutritional Accuracy Guidelines

### Precision Standards

- Use appropriate significant figures for measurements
- Include standard deviations or confidence intervals where relevant
- Clearly indicate estimated vs. measured values

```jsx
// Appropriate precision
<span>Vitamin C: 27 mg</span>

// Avoid false precision
<span>Vitamin C: 27.24193 mg</span>
```

### Reference Standards

- Clearly indicate nutrition data sources
- Use consistent reference standards (e.g., USDA Database)
- Note when substituting values from similar ingredients

```jsx
<div className="text-xs text-muted-foreground mt-2">
  Nutrition data source: USDA FoodData Central (2023)
</div>
```

## Accessibility Considerations

### Screen Reader Support

Ensure scientific content is accessible:

```jsx
// Good: Screen reader can understand this
<span>H<sub aria-label="2">2</sub>O</span>

// Avoid: Screen reader might read this incorrectly
<span>H2O</span>
```

### Color Independence

Don't rely solely on color:

```jsx
// Good: Uses both color and pattern
<div className="bg-blue-100 border-l-4 border-blue-500 p-4 flex items-center">
  <InfoIcon className="mr-2" />
  <span>Important scientific insight</span>
</div>

// Avoid: Relies only on color
<div className="bg-blue-100 p-4">
  <span>Important scientific insight</span>
</div>
```

## Best Practices for Scientific Writing

### Clear Language

- Use active voice when possible
- Keep sentences concise
- Explain cause-and-effect relationships clearly
- Use analogies to explain complex concepts

### Proper Citation

When referencing scientific findings:

```jsx
<p>
  Studies have shown that marinating meat in acidic liquids can help tenderize tough cuts
  <sup className="text-xs">
    <a href="#citation-1" aria-label="citation 1">[1]</a>
  </sup>.
</p>

<div id="citations" className="text-sm mt-8 border-t pt-4">
  <p id="citation-1">[1] Smith, J. & Jones, K. (2020). Effects of Acid Marinades on Meat Tenderness.
  Journal of Food Science, 85(3), 551-558.</p>
</div>
```

### Uncertainty Communication

Clearly communicate scientific uncertainty:

```jsx
<p>
  Current research suggests that fermented foods may improve gut health, though 
  more studies are needed to confirm specific benefits.
</p>

// Avoid absolute statements
<p>Fermented foods improve gut health.</p>
```

## Related Documentation

- [Design System](./design/README.md) - Core visual language guidelines
- [Components](./design/components.md) - UI component documentation
- [Accessibility Guidelines](./design/accessibility.md) - General accessibility standards
- [Content Validation](./operations/validation-and-quality.md) - Scientific content review process
