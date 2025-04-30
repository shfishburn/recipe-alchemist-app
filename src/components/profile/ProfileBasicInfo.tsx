
import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User } from '@supabase/supabase-js';

interface ProfileBasicInfoProps {
  user: User;
  profileData: any;
  onUpdate: (data: any) => void;
}

export function ProfileBasicInfo({ user, profileData, onUpdate }: ProfileBasicInfoProps) {
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      username: profileData?.username || '',
      weight_goal_type: profileData?.weight_goal_type || 'maintenance',
      weight_goal_deficit: profileData?.weight_goal_deficit || 0
    }
  });

  const onSubmit = async (data: any) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: data.username,
          weight_goal_type: data.weight_goal_type,
          weight_goal_deficit: parseInt(data.weight_goal_deficit) || 0
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
      
      onUpdate(data);
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
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                {...register('username', { required: 'Username is required' })}
              />
              {errors.username && (
                <p className="text-sm text-destructive">{errors.username.message?.toString()}</p>
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
            
            <div className="space-y-2">
              <Label htmlFor="weight_goal_type">Weight Goal</Label>
              <select
                id="weight_goal_type"
                className="w-full rounded-md border border-input bg-background px-3 h-10"
                {...register('weight_goal_type')}
              >
                <option value="maintenance">Maintenance</option>
                <option value="loss">Weight Loss</option>
                <option value="gain">Weight Gain</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="weight_goal_deficit">Daily Calorie Adjustment</Label>
              <Input
                id="weight_goal_deficit"
                type="number"
                {...register('weight_goal_deficit')}
              />
              <p className="text-xs text-muted-foreground">
                Calories to add/subtract per day (positive for gain, negative for loss)
              </p>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
