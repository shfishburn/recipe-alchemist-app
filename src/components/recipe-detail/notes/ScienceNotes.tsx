
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import type { Recipe } from "@/types/recipe";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface ScienceNotesProps {
  recipe: Recipe;
}

export function ScienceNotes({ recipe }: ScienceNotesProps) {
  // Guard against missing or empty science_notes
  const hasNotes = recipe.science_notes && Array.isArray(recipe.science_notes) && recipe.science_notes.length > 0;
  
  if (!hasNotes) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base sm:text-xl font-semibold flex items-center">
          <FileText className="h-5 w-5 mr-2 text-recipe-blue" />
          Science Notes
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recipe.science_notes.length > 3 ? (
          <Accordion type="single" collapsible className="w-full">
            {recipe.science_notes.map((note, index) => (
              <AccordionItem key={index} value={`note-${index}`}>
                <AccordionTrigger className="text-muted-foreground">
                  Note {index + 1}: {note.substring(0, 50)}...
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {note}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <ul className="list-disc pl-4 space-y-2">
            {recipe.science_notes.map((note, index) => (
              <li key={index} className="text-muted-foreground">{note}</li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
