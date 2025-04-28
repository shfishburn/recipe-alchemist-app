import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InputsTab from './tabs/InputsTab';
import MediaTab from './tabs/MediaTab';
import SettingsTab from './tabs/SettingsTab';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

export interface RecipeFormData {
  title: string;
  cuisine: string;
  dietary: string;
  flavorTags: string[];
  ingredients: string[];
  url: string;
  servings: number;
  maxCalories: number;
  maxMinutes: number;
  imageFile: File | null;
}

interface RecipeFormProps {
  onSubmit: (formData: RecipeFormData) => void;
  isLoading?: boolean;
}

const RecipeForm = ({ onSubmit, isLoading = false }: RecipeFormProps) => {
  const [activeTab, setActiveTab] = useState('inputs');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  
  const [formData, setFormData] = useState<RecipeFormData>({
    title: '',
    cuisine: 'italian', // Default cuisine
    dietary: 'no-restrictions', // Default dietary preference
    flavorTags: [],
    ingredients: [],
    url: '',
    servings: 2,
    maxCalories: 600,
    maxMinutes: 30,
    imageFile: null,
  });

  const [ingredientInput, setIngredientInput] = useState('');

  const handleAddIngredient = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && ingredientInput.trim()) {
      e.preventDefault();
      setFormData((prev) => ({
        ...prev,
        ingredients: [...prev.ingredients, ingredientInput.trim()],
      }));
      setIngredientInput('');
    }
  };

  const handleRemoveIngredient = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const handleSettingChange = (field: string, value: number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleAdvanced = () => {
    setShowAdvanced(!showAdvanced);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate title is not empty
    if (!formData.title.trim()) {
      toast({
        title: "Missing Recipe Name",
        description: "Please enter a name for your recipe.",
        variant: "destructive",
      });
      return;
    }

    onSubmit(formData);
    setHasGenerated(true);
  };

  const openPreview = () => {
    setPreviewOpen(true);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Recipe Details Section */}
      <div className="space-y-6">
        <InputsTab
          title={formData.title}
          cuisine={formData.cuisine}
          dietary={formData.dietary}
          flavorTags={formData.flavorTags}
          ingredients={formData.ingredients}
          ingredientInput={ingredientInput}
          onTitleChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
          onCuisineChange={(value) => setFormData((prev) => ({ ...prev, cuisine: value }))}
          onDietaryChange={(value) => setFormData((prev) => ({ ...prev, dietary: value }))}
          onFlavorTagsChange={(tags) => setFormData((prev) => ({ ...prev, flavorTags: tags }))}
          onIngredientChange={setIngredientInput}
          onIngredientKeyDown={handleAddIngredient}
          onRemoveIngredient={handleRemoveIngredient}
          servings={formData.servings}
          onServingsChange={(value) => setFormData((prev) => ({ ...prev, servings: value }))}
        />
      </div>
      
      {/* Advanced Options Toggle */}
      <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
        <button 
          type="button" 
          onClick={toggleAdvanced}
          className="flex items-center justify-between w-full text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <span>Advanced Options</span>
          {showAdvanced ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
      </div>
      
      {/* Advanced Options Content */}
      {showAdvanced && (
        <Tabs defaultValue="url" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="url">URL / Image</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="url">
            <MediaTab
              url={formData.url}
              onUrlChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
              onImageSelected={(file) => setFormData((prev) => ({ ...prev, imageFile: file }))}
            />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsTab
              maxCalories={formData.maxCalories}
              maxMinutes={formData.maxMinutes}
              onChange={handleSettingChange}
            />
          </TabsContent>
        </Tabs>
      )}

      {/* Form Footer */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={openPreview}
          className="w-full sm:w-auto flex items-center justify-center"
          disabled={isLoading}
        >
          <Eye className="mr-2 h-4 w-4" />
          Preview Selection
        </Button>
        
        {!hasGenerated && (
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-recipe-blue hover:bg-recipe-blue/90 w-full sm:w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Your Recipe...
              </>
            ) : (
              'Create My Recipe'
            )}
          </Button>
        )}
      </div>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Recipe Selections</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div>
              <h4 className="text-sm font-medium">Title</h4>
              <p className="text-sm text-muted-foreground">
                {formData.title || "AI will suggest a title"}
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium">Cuisine</h4>
              <p className="text-sm text-muted-foreground capitalize">
                {formData.cuisine}
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium">Dietary Preference</h4>
              <p className="text-sm text-muted-foreground capitalize">
                {formData.dietary.replace(/-/g, ' ')}
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium">Flavor Tags</h4>
              <div className="flex flex-wrap gap-2 mt-1">
                {formData.flavorTags.length > 0 ? (
                  formData.flavorTags.map((tag, i) => (
                    <Badge key={i} variant="secondary" className="capitalize">
                      {tag}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No flavor tags selected</p>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium">Main Ingredients</h4>
              <div className="flex flex-wrap gap-2 mt-1">
                {formData.ingredients.length > 0 ? (
                  formData.ingredients.map((ingredient, i) => (
                    <Badge key={i} variant="outline">
                      {ingredient}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No ingredients added</p>
                )}
              </div>
            </div>
            
            {showAdvanced && (
              <>
                <div>
                  <h4 className="text-sm font-medium">Servings</h4>
                  <p className="text-sm text-muted-foreground">{formData.servings}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium">Max Calories</h4>
                  <p className="text-sm text-muted-foreground">{formData.maxCalories} per serving</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium">Max Time</h4>
                  <p className="text-sm text-muted-foreground">{formData.maxMinutes} minutes</p>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </form>
  );
};

export default RecipeForm;
