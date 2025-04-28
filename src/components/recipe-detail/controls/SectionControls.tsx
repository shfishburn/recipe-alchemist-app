
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface SectionControlsProps {
  onExpandAll: () => void;
  onCollapseAll: () => void;
}

export function SectionControls({ onExpandAll, onCollapseAll }: SectionControlsProps) {
  return (
    <div className="flex gap-2 justify-end mb-4">
      <Button 
        variant="outline" 
        size="sm"
        onClick={onExpandAll}
        className="text-muted-foreground"
      >
        <ChevronDown className="h-4 w-4 mr-1" />
        Expand All
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        onClick={onCollapseAll}
        className="text-muted-foreground"
      >
        <ChevronUp className="h-4 w-4 mr-1" />
        Collapse All
      </Button>
    </div>
  );
}
