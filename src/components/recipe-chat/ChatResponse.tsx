
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Check, Loader2 } from 'lucide-react';

interface ChatResponseProps {
  response: string;
  changesSuggested: any;
  followUpQuestions?: string[];
  setMessage: (message: string) => void;
  onApplyChanges: () => void;
  isApplying: boolean;
  applied: boolean;
}

export function ChatResponse({
  response,
  changesSuggested,
  followUpQuestions,
  setMessage,
  onApplyChanges,
  isApplying,
  applied
}: ChatResponseProps) {
  const renderFormattedResponse = (response: string) => {
    if (!response) return null;
    
    const sections = [];
    let currentSection = { heading: '', content: [] };
    
    response.split('\n').forEach(line => {
      const trimmedLine = line.trim();
      
      if (trimmedLine.endsWith(':') && !trimmedLine.includes('\u2022') && !trimmedLine.includes('-')) {
        if (currentSection.content.length > 0 || currentSection.heading) {
          sections.push({...currentSection});
        }
        currentSection = { 
          heading: trimmedLine, 
          content: []
        };
      } else if (trimmedLine) {
        currentSection.content.push(trimmedLine);
      }
    });
    
    if (currentSection.content.length > 0 || currentSection.heading) {
      sections.push(currentSection);
    }
    
    return (
      <div className="space-y-4">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-2">
            {section.heading && (
              <h3 className="font-semibold text-base">{section.heading}</h3>
            )}
            
            {section.content.map((paragraph, pIdx) => {
              if (paragraph.startsWith('\u2022') || paragraph.startsWith('-')) {
                const bulletItems = section.content
                  .filter(line => line.startsWith('\u2022') || line.startsWith('-'))
                  .map(line => line.replace(/^[\u2022-]\s*/, ''));
                  
                return pIdx === section.content.indexOf(paragraph) ? (
                  <ul key={pIdx} className="list-disc list-outside ml-5 space-y-1">
                    {bulletItems.map((item, iIdx) => (
                      <li key={iIdx}>{item}</li>
                    ))}
                  </ul>
                ) : null;
              }
              
              if (!paragraph.startsWith('\u2022') && !paragraph.startsWith('-')) {
                return <p key={pIdx} className="text-sm text-muted-foreground">{paragraph}</p>;
              }
              
              return null;
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-[85%] space-y-3">
      <div className="bg-white px-4 py-2 rounded-[20px] rounded-tl-[5px] shadow-sm">
        <div className="prose prose-sm max-w-none text-[#221F26]">
          {renderFormattedResponse(response)}
        </div>
      </div>

      {changesSuggested?.scientific_principles && changesSuggested.scientific_principles.length > 0 && (
        <div className="bg-white/80 px-4 py-3 rounded-[20px] shadow-sm">
          <h4 className="font-medium mb-2 flex items-center gap-1 text-[#221F26]">
            Scientific Principles:
          </h4>
          <ul className="list-disc list-inside space-y-1">
            {changesSuggested.scientific_principles.map((principle: string, i: number) => (
              <li key={i} className="text-sm">{principle}</li>
            ))}
          </ul>
        </div>
      )}

      {changesSuggested?.nutrition && Object.keys(changesSuggested.nutrition).length > 0 && (
        <div className="bg-white/80 px-4 py-3 rounded-[20px] shadow-sm">
          <h4 className="font-medium mb-2 text-[#221F26]">Nutritional Impact:</h4>
          <Table>
            <TableBody>
              {Object.entries(changesSuggested.nutrition).map(([key, value]) => (
                <TableRow key={key}>
                  <TableCell className="py-1 px-2 capitalize font-medium">{key.replace(/_/g, ' ')}</TableCell>
                  <TableCell className="py-1 px-2 text-right">{value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {changesSuggested?.health_insights && changesSuggested.health_insights.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {changesSuggested.health_insights.map((insight: string, i: number) => (
            <Badge key={i} variant="secondary" className="bg-white/80">{insight}</Badge>
          ))}
        </div>
      )}

      {followUpQuestions && followUpQuestions.length > 0 && (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {followUpQuestions.map((question, qIndex) => (
              <Button
                key={qIndex}
                variant="outline"
                size="sm"
                onClick={() => setMessage(question)}
                className="bg-white/80 hover:bg-white"
              >
                {question}
              </Button>
            ))}
          </div>
        </div>
      )}

      {changesSuggested && !applied && (
        <div>
          <Button
            onClick={onApplyChanges}
            disabled={isApplying}
            className="gap-2 bg-[#9b87f5] hover:bg-[#8b77e5]"
          >
            {isApplying ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            Apply Scientific Improvements
          </Button>
        </div>
      )}

      {applied && (
        <p className="text-sm text-green-500 flex items-center gap-1">
          <Check className="h-3 w-3" /> Improvements applied
        </p>
      )}
    </div>
  );
}
