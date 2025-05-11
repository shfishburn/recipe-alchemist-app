
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ModificationHistoryEntry } from '@/hooks/recipe-modifications';

interface ModificationHistoryProps {
  historyItems: ModificationHistoryEntry[];
}

export const ModificationHistory: React.FC<ModificationHistoryProps> = ({ historyItems }) => {
  if (historyItems.length === 0) return null;

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="history">
        <AccordionTrigger>Modification History</AccordionTrigger>
        <AccordionContent>
          <ScrollArea className="h-[300px] w-full rounded-md border">
            <div className="p-4 space-y-4">
              {historyItems.map((entry, index) => (
                <Card key={index} className="shadow-sm">
                  <CardHeader>
                    <CardTitle>Request: {entry.request}</CardTitle>
                    <CardDescription>Timestamp: {entry.timestamp}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Reasoning: {entry.response.reasoning}</p>
                    <p>Applied: {entry.applied ? 'Yes' : 'No'}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
