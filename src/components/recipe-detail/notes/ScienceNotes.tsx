
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { FileText, ChevronDown, ChevronUp } from "lucide-react";
import type { Recipe } from "@/types/recipe";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

interface ScienceNotesProps {
  recipe: Recipe;
  isOpen: boolean;
  onToggle: () => void;
}

export function ScienceNotes({ recipe, isOpen, onToggle }: ScienceNotesProps) {
  // More robust check for science notes availability
  const hasNotes = recipe.science_notes && 
                  Array.isArray(recipe.science_notes) && 
                  recipe.science_notes.length > 0 &&
                  recipe.science_notes.some(note => typeof note === 'string' && note.trim() !== '');
                  
  const [expanded, setExpanded] = useState<boolean>(false);
  
  if (!hasNotes) return null;

  // Filter out any invalid notes
  const validNotes = recipe.science_notes.filter(note => 
    typeof note === 'string' && note.trim() !== ''
  );

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base sm:text-xl font-semibold flex items-center">
              <FileText className="h-5 w-5 mr-2 text-recipe-blue" />
              Science Notes
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                <span className="mr-2 text-xs sm:text-sm text-muted-foreground">Show all</span>
                <Switch checked={expanded} onCheckedChange={setExpanded} />
              </div>
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
          </div>
        </CardHeader>
        <CollapsibleContent>
          <CardContent>
            {validNotes.length === 0 ? (
              <p className="text-muted-foreground italic">No science notes available</p>
            ) : expanded ? (
              <ul className="list-disc pl-4 space-y-2">
                {validNotes.map((note, index) => (
                  <li key={index} className="text-muted-foreground">{note}</li>
                ))}
              </ul>
            ) : (
              <ul className="list-disc pl-4 space-y-2">
                {validNotes.slice(0, 3).map((note, index) => (
                  <li key={index} className="text-muted-foreground">{note}</li>
                ))}
                {validNotes.length > 3 && (
                  <li className="text-sm mt-2">
                    <Button 
                      variant="link" 
                      onClick={() => setExpanded(true)}
                      className="p-0 h-auto"
                    >
                      Show {validNotes.length - 3} more notes...
                    </Button>
                  </li>
                )}
              </ul>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
