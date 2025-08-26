import React from "react";
import { cn } from "@/utils/cn";
import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";

const FormField = React.forwardRef(
  ({ className, label, error, required, children, ...props }, ref) => {
    return (
      <div className={cn("space-y-2", className)}>
        {label && (
          <Label className={cn(required && "after:content-['*'] after:ml-0.5 after:text-error-500")}>
            {label}
          </Label>
        )}
        {children || <Input ref={ref} {...props} />}
        {error && (
          <p className="text-sm text-error-500 font-medium">{error}</p>
        )}
      </div>
    );
  }
);

FormField.displayName = "FormField";

export default FormField;