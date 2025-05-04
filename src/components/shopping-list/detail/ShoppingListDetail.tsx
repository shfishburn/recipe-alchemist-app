
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ChevronDown, ChevronUp } from 'lucide-react';
import type { ShoppingList, ShoppingListItem } from '@/types/shopping-list';
import { ShoppingListHeader } from './ShoppingListHeader';
import { ShoppingListNotes } from './ShoppingListNotes';
import { ShoppingListControls } from './ShoppingListControls';
import { AddItemForm } from './AddItemForm';
import { ShoppingListItemsView } from './ShoppingListItemsView';
import { ShoppingListProgress } from './ShoppingListProgress';
import { useShoppingList } from '@/hooks/shopping-list';

// Import touch optimizations
import '@/styles/touch-optimizations.css';

interface ShoppingListDetailProps {
  list: ShoppingList;
  onUpdate: () => void;
  onDelete?: (id: string) => Promise<void>;
}

export function ShoppingListDetail({ list, onUpdate, onDelete }: ShoppingListDetailProps) {
  const {
    searchTerm,
    setSearchTerm,
    sortOrder,
    setSortOrder,
    expandedDepts,
    groupedItems,
    allDepartments,
    itemsByDepartment,
    handleToggleItem,
    handleDeleteItem,
    handleAddItem,
    toggleAllInDepartment,
    toggleDeptExpanded,
    copyToClipboard,
    getItemIndex
  } = useShoppingList(list, onUpdate);

  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  // Calculate completion stats
  const totalItems = list.items.length;
  const completedCount = list.items.filter(item => item.checked).length;
  const completionPercentage = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

  // Add touch optimization class on mount
  useEffect(() => {
    document.body.classList.add('completed-loading');
    document.body.classList.add('touch-optimized');
    
    return () => {
      document.body.classList.remove('completed-loading');
      document.body.classList.remove('touch-optimized');
    };
  }, []);

  // Convert Promise<boolean> to Promise<void>
  const handleCopyToClipboard = async (): Promise<void> => {
    await copyToClipboard();
  };

  // Create a wrapper function to convert Promise<boolean> to Promise<void>
  const handleAddItemWrapper = async (item: Partial<ShoppingListItem>): Promise<void> => {
    await handleAddItem(item);
  };

  return (
    <Card className="p-2 md:p-3 max-w-full">
      <ShoppingListHeader 
        list={list} 
        onDelete={onDelete}
        itemsByDepartment={itemsByDepartment}
        onCopyToClipboard={handleCopyToClipboard}
        completionPercentage={completionPercentage}
        completedCount={completedCount}
        totalItems={totalItems}
      />
      
      <CardContent className="px-0 pt-2 space-y-2">
        <ShoppingListProgress
          completedCount={completedCount}
          totalItems={totalItems}
          completionPercentage={completionPercentage}
        />

        <div>
          <ShoppingListControls 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
          />
        </div>
        
        {/* Shopping Items Section */}
        <div>
          <h3 className="text-lg font-medium mb-1.5">Shopping List</h3>
          <div className="touch-scroll max-w-full">
            <ShoppingListItemsView
              groupedItems={groupedItems}
              expandedDepts={expandedDepts}
              onToggleDept={toggleDeptExpanded}
              onToggleDepartmentItems={toggleAllInDepartment}
              onToggleItem={handleToggleItem}
              onDeleteItem={handleDeleteItem}
              getItemIndex={getItemIndex}
            />
          </div>
        </div>

        {/* Add Item Button/Form */}
        <div className="border rounded-md">
          <Button 
            variant="ghost" 
            className="w-full flex items-center justify-between p-1.5"
            onClick={() => setShowAddItemForm(!showAddItemForm)}
          >
            <span className="flex items-center">
              <Plus className="h-4 w-4 mr-1.5" />
              Add New Item
            </span>
            {showAddItemForm ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          
          {showAddItemForm && (
            <div className="p-2">
              <AddItemForm 
                onAddItem={handleAddItemWrapper}
                availableDepartments={allDepartments}
              />
            </div>
          )}
        </div>
        
        {/* Notes Section */}
        <div className="border rounded-md">
          <Button 
            variant="ghost" 
            className="w-full flex items-center justify-between p-1.5"
            onClick={() => setShowNotes(!showNotes)}
          >
            <span className="flex items-center">
              <span className="font-medium">Notes & Tips</span>
            </span>
            {showNotes ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          
          {showNotes && (
            <div className="p-2">
              <ShoppingListNotes list={list} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
