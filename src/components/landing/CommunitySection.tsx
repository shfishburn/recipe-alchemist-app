
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export function CommunitySection() {
  return (
    <section className="py-12 md:py-16 bg-muted/30">
      <div className="container-page">
        <h2 className="text-3xl font-bold mb-8 text-center">Join Our Community</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Share Recipes", description: "Contribute your favorite recipes to our growing community." },
            { title: "Get Feedback", description: "Receive nutrition advice and improvement suggestions." },
            { title: "Stay Inspired", description: "Discover new dishes that match your dietary preferences." }
          ].map((card, i) => (
            <Card key={i} className="text-center">
              <CardContent className="pt-6">
                <div className="bg-primary/20 text-primary rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  {i + 1}
                </div>
                <h3 className="font-bold text-xl mb-2">{card.title}</h3>
                <p className="text-muted-foreground">{card.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
