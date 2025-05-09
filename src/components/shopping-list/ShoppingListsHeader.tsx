
import React from 'react';
import { Button } from '@/components/ui/button';
import { BreadcrumbNav } from '@/components/ui/breadcrumb-nav';
import type { BreadcrumbItem } from '@/components/ui/breadcrumb-nav';

interface ShoppingListsHeaderProps {
  showBreadcrumb: boolean;
  onBackClick?: () => void;
  listTitle?: string;
}

export function ShoppingListsHeader({ showBreadcrumb, onBackClick, listTitle }: ShoppingListsHeaderProps) {
  if (onBackClick) {
    // Create breadcrumbs for individual list view
    const breadcrumbItems: BreadcrumbItem[] = [
      { label: 'Home', href: '/' },
      { label: 'My Market', href: '/shopping-lists' },
      { label: listTitle || 'List Details', current: true }
    ];
    
    return (
      <div className="mb-6">
        <BreadcrumbNav items={breadcrumbItems} />
        <Button 
          variant="ghost" 
          onClick={onBackClick}
          className="mb-4"
        >
          ← Back to lists
        </Button>
      </div>
    );
  }

  if (showBreadcrumb) {
    // Create breadcrumbs for shopping lists overview
    const breadcrumbItems: BreadcrumbItem[] = [
      { label: 'Home', href: '/' },
      { label: 'My Market', current: true }
    ];
    
    return (
      <div className="mb-6">
        <BreadcrumbNav items={breadcrumbItems} />
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">My Market</h1>
        <p className="text-base text-muted-foreground mb-6 md:mb-8">
          Create and manage shopping lists for your recipes.
        </p>
      </div>
    );
  }

  // Standard header without breadcrumbs
  return (
    <div className="mb-6">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">My Market</h1>
      <p className="text-base text-muted-foreground mb-6 md:mb-8">
        Create and manage shopping lists for your recipes.
      </p>
    </div>
  );
}
