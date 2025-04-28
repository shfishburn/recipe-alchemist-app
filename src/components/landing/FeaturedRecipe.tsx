
import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const sampleRecipe = {
  title: "Spicy Japanese Curry",
  description: "A rich, spicy Japanese curry with tender chicken, potatoes, and carrots in a thick, aromatic sauce.",
  ingredients: [
    { qty: 2, unit: "tablespoons", item: "canola oil" },
    { qty: 1, unit: "pound", item: "boneless chicken thighs, cut into 1-inch pieces" },
    { qty: 1, unit: "large", item: "onion, diced" },
    { qty: 2, unit: "medium", item: "carrots, cut into 1/2-inch pieces" },
    { qty: 2, unit: "medium", item: "potatoes, cut into 1-inch cubes" },
    { qty: 4, unit: "cloves", item: "garlic, minced" },
    { qty: 1, unit: "tablespoon", item: "ginger, grated" },
    { qty: 1, unit: "box", item: "Japanese curry roux (220g)" },
    { qty: 4, unit: "cups", item: "chicken stock" },
    { qty: 1, unit: "tablespoon", item: "soy sauce" },
    { qty: 1, unit: "teaspoon", item: "honey" }
  ],
  instructions: [
    "Heat **2 tablespoons canola oil** in a large pot over medium-high heat. Add **1 pound chicken thighs** and sear until golden-brown on all sides.",
    "Add **1 diced onion** and cook until softened, about 5 minutes. Add **2 carrots** and **2 potatoes**, cooking for another 3 minutes.",
    "Stir in **4 cloves minced garlic** and **1 tablespoon grated ginger**, cooking until fragrant, about 1 minute.",
    "Pour in **4 cups chicken stock** and bring to a boil. Reduce heat, cover, and simmer for 15 minutes or until vegetables are tender.",
    "Break up **1 box curry roux** into pieces and add to the pot. Stir until completely dissolved.",
    "Add **1 tablespoon soy sauce** and **1 teaspoon honey**. Simmer for 5-10 minutes until the sauce thickens.",
    "Serve hot over steamed rice."
  ]
};

export function FeaturedRecipe() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container-page">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-recipe-blue" />
                Featured Recipe
              </CardTitle>
              <Button asChild variant="outline">
                <Link to="/recipes/d2f44866-5ee9-4dc4-8537-21f01ed42ac2">
                  View Full Recipe
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">{sampleRecipe.title}</h3>
                <p className="text-muted-foreground">{sampleRecipe.description}</p>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Quantity</TableHead>
                    <TableHead className="w-[100px]">Unit</TableHead>
                    <TableHead>Ingredient</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleRecipe.ingredients.map((ingredient, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{ingredient.qty}</TableCell>
                      <TableCell>{ingredient.unit}</TableCell>
                      <TableCell>{ingredient.item}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div>
                <h4 className="font-semibold mb-4">Instructions</h4>
                <ol className="list-decimal list-inside space-y-2">
                  {sampleRecipe.instructions.map((step, index) => (
                    <li key={index} className="text-muted-foreground ml-4">
                      <span className="text-foreground">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
