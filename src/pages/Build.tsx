
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/ui/navbar';
import RecipeForm, { RecipeFormData } from '@/components/recipe-builder/RecipeForm';
import BuildHeader from '@/components/recipe-builder/BuildHeader';
import { useRecipeGenerator } from '@/hooks/use-recipe-generator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { ChevronRight } from 'lucide-react';

const Build = () => {
  const { generateRecipe, isLoading } = useRecipeGenerator();
  const { toast } = useToast();
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !session) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create recipes.",
        variant: "destructive",
      });
      navigate('/auth', { state: { from: '/build' } });
    }
  }, [session, loading, navigate, toast]);

  const handleSubmit = async (formData: RecipeFormData) => {
    // Validate minimum requirements
    if (!formData.cuisine) {
      toast({
        title: "Missing information",
        description: "Please select a cuisine type.",
        variant: "destructive",
      });
      return;
    }

    // Generate the recipe (saving and navigation are handled in the hook)
    await generateRecipe(formData);
  };

  // Show loading when checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
        </div>
      </div>
    );
  }

  // Only render the form if authenticated
  if (!session) {
    return null; // This prevents flash before redirect
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 animate-fadeIn">
        <div className="container-page py-6 md:py-8 flex-grow">
          {/* Breadcrumb Navigation */}
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>My Lab</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <BuildHeader />
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6 mb-8 md:mb-12">
            <div className="mb-6 text-center">
              <p className="text-muted-foreground">Create your perfect recipe by filling out the details below or leave fields blank for AI suggestions</p>
            </div>
            <RecipeForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Build;
