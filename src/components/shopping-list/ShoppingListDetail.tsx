
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { ShoppingList } from '@/types/shopping-list';
import { ShoppingListHeader } from './detail/ShoppingListHeader';
import { ShoppingListNotes } from './detail/ShoppingListNotes';
import { ShoppingListControls } from './detail/ShoppingListControls';
import { AddItemForm } from './detail/AddItemForm';
import { ShoppingListItemsView } from './detail/ShoppingListItemsView';
import { useShoppingList } from '@/hooks/use-shopping-list';

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

  return (
    <Card className="p-4 md:p-6">
      <ShoppingListHeader 
        list={list} 
        onDelete={onDelete}
        itemsByDepartment={itemsByDepartment}
        onCopyToClipboard={copyToClipboard}
      />
      
      <CardContent className="px-0">
        <ShoppingListNotes list={list} />
        
        <ShoppingListControls 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
        />
        
        <AddItemForm 
          onAddItem={handleAddItem}
          availableDepartments={allDepartments}
        />
        
        <ShoppingListItemsView
          groupedItems={groupedItems}
          expandedDepts={expandedDepts}
          onToggleDept={toggleDeptExpanded}
          onToggleDepartmentItems={toggleAllInDepartment}
          onToggleItem={handleToggleItem}
          onDeleteItem={handleDeleteItem}
          getItemIndex={getItemIndex}
        />
      </CardContent>
    </Card>
  );
}
