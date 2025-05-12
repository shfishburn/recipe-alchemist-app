
import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MediaTab from '../tabs/MediaTab';
import SettingsTab from '../tabs/SettingsTab';

interface AdvancedOptionsProps {
  showAdvanced: boolean;
  onToggleAdvanced: () => void;
  activeTab: string;
  onTabChange: (value: string) => void;
  url: string;
  onUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageSelected: (file: File) => void;
  maxCalories: number;
  onSettingChange: (field: string, value: number) => void;
}

const AdvancedOptions = ({
  showAdvanced,
  onToggleAdvanced,
  activeTab,
  onTabChange,
  url,
  onUrlChange,
  onImageSelected,
  maxCalories,
  onSettingChange,
}: AdvancedOptionsProps) => {
  return (
    <div className="space-y-4">
      <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
        <button 
          type="button" 
          onClick={onToggleAdvanced}
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
      
      {showAdvanced && (
        <Tabs defaultValue="url" value={activeTab} onValueChange={onTabChange}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="url">URL / Image</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="url">
            <MediaTab
              url={url}
              onUrlChange={onUrlChange}
              onImageSelected={onImageSelected}
            />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsTab
              maxCalories={maxCalories}
              onChange={onSettingChange}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default AdvancedOptions;
