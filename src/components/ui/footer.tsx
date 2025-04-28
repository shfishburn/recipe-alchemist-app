
import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-gray-50 dark:bg-gray-900 py-8 border-t">
      <div className="container-page">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-medium mb-4">Product</h4>
            <ul className="space-y-2">
              <li><Link to="/recipes" className="text-muted-foreground hover:text-foreground transition-colors">Browse Recipes</Link></li>
              <li><Link to="/build" className="text-muted-foreground hover:text-foreground transition-colors">Create Recipe</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link to="/shopping-lists" className="text-muted-foreground hover:text-foreground transition-colors">Shopping Lists</Link></li>
              <li><Link to="/favorites" className="text-muted-foreground hover:text-foreground transition-colors">Favorites</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">About</Link></li>
              <li><Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t text-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Recipe Alchemist. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
