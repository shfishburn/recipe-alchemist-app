
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

  // Fix: Convert Promise<boolean> to Promise<void>
  const handleCopyToClipboard = async (): Promise<void> => {
    await copyToClipboard();
  };

  return (
    <Card className="shadow-md border-0 overflow-hidden">
      <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 md:p-5">
        <ShoppingListHeader 
          list={list} 
          onDelete={onDelete}
          itemsByDepartment={itemsByDepartment}
          onCopyToClipboard={handleCopyToClipboard}
          completionPercentage={completionPercentage}
          completedCount={completedCount}
          totalItems={totalItems}
        />
      </div>
      
      <CardContent className="p-4 md:p-5 space-y-4">
        <ShoppingListProgress
          completedCount={completedCount}
          totalItems={totalItems}
          completionPercentage={completionPercentage}
        />

        <div className="bg-white rounded-lg p-3 shadow-sm border">
          <ShoppingListControls 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
          />
        </div>
        
        {/* Shopping Items Section */}
        <div>
          <h3 className="text-lg font-medium mb-3 px-1">Shopping Items</h3>
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
        <div className="rounded-lg border shadow-sm overflow-hidden">
          <Button 
            variant="ghost" 
            className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800"
            onClick={() => setShowAddItemForm(!showAddItemForm)}
          >
            <span className="flex items-center">
              <Plus className="h-4 w-4 mr-2 text-blue-600" />
              Add New Item
            </span>
            {showAddItemForm ? <ChevronUp className="h-4 w-4 text-blue-600" /> : <ChevronDown className="h-4 w-4 text-blue-600" />}
          </Button>
          
          {showAddItemForm && (
            <div className="p-4 bg-white">
              <AddItemForm 
                onAddItem={handleAddItem}
                availableDepartments={allDepartments}
              />
            </div>
          )}
        </div>
        
        {/* Notes Section */}
        <div className="rounded-lg border shadow-sm overflow-hidden">
          <Button 
            variant="ghost" 
            className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800"
            onClick={() => setShowNotes(!showNotes)}
          >
            <span className="flex items-center font-medium">
              Notes & Tips
            </span>
            {showNotes ? <ChevronUp className="h-4 w-4 text-amber-600" /> : <ChevronDown className="h-4 w-4 text-amber-600" />}
          </Button>
          
          {showNotes && (
            <div className="p-4 bg-white">
              <ShoppingListNotes list={list} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
