import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { FileText, ChevronDown, ChevronUp } from "lucide-react";
import type { Recipe } from "@/types/recipe";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface ScienceNotesProps {
  recipe: Recipe;
  isOpen: boolean;
  onToggle: () => void;
}

export function ScienceNotes({ recipe, isOpen, onToggle }: ScienceNotesProps) {
  const hasNotes = recipe.science_notes && Array.isArray(recipe.science_notes) && recipe.science_notes.length > 0;
  
  if (!hasNotes) return null;

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base sm:text-xl font-semibold flex items-center">
              <FileText className="h-5 w-5 mr-2 text-recipe-blue" />
              Science Notes
            </CardTitle>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
                <span className="sr-only">Toggle section</span>
              </Button>
            </CollapsibleTrigger>
          </div>
        </CardHeader>
        <CollapsibleContent>
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
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
