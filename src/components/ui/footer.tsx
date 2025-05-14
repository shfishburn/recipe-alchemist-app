
import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background py-4 sm:py-12 border-t mt-auto shadow-elevation-1">
      <div className="container-page">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-12">
          {/* Logo and Description */}
          <div className="col-span-1">
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/recipe-alchemy-logo.png" 
                alt="Recipe Alchemy Logo" 
                className="h-10 sm:h-12 w-auto"
              />
            </Link>
            <p className="mt-2 md:mt-4 text-sm text-muted-foreground material-body-medium">
              Transform your cooking experience with AI-powered recipe creation and personalization.
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="material-title-medium font-semibold mb-2 sm:mb-4">Company</h4>
            <ul className="space-y-1.5 sm:space-y-3">
              <li><Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link></li>
              <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
              <li><Link to="/how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</Link></li>
              <li><Link to="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="material-title-medium font-semibold mb-2 sm:mb-4">Legal</h4>
            <ul className="space-y-1.5 sm:space-y-3">
              <li><Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link to="/cookies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Social Links and Copyright - More compact on mobile */}
        <div className="mt-4 sm:mt-12 pt-3 sm:pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
          <p className="text-xs sm:text-sm text-muted-foreground order-2 sm:order-1 material-body-small">
            © {currentYear} Recipe Alchemy. All rights reserved.
          </p>
          <div className="flex space-x-3 sm:space-x-4 order-1 sm:order-2">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
              <Instagram size={16} className="sm:size-18" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
