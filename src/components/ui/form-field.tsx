
import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  /**
   * Label text for the form field
   */
  label?: string;
  
  /**
   * Error message to display
   */
  error?: string;
  
  /**
   * Help text for the field
   */
  helperText?: string;
  
  /**
   * If true, field will be rendered as a textarea
   */
  multiline?: boolean;
  
  /**
   * Number of rows for textarea (only applies if multiline=true)
   */
  rows?: number;
  
  /**
   * If true, applies a disabled appearance
   */
  isDisabled?: boolean;
  
  /**
   * If true, applies a readonly appearance
   */
  isReadOnly?: boolean;
  
  /**
   * If true, field is required
   */
  isRequired?: boolean;
  
  /**
   * Additional className for the container
   */
  containerClassName?: string;
  
  /**
   * Additional className for the input/textarea
   */
  inputClassName?: string;
  
  /**
   * Additional className for the label
   */
  labelClassName?: string;
}

/**
 * FormField component for standardized form input rendering
 */
export const FormField = forwardRef<HTMLInputElement | HTMLTextAreaElement, FormFieldProps>(
  ({
    label,
    error,
    helperText,
    multiline = false,
    rows = 3,
    isDisabled = false,
    isReadOnly = false, 
    isRequired = false,
    className,
    containerClassName,
    inputClassName,
    labelClassName,
    id,
    ...props
  }, ref) => {
    // Generate an ID if not provided
    const fieldId = id || `field-${Math.random().toString(36).substring(2, 9)}`;
    
    return (
      <div className={cn("space-y-2", containerClassName)}>
        {label && (
          <Label 
            htmlFor={fieldId} 
            className={cn(
              error && "text-destructive",
              labelClassName
            )}
          >
            {label}
            {isRequired && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}
        
        {multiline ? (
          <Textarea
            id={fieldId}
            ref={ref as React.RefObject<HTMLTextAreaElement>}
            rows={rows}
            className={cn(
              error && "border-destructive",
              isDisabled && "opacity-60 cursor-not-allowed",
              inputClassName
            )}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${fieldId}-error` : helperText ? `${fieldId}-helper` : undefined}
            disabled={isDisabled}
            readOnly={isReadOnly}
            required={isRequired}
            {...props as React.TextareaHTMLAttributes<HTMLTextAreaElement>}
          />
        ) : (
          <Input
            id={fieldId}
            ref={ref as React.RefObject<HTMLInputElement>}
            className={cn(
              error && "border-destructive",
              isDisabled && "opacity-60 cursor-not-allowed",
              inputClassName
            )}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${fieldId}-error` : helperText ? `${fieldId}-helper` : undefined}
            disabled={isDisabled}
            readOnly={isReadOnly}
            required={isRequired}
            {...props as React.InputHTMLAttributes<HTMLInputElement>}
          />
        )}
        
        {error && (
          <p id={`${fieldId}-error`} className="text-sm text-destructive">
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p id={`${fieldId}-helper`} className="text-sm text-muted-foreground">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';

export default FormField;
