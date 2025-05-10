
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ServingsSelectorProps {
  selectedServings: number;
  onServingsChange: (servings: number) => void;
}

export function ServingsSelector({
  selectedServings,
  onServingsChange,
}: ServingsSelectorProps) {
  const handleValueChange = (value: string) => {
    onServingsChange(Number(value));
  };

  return (
    <Select
      value={String(selectedServings)}
      onValueChange={handleValueChange}
    >
      <SelectTrigger className="w-full bg-white">
        <SelectValue placeholder="Select number of servings" />
      </SelectTrigger>
      <SelectContent className="bg-white">
        <SelectItem value="1" className="pl-8">1 person</SelectItem>
        <SelectItem value="2" className="pl-8">2 people</SelectItem>
        <SelectItem value="3" className="pl-8">3 people</SelectItem>
        <SelectItem value="4" className="pl-8">4 people</SelectItem>
        <SelectItem value="6" className="pl-8">6 people</SelectItem>
        <SelectItem value="8" className="pl-8">8 people</SelectItem>
        <SelectItem value="10" className="pl-8">10+ people</SelectItem>
      </SelectContent>
    </Select>
  );
}
