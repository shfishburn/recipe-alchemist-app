
import React from 'react';
import Navbar from '@/components/ui/navbar';
import RecipeForm, { RecipeFormData } from '@/components/recipe-builder/RecipeForm';
import BuildHeader from '@/components/recipe-builder/BuildHeader';
import { useRecipeGenerator } from '@/hooks/use-recipe-generator';
import { useToast } from '@/hooks/use-toast';
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container-page py-8 md:py-12">
          <div className="max-w-3xl mx-auto">
            <Breadcrumb className="mb-4">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage>Create Recipe</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            
            <BuildHeader />
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6">
              <div className="mb-6 text-center">
                <p className="text-muted-foreground">Create your perfect recipe by filling out the details below or leave fields blank for AI suggestions</p>
              </div>
              <RecipeForm onSubmit={handleSubmit} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Build;
