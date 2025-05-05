
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface SectionControlsProps {
  onExpandAll: () => void;
  onCollapseAll: () => void;
}

export function SectionControls({ onExpandAll, onCollapseAll }: SectionControlsProps) {
  // Since the tabbed interface eliminates the need for expand/collapse all functionality,
  // we'll return null to remove these controls from the UI
  return null;
}
