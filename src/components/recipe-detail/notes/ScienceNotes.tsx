
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
  const hasNotes = recipe.science_notes && Array.isArray(recipe.science_notes) && recipe.science_notes.length > 0;
  const [expanded, setExpanded] = useState<boolean>(false);
  
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
            <div className="flex items-center space-x-3">
              <div className="flex items-center text-sm">
                <span className="mr-2 text-sm text-muted-foreground">Show all</span>
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
            {expanded ? (
              <ul className="list-disc pl-4 space-y-2">
                {recipe.science_notes.map((note, index) => (
                  <li key={index} className="text-muted-foreground">{note}</li>
                ))}
              </ul>
            ) : (
              <ul className="list-disc pl-4 space-y-2">
                {recipe.science_notes.slice(0, 3).map((note, index) => (
                  <li key={index} className="text-muted-foreground">{note}</li>
                ))}
                {recipe.science_notes.length > 3 && (
                  <li className="text-sm mt-2">
                    <Button 
                      variant="link" 
                      onClick={() => setExpanded(true)}
                      className="p-0 h-auto"
                    >
                      Show {recipe.science_notes.length - 3} more notes...
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
