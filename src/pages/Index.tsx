
import React from 'react';
import Navbar from '@/components/ui/navbar';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index = () => {
  console.log('Rendering Index page');
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        
        {/* CTA Section */}
        <section className="py-20">
          <div className="container-page">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="font-bold">Ready to transform your cooking?</h2>
              <p className="text-xl text-muted-foreground">
                Start creating personalized recipes tailored to your preferences today.
              </p>
              <div>
                <Button asChild size="lg" className="bg-recipe-blue hover:bg-recipe-blue/90">
                  <Link to="/build">Create Your First Recipe</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="bg-gray-50 dark:bg-gray-900 py-12 border-t">
          <div className="container-page">
            <div className="flex flex-col md:flex-row justify-between">
              <div className="mb-8 md:mb-0">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-recipe-blue/10 flex items-center justify-center">
                    <span className="text-recipe-blue text-xl font-bold">R</span>
                  </div>
                  <span className="font-bold text-lg">Recipe Alchemist</span>
                </div>
                <p className="mt-4 text-muted-foreground max-w-xs">
                  Transform your cooking with AI-powered healthy recipes
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                <div>
                  <h4 className="font-medium mb-4">Product</h4>
                  <ul className="space-y-2">
                    <li><Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">Features</Link></li>
                    <li><Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</Link></li>
                    <li><Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</Link></li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-4">Company</h4>
                  <ul className="space-y-2">
                    <li><Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">About</Link></li>
                    <li><Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">Blog</Link></li>
                    <li><Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-4">Legal</h4>
                  <ul className="space-y-2">
                    <li><Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms</Link></li>
                    <li><Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</Link></li>
                    <li><Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">Cookies</Link></li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="mt-12 pt-8 border-t text-center">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Recipe Alchemist. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
