/**
 * DietarySelector.tsx
 * Version: 1.0.3
 * Date: 2025-05-10
 * Changes:
 * - Converted to use grouped options with category labels for improved UX
 */

import React from 'react'
import { MultiSelect, SelectOption, SelectGroup } from '@/components/ui/multi-select'

export interface DietarySelectorProps {
  value: string[]
  onChange: (dietary: string[]) => void
}

// Grouped dietary options with category labels
const groupedDietaryOptions: SelectGroup[] = [
  {
    label: 'Diets & Styles',
    options: [
      { value: 'any', label: 'No Restrictions' },
      { value: 'vegetarian', label: 'Vegetarian' },
      { value: 'vegan', label: 'Vegan' },
      { value: 'pescatarian', label: 'Pescatarian' },
      { value: 'paleo', label: 'Paleo' },
      { value: 'keto', label: 'Keto' },
      { value: 'whole30', label: 'Whole30' },
      { value: 'plant-based', label: 'Plant-Based' }
    ]
  },
  {
    label: 'Restrictions & Macros',
    options: [
      { value: 'gluten-free', label: 'Gluten-Free' },
      { value: 'dairy-free', label: 'Dairy-Free' },
      { value: 'nut-free', label: 'Nut-Free' },
      { value: 'soy-free', label: 'Soy-Free' },
      { value: 'egg-free', label: 'Egg-Free' },
      { value: 'low-carb', label: 'Low-Carb' },
      { value: 'low-fat', label: 'Low-Fat' },
      { value: 'high-protein', label: 'High-Protein' },
      { value: 'low-sodium', label: 'Low-Sodium' }
    ]
  },
  {
    label: 'Health Conditions',
    options: [
      { value: 'diabetic-friendly', label: 'Diabetic-Friendly' },
      { value: 'heart-healthy', label: 'Heart-Healthy' },
      { value: 'kidney-friendly', label: 'Kidney-Friendly' },
      { value: 'anti-inflammatory', label: 'Anti-Inflammatory' },
      { value: 'fodmap-friendly', label: 'FODMAP-Friendly' }
    ]
  },
  {
    label: 'Flavor Preferences',
    options: [
      { value: 'spicy', label: 'Spicy' },
      { value: 'sweet', label: 'Sweet' },
      { value: 'savory', label: 'Savory' },
      { value: 'smoky', label: 'Smoky' },
      { value: 'tangy', label: 'Tangy' },
      { value: 'umami', label: 'Umami' }
    ]
  }
]

export function DietarySelector({ value, onChange }: DietarySelectorProps) {
  const handleDietaryChange = (selected: string[]) => {
    onChange(selected)
  }

  return (
    <div className="w-full">
      <MultiSelect
        options={groupedDietaryOptions}
        selected={value}
        onChange={handleDietaryChange}
        placeholder="Select preferences (max 4)"
        maxSelections={4}
        isGrouped
      />
    </div>
  )
}
