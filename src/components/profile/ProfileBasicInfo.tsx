
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useProfile } from '@/contexts/ProfileContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useUnitSystem } from '@/hooks/use-unit-system';
import { Separator } from '@/components/ui/separator';
import { UnitSystemToggle } from '@/components/ui/unit-system-toggle';
import { SaveLoader } from './SaveLoader';
import { ErrorDisplay } from './ErrorDisplay';

// Form validation schema
const formSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }).max(50),
  unitSystem: z.enum(['metric', 'imperial'])
});

type FormValues = z.infer<typeof formSchema>;

export function ProfileBasicInfo() {
  const { user } = useAuth();
  const { profile, isLoading, isSaving, error, updateProfile, refreshProfile } = useProfile();
  const { unitSystem, updateUnitSystem } = useUnitSystem();
  const { toast } = useToast();
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      unitSystem: unitSystem as 'metric' | 'imperial'
    }
  });
  
  // Update form values when profile data is loaded
  useEffect(() => {
    if (profile) {
      form.reset({
        username: profile.username || '',
        unitSystem: (profile.nutrition_preferences?.unitSystem as 'metric' | 'imperial') || unitSystem as 'metric' | 'imperial'
      });
    }
  }, [profile, form, unitSystem]);
  
  const onSubmit = async (data: FormValues) => {
    if (!user?.id) return;

    try {
      // Get current nutrition preferences
      const currentPrefs = profile?.nutrition_preferences || {};
      
      // Update nutrition preferences with unit system
      const updatedPrefs = {
        ...currentPrefs,
        unitSystem: data.unitSystem
      };
      
      const success = await updateProfile({
        username: data.username,
        nutrition_preferences: updatedPrefs
      });
      
      if (success) {
        // Update unit system globally
        if (data.unitSystem !== unitSystem) {
          updateUnitSystem(data.unitSystem);
        }
        
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
      }
    } catch (err) {
      console.error('Profile update error:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="space-y-2">
          <div className="h-5 w-24 bg-gray-200 rounded"></div>
          <div className="h-10 w-full bg-gray-200 rounded"></div>
        </div>
        <div className="space-y-2 mt-6">
          <div className="h-5 w-32 bg-gray-200 rounded"></div>
          <div className="h-10 w-full bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      {error && (
        <ErrorDisplay 
          error={error} 
          onRetry={refreshProfile}
          title="Error Loading Profile" 
        />
      )}
    
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="username">Username</FormLabel>
                  <FormControl>
                    <Input
                      id="username"
                      placeholder="Enter username"
                      aria-describedby="username-description"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription id="username-description">
                    This is your public username that other users will see.
                  </FormDescription>
                  <FormMessage aria-live="polite" />
                </FormItem>
              )}
            />
            
            <div className="space-y-2">
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                id="email"
                value={user?.email || ''}
                disabled
                aria-disabled="true"
              />
              <p className="text-xs text-muted-foreground">Contact support to change your email</p>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-4">
            <h3 className="font-medium">Global Application Settings</h3>
            
            <FormField
              control={form.control}
              name="unitSystem"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="unitSystem">Preferred Unit System</FormLabel>
                  <Select 
                    value={field.value} 
                    onValueChange={field.onChange}
                    disabled={isSaving}
                  >
                    <FormControl>
                      <SelectTrigger id="unitSystem" className="w-full">
                        <SelectValue placeholder="Select unit system" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="metric">Metric (kg, cm)</SelectItem>
                      <SelectItem value="imperial">Imperial (lb, ft/in)</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center justify-between mt-2">
                    <FormDescription>
                      This setting affects how measurements are displayed throughout the app
                    </FormDescription>
                    <UnitSystemToggle size="sm" />
                  </div>
                </FormItem>
              )}
            />
          </div>
          
          <div className="flex items-center justify-end gap-4 pt-2">
            <SaveLoader isSaving={isSaving} showSuccess={saveSuccess} />
            <Button type="submit" disabled={isLoading || isSaving}>
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}

export default ProfileBasicInfo;
