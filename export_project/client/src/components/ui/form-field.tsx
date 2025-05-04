import { useId } from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  className?: string;
  error?: string;
  description?: string;
}

export function FormField({
  label,
  children,
  className,
  error,
  description,
}: FormFieldProps) {
  const id = useId();
  const fieldId = `form-field-${id}`;

  return (
    <div className={cn("mb-4", className)}>
      <Label htmlFor={fieldId} className="block text-sm font-medium text-neutral-700 mb-1">
        {label}
      </Label>
      {description && (
        <p className="text-sm text-neutral-500 mb-1">{description}</p>
      )}
      {children}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
