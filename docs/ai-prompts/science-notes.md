
# Science Notes Generation

Science notes are generated in several places throughout Recipe Alchemy:

## Generation Sources

1. **Recipe generation** - Includes scientific explanations in steps
2. **Recipe analysis** - Extracts science notes from recipe steps
3. **Recipe chat** - Provides scientific insights based on user questions
4. **Recipe modification** - Explains the scientific reasoning behind modifications

## Science Notes Format

Science notes are stored as string arrays:

```typescript
science_notes: string[] // Array of scientific explanations
```

## Examples of Science Notes

Science notes focus on:

1. **Chemical reactions** (Maillard reaction, caramelization, etc.)
2. **Protein denaturation** processes
3. **Starch gelatinization** explanations
4. **Temperature effects** on ingredients
5. **pH impacts** on cooking processes
6. **Texture development** mechanisms
7. **Flavor compound** development

## López-Alt Style Scientific Explanations

The López-Alt style is characterized by:

1. **Precise temperature specifications** (both °F and °C)
2. **Exact timing guidelines** with explanations
3. **Scientific terminology** with accessible explanations
4. **Sensory indicators** for doneness
5. **Explanations of why techniques work** at molecular level
6. **References to chemical reactions** and physical transformations

## Example Science Note

```
When searing protein at high heat (375°F/190°C), the Maillard reaction occurs between amino acids and reducing sugars. This produces both the characteristic brown crust and hundreds of new flavor compounds. For optimal browning, ensure the surface of the meat is dry before searing, as excess moisture will cause steaming instead of browning until it evaporates.
```

## Science Note Extraction

The system extracts science notes from recipe steps using pattern recognition and keyword identification. Key scientific terms and explanations are identified and consolidated into separate notes that can be displayed to users for educational purposes.

## Related Files

- `src/components/recipe-detail/notes/ScienceNotes.tsx` - Science notes display
- `src/hooks/use-recipe-science.ts` - Science notes extraction hook
- `src/components/recipe-chat/response/utils/scientific-content.ts` - Science content processing
