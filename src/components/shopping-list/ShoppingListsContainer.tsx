
import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ShoppingListsHeader } from '@/components/shopping-list/ShoppingListsHeader';
import { ShoppingListsView } from '@/components/shopping-list/ShoppingListsView';
import { ShoppingListDetail } from '@/components/shopping-list/ShoppingListDetail';
import { DeleteListDialog } from '@/components/shopping-list/DeleteListDialog';
import { useShoppingLists } from '@/hooks/use-shopping-lists';

export function ShoppingListsContainer() {
  const {
    shoppingLists,
    isLoading,
    newListTitle,
    setNewListTitle,
    selectedList,
    setSelectedList,
    searchTerm,
    setSearchTerm,
    deleteDialogOpen,
    setDeleteDialogOpen,
    isDeleting,
    handleDeleteList,
    confirmDeleteList,
    createNewList,
    refetch,
    session
  } = useShoppingLists();

  if (!session) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center p-6">
          <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="mb-4">Please log in to view your shopping lists</p>
          <Button asChild>
            <Link to="/auth">Log In</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <ShoppingListsHeader 
        showBreadcrumb={!selectedList} 
        onBackClick={selectedList ? () => setSelectedList(null) : undefined} 
      />
      
      {selectedList ? (
        <ShoppingListDetail 
          list={selectedList} 
          onUpdate={refetch} 
          onDelete={handleDeleteList}
        />
      ) : (
        <ShoppingListsView
          isLoading={isLoading}
          lists={shoppingLists}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          newListTitle={newListTitle}
          onNewListTitleChange={setNewListTitle}
          onCreateList={createNewList}
          onSelectList={setSelectedList}
          onDeleteList={handleDeleteList}
        />
      )}

      <DeleteListDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDeleteList}
        isDeleting={isDeleting}
      />
    </>
  );
}
