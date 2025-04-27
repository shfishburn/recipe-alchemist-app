
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import type { Recipe } from "@/types/recipe";

interface ScienceNotesProps {
  recipe: Recipe;
}

export function ScienceNotes({ recipe }: ScienceNotesProps) {
  if (!recipe.science_notes?.length) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base sm:text-xl font-semibold flex items-center">
          <FileText className="h-5 w-5 mr-2 text-recipe-blue" />
          Science Notes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc pl-4 space-y-2">
          {recipe.science_notes.map((note, index) => (
            <li key={index} className="text-muted-foreground">{note}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
