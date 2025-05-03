
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ShoppingListItem } from '@/types/shopping-list';
import { ShoppingListDepartment } from '@/components/shopping-list/detail/ShoppingListDepartment';
import { Recipe } from '@/types/recipe';

interface RecipeShoppingListViewProps {
  recipe: Recipe;
  isLoading: boolean;
  itemsByDepartment: Record<string, ShoppingListItem[]>;
  departmentExpanded: Record<string, boolean>;
  onToggleDepartment: (department: string) => void;
  onToggleItem: (index: number) => void;
  onToggleDepartmentItems: (department: string, checked: boolean) => void;
  onCopyToClipboard: () => void;
  getItemIndex: (item: ShoppingListItem) => number;
}

export function RecipeShoppingListView({
  recipe,
  isLoading,
  itemsByDepartment,
  departmentExpanded,
  onToggleDepartment,
  onToggleItem,
  onToggleDepartmentItems,
  onCopyToClipboard,
  getItemIndex
}: RecipeShoppingListViewProps) {
  const totalItems = Object.values(itemsByDepartment).flat().length;
  const completedItems = Object.values(itemsByDepartment).flat().filter(item => item.checked).length;
  const completionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <Card className="p-4 md:p-6">
      <CardHeader className="px-0 pt-0 pb-4 flex flex-row justify-between items-start">
        <div>
          <Button 
            variant="ghost" 
            size="sm" 
            asChild 
            className="mb-2"
          >
            <Link to={`/recipes/${recipe.id}`}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Recipe
            </Link>
          </Button>
          <CardTitle className="text-xl md:text-2xl">Shopping List for {recipe.title}</CardTitle>
          <div className="text-muted-foreground text-sm mt-1">
            {completedItems} of {totalItems} items checked ({completionPercentage}% complete)
          </div>
        </div>
        <div className="flex items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={onCopyToClipboard}
            className="flex gap-2 items-center"
          >
            <Copy className="h-4 w-4" />
            <span>Copy List</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="px-0 pt-2">
        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-2.5 mb-6">
          <div 
            className="bg-primary h-2.5 rounded-full" 
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(itemsByDepartment).map(([department, items]) => (
              <ShoppingListDepartment
                key={department}
                department={department}
                items={items}
                isExpanded={departmentExpanded[department] !== false}
                onToggleExpand={() => onToggleDepartment(department)}
                onToggleDepartment={onToggleDepartmentItems}
                onToggleItem={onToggleItem}
                onDeleteItem={() => {}} // No deletion in recipe view
                getItemIndexInList={getItemIndex}
              />
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-between">
          <Button 
            variant="outline" 
            size="sm" 
            asChild
          >
            <Link to={`/recipes/${recipe.id}`}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Recipe
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
