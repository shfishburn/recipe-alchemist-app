
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ChevronDown, ChevronUp } from 'lucide-react';
import type { ShoppingList } from '@/types/shopping-list';
import { ShoppingListHeader } from './detail/ShoppingListHeader';
import { ShoppingListNotes } from './detail/ShoppingListNotes';
import { ShoppingListControls } from './detail/ShoppingListControls';
import { AddItemForm } from './detail/AddItemForm';
import { ShoppingListItemsView } from './detail/ShoppingListItemsView';
import { ShoppingListProgress } from './detail/ShoppingListProgress';
import { useShoppingList } from '@/hooks/shopping-list/use-shopping-list';
import { ShoppingListSettings } from './ShoppingListSettings';
import { Separator } from '@/components/ui/separator';

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
  const [showSettings, setShowSettings] = useState(false);

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

  return (
    <Card className="p-3 sm:p-5 max-w-full">
      <ShoppingListHeader 
        list={list} 
        onDelete={onDelete}
        itemsByDepartment={itemsByDepartment}
        onCopyToClipboard={copyToClipboard}
        completionPercentage={completionPercentage}
        completedCount={completedCount}
        totalItems={totalItems}
      />
      
      <CardContent className="px-0 pt-2">
        <ShoppingListProgress
          completedCount={completedCount}
          totalItems={totalItems}
          completionPercentage={completionPercentage}
        />

        <div className="mb-4">
          <ShoppingListControls 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
          />
        </div>
        
        {/* Settings Section */}
        <div className="mb-4 border rounded-md">
          <Button 
            variant="ghost" 
            className="w-full flex items-center justify-between p-2.5"
            onClick={() => setShowSettings(!showSettings)}
          >
            <span className="flex items-center font-medium">
              List Settings
            </span>
            {showSettings ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          
          {showSettings && (
            <div className="p-3">
              <ShoppingListSettings />
            </div>
          )}
        </div>
        
        {/* Shopping Items Section */}
        <div className="mb-5">
          <h3 className="text-lg font-medium mb-3">Shopping List</h3>
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
        <div className="mb-5 border rounded-md">
          <Button 
            variant="ghost" 
            className="w-full flex items-center justify-between p-2.5"
            onClick={() => setShowAddItemForm(!showAddItemForm)}
          >
            <span className="flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Add New Item
            </span>
            {showAddItemForm ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          
          {showAddItemForm && (
            <div className="p-3">
              <AddItemForm 
                onAddItem={handleAddItem}
                availableDepartments={allDepartments}
              />
            </div>
          )}
        </div>
        
        {/* Notes Section */}
        <div className="mb-5 border rounded-md">
          <Button 
            variant="ghost" 
            className="w-full flex items-center justify-between p-2.5"
            onClick={() => setShowNotes(!showNotes)}
          >
            <span className="flex items-center font-medium">
              Notes & Tips
            </span>
            {showNotes ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          
          {showNotes && (
            <div className="p-3">
              <ShoppingListNotes list={list} />
            </div>
          )}
        </div>
        
        <Separator className="my-4" />
        
        <div className="text-xs text-center text-muted-foreground pb-10 pt-2">
          <p>Check items by tapping on them • Use settings to change units</p>
        </div>
      </CardContent>
    </Card>
  );
}
