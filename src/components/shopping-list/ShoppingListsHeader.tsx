
import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage
} from "@/components/ui/breadcrumb";

interface ShoppingListsHeaderProps {
  showBreadcrumb: boolean;
  onBackClick?: () => void;
}

export function ShoppingListsHeader({ showBreadcrumb, onBackClick }: ShoppingListsHeaderProps) {
  if (onBackClick) {
    return (
      <Button 
        variant="ghost" 
        onClick={onBackClick}
        className="mb-4"
      >
        ← Back to lists
      </Button>
    );
  }

  return (
    <>
      {showBreadcrumb && (
        <nav className="mb-4" aria-label="Breadcrumb">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>My Market</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </nav>
      )}
      <h1 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">My Market</h1>
      <p className="text-base text-muted-foreground mb-6 md:mb-8">
        Create and manage shopping lists for your recipes.
      </p>
    </>
  );
}
