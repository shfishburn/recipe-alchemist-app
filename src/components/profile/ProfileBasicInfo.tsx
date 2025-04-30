
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User } from '@supabase/supabase-js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useUnitSystem } from '@/hooks/use-unit-system';
import { Separator } from '@/components/ui/separator';

interface ProfileBasicInfoProps {
  user: User;
  profileData: any;
  onUpdate: (data: any) => void;
}

export function ProfileBasicInfo({ user, profileData, onUpdate }: ProfileBasicInfoProps) {
  const { toast } = useToast();
  const { unitSystem, updateUnitSystem } = useUnitSystem();
  
  const form = useForm({
    defaultValues: {
      username: profileData?.username || '',
      unitSystem: unitSystem || 'metric'
    }
  });
  
  const onSubmit = async (data: any) => {
    try {
      // Get current nutrition preferences
      const currentPrefs = profileData?.nutrition_preferences || {};
      
      // Update nutrition preferences with unit system
      const updatedPrefs = {
        ...currentPrefs,
        unitSystem: data.unitSystem
      };
      
      const { error } = await supabase
        .from('profiles')
        .update({
          username: data.username,
          nutrition_preferences: updatedPrefs
        })
        .eq('id', user.id);
        
      if (error) {
        console.error('Error updating profile:', error);
        toast({
          title: 'Error',
          description: 'Failed to update profile',
          variant: 'destructive'
        });
        return;
      }
      
      // Update unit system globally
      if (data.unitSystem !== unitSystem) {
        updateUnitSystem(data.unitSystem);
      }
      
      onUpdate({
        username: data.username,
        nutrition_preferences: updatedPrefs
      });
      
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    } catch (err) {
      console.error('Profile update error:', err);
      toast({
        title: 'Error',
        description: 'Something went wrong',
        variant: 'destructive'
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              {...form.register('username', { required: 'Username is required' })}
            />
            {form.formState.errors.username && (
              <p className="text-sm text-destructive">{form.formState.errors.username.message?.toString()}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={user.email || ''}
              disabled
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
                <FormLabel>Preferred Unit System</FormLabel>
                <FormControl>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select unit system" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="metric">Metric (kg, cm)</SelectItem>
                      <SelectItem value="imperial">Imperial (lb, ft/in)</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <p className="text-xs text-muted-foreground">
                  This setting affects how measurements are displayed throughout the app
                </p>
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
