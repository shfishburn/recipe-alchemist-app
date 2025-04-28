
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileText, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Recipe } from "@/types/recipe";

interface ChefNotesProps {
  recipe: Recipe;
  onUpdate: (notes: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function ChefNotes({ recipe, onUpdate, isOpen, onToggle }: ChefNotesProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState(recipe.chef_notes || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("recipes")
        .update({ chef_notes: notes })
        .eq("id", recipe.id);

      if (error) throw error;

      // Call the onUpdate prop to update parent component state
      onUpdate(notes);
      setIsEditing(false);
      toast({
        title: "Notes saved",
        description: "Your chef notes have been updated successfully.",
      });
    } catch (error) {
      console.error("Error saving notes:", error);
      toast({
        title: "Error saving notes",
        description: "There was a problem saving your notes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base sm:text-xl font-semibold flex items-center">
            <FileText className="h-5 w-5 mr-2 text-recipe-blue" />
            Chef Notes
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Cancel" : "Edit"}
            </Button>
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
            {isEditing ? (
              <div className="space-y-2">
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add your personal notes about this recipe..."
                  className="min-h-[100px]"
                />
                <Button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full sm:w-auto"
                >
                  Save Notes
                </Button>
              </div>
            ) : (
              <p className="text-muted-foreground">
                {notes || "No chef notes yet. Click edit to add your notes."}
              </p>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
