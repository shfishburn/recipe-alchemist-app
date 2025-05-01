
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import type { ShoppingList, ShoppingListItem } from '@/types/shopping-list';
import { Check, Plus, Trash2, Info, Copy, ClipboardCheck, Search, SortAsc, SortDesc } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";
import { Json } from '@/integrations/supabase/types';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface ShoppingListDetailProps {
  list: ShoppingList;
  onUpdate: () => void;
  onDelete?: (id: string) => Promise<void>;
}

export function ShoppingListDetail({ list, onUpdate, onDelete }: ShoppingListDetailProps) {
  const { toast } = useToast();
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState(1);
  const [newItemUnit, setNewItemUnit] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('Other');
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'dept'>('dept');
  const [expandedDepts, setExpandedDepts] = useState<Record<string, boolean>>({});

  // Group items by department
  const itemsByDepartment = list.items.reduce((acc, item) => {
    const dept = item.department || 'Other';
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(item);
    return acc;
  }, {} as Record<string, ShoppingListItem[]>);

  // Get all departments
  const allDepartments = Object.keys(itemsByDepartment);
  
  // Initialize expanded departments state if not done
  React.useEffect(() => {
    const initial: Record<string, boolean> = {};
    allDepartments.forEach(dept => {
      // By default all departments are expanded
      initial[dept] = true;
    });
    setExpandedDepts(prev => ({...initial, ...prev}));
  }, [allDepartments]);

  // Filter and sort items
  const filteredItems = searchTerm.trim() === '' 
    ? list.items 
    : list.items.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.name.localeCompare(b.name);
    } else if (sortOrder === 'desc') {
      return b.name.localeCompare(a.name);
    } 
    // For 'dept', we'll handle in the rendering
    return 0;
  });

  // Re-group filtered and sorted items if needed
  const groupedItems = sortOrder === 'dept' 
    ? itemsByDepartment 
    : {
        'All Items': sortedItems
      };

  const handleToggleItem = async (index: number) => {
    const updatedItems = [...list.items];
    updatedItems[index] = {
      ...updatedItems[index],
      checked: !updatedItems[index].checked
    };

    const { error } = await supabase
      .from('shopping_lists')
      .update({ items: updatedItems as unknown as Json })
      .eq('id', list.id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update item',
        variant: 'destructive'
      });
    } else {
      onUpdate();
    }
  };

  const handleDeleteItem = async (index: number) => {
    const updatedItems = list.items.filter((_, i) => i !== index);

    const { error } = await supabase
      .from('shopping_lists')
      .update({ items: updatedItems as unknown as Json })
      .eq('id', list.id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete item',
        variant: 'destructive'
      });
    } else {
      onUpdate();
      toast({
        title: 'Success',
        description: 'Item removed from list'
      });
    }
  };
  
  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newItemName.trim()) return;
    
    const newItem: ShoppingListItem = {
      name: newItemName.trim(),
      quantity: newItemQuantity,
      unit: newItemUnit,
      checked: false,
      department: selectedDepartment
    };
    
    const updatedItems = [...list.items, newItem];
    
    const { error } = await supabase
      .from('shopping_lists')
      .update({ items: updatedItems as unknown as Json })
      .eq('id', list.id);
      
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to add item',
        variant: 'destructive'
      });
    } else {
      setNewItemName('');
      setNewItemQuantity(1);
      setNewItemUnit('');
      onUpdate();
    }
  };
  
  const toggleAllInDepartment = async (department: string, checked: boolean) => {
    const updatedItems = list.items.map(item => 
      item.department === department ? {...item, checked} : item
    );
    
    const { error } = await supabase
      .from('shopping_lists')
      .update({ items: updatedItems as unknown as Json })
      .eq('id', list.id);
      
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update items',
        variant: 'destructive'
      });
    } else {
      onUpdate();
    }
  };
  
  const toggleDeptExpanded = (dept: string) => {
    setExpandedDepts(prev => ({
      ...prev,
      [dept]: !prev[dept]
    }));
  };
  
  const copyToClipboard = () => {
    // Format list by departments
    const textByDepartments = Object.entries(itemsByDepartment)
      .map(([department, items]) => {
        const itemTexts = items.map(item => 
          `${item.checked ? '[x]' : '[ ]'} ${item.quantity} ${item.unit} ${item.name}${item.notes ? ` (${item.notes})` : ''}`
        );
        return `## ${department}\n${itemTexts.join('\n')}`;
      }).join('\n\n');
      
    // Add tips and preparation notes if available
    let fullText = textByDepartments;
    
    if (list.tips && list.tips.length > 0) {
      fullText += '\n\n## Shopping Tips\n';
      fullText += list.tips.map(tip => `- ${tip}`).join('\n');
    }
    
    if (list.preparation_notes && list.preparation_notes.length > 0) {
      fullText += '\n\n## Preparation Notes\n';
      fullText += list.preparation_notes.map(note => `- ${note}`).join('\n');
    }
    
    navigator.clipboard.writeText(fullText)
      .then(() => {
        setCopied(true);
        toast({
          title: "Copied to clipboard",
          description: "Shopping list copied to clipboard"
        });
        
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        toast({
          title: "Copy failed",
          description: "Could not copy to clipboard",
          variant: "destructive"
        });
      });
  };

  return (
    <Card className="p-4 md:p-6">
      <CardHeader className="px-0 pt-0">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <CardTitle className="text-2xl font-bold">{list.title}</CardTitle>
          <div className="flex gap-2">
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(list.id)}
                className="flex items-center gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                Delete List
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              className="flex items-center gap-2"
            >
              {copied ? (
                <>
                  <ClipboardCheck className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy List
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="px-0">
        {/* Shopping Tips */}
        {list.tips && list.tips.length > 0 && (
          <div className="mb-6 p-4 bg-muted rounded-md">
            <h3 className="font-medium mb-2">Shopping Tips:</h3>
            <ul className="list-disc list-inside space-y-1">
              {list.tips.map((tip, index) => (
                <li key={index} className="text-sm text-muted-foreground">{tip}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Preparation Notes */}
        {list.preparation_notes && list.preparation_notes.length > 0 && (
          <div className="mb-6 p-4 bg-muted/50 rounded-md">
            <h3 className="font-medium mb-2">Preparation Notes:</h3>
            <ul className="list-disc list-inside space-y-1">
              {list.preparation_notes.map((note, index) => (
                <li key={index} className="text-sm text-muted-foreground">{note}</li>
              ))}
            </ul>
          </div>
        )}
        
        {/* List controls */}
        <div className="mb-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search items"
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select 
            value={sortOrder} 
            onValueChange={(value) => setSortOrder(value as 'asc' | 'desc' | 'dept')}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dept">By Department</SelectItem>
              <SelectItem value="asc">Name A-Z</SelectItem>
              <SelectItem value="desc">Name Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Add new item form */}
        <form className="mb-6 p-4 border rounded-md" onSubmit={handleAddItem}>
          <h3 className="font-medium mb-3">Add New Item</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-2">
              <Label htmlFor="itemName">Item Name</Label>
              <Input
                id="itemName"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Enter item name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="itemQty">Quantity</Label>
              <Input
                id="itemQty"
                type="number"
                min="0"
                step="any"
                value={newItemQuantity}
                onChange={(e) => setNewItemQuantity(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="itemUnit">Unit</Label>
              <Input
                id="itemUnit"
                value={newItemUnit}
                onChange={(e) => setNewItemUnit(e.target.value)}
                placeholder="e.g., g, kg, cup"
                className="mt-1"
              />
            </div>
            <div className="md:col-span-3">
              <Label htmlFor="itemDept">Department</Label>
              <Select 
                value={selectedDepartment} 
                onValueChange={setSelectedDepartment}
              >
                <SelectTrigger id="itemDept" className="mt-1">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {/* Include existing departments */}
                  {allDepartments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                  {/* Add common departments if they don't exist */}
                  {!allDepartments.includes('Produce') && <SelectItem value="Produce">Produce</SelectItem>}
                  {!allDepartments.includes('Dairy') && <SelectItem value="Dairy">Dairy</SelectItem>}
                  {!allDepartments.includes('Meat') && <SelectItem value="Meat">Meat</SelectItem>}
                  {!allDepartments.includes('Pantry') && <SelectItem value="Pantry">Pantry</SelectItem>}
                  {!allDepartments.includes('Other') && <SelectItem value="Other">Other</SelectItem>}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-1">
              <Label className="invisible">Add</Label>
              <Button type="submit" className="w-full mt-1" disabled={!newItemName.trim()}>
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
          </div>
        </form>
        
        {/* Shopping list items */}
        <div className="space-y-4">
          {Object.entries(groupedItems).map(([department, items]) => {
            if (items.length === 0) return null;
            
            const deptCompleted = items.every(item => item.checked);
            const deptPartial = items.some(item => item.checked) && !deptCompleted;
            const isExpanded = expandedDepts[department] !== false; // Default to true
            
            return (
              <div key={department} className="border rounded-md overflow-hidden">
                <div 
                  className={`px-3 py-2 flex items-center justify-between gap-2 bg-muted/30 cursor-pointer ${
                    deptCompleted ? 'bg-muted/40 text-muted-foreground' : ''
                  }`}
                  onClick={() => toggleDeptExpanded(department)}
                >
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      checked={deptCompleted}
                      onCheckedChange={(checked) => {
                        toggleAllInDepartment(department, Boolean(checked));
                        event?.stopPropagation();
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <h3 className="font-medium text-sm">
                      {department}
                      <span className="ml-2 text-xs font-normal text-muted-foreground">
                        ({items.filter(item => item.checked).length}/{items.length})
                      </span>
                    </h3>
                  </div>
                  <div>{isExpanded ? '▼' : '▶'}</div>
                </div>
                
                {isExpanded && (
                  <div className="divide-y">
                    {items.map((item, idx) => {
                      const itemIndex = list.items.findIndex(
                        i => i.name === item.name && i.unit === item.unit && i.department === item.department
                      );
                      
                      if (itemIndex === -1) return null;
                      
                      return (
                        <div 
                          key={`${department}-${idx}`} 
                          className="flex items-center gap-2 p-3 hover:bg-muted/20"
                        >
                          <Checkbox
                            checked={item.checked}
                            onCheckedChange={() => handleToggleItem(itemIndex)}
                          />
                          <div 
                            className={`flex-1 ${item.checked ? 'line-through text-muted-foreground' : ''}`}
                          >
                            <span className="flex items-center gap-2">
                              <span>
                                {item.quantity} {item.unit} <strong>{item.name}</strong>
                                {item.notes && <span className="text-sm text-muted-foreground ml-1">({item.notes})</span>}
                              </span>
                              {(item.quality_indicators || item.storage_tips) && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Info className="h-4 w-4 text-muted-foreground" />
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs">
                                      {item.quality_indicators && (
                                        <p className="mb-1">{item.quality_indicators}</p>
                                      )}
                                      {item.storage_tips && (
                                        <p className="text-sm text-muted-foreground">{item.storage_tips}</p>
                                      )}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </span>
                            {item.alternatives?.length > 0 && (
                              <span className="block text-sm text-muted-foreground">
                                Alternatives: {item.alternatives.join(', ')}
                              </span>
                            )}
                            {item.pantry_staple && (
                              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded ml-2">
                                Pantry Staple
                              </span>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteItem(itemIndex)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
