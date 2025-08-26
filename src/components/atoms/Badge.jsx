import React from "react";
import { cn } from "@/utils/cn";

const Badge = React.forwardRef(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default: "bg-gray-100 text-gray-800",
      success: "bg-gradient-to-r from-success-100 to-success-200 text-success-800",
      warning: "bg-gradient-to-r from-warning-100 to-warning-200 text-warning-800",
      error: "bg-gradient-to-r from-error-100 to-error-200 text-error-800",
      info: "bg-gradient-to-r from-info-100 to-info-200 text-info-800",
      primary: "bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800",
      secondary: "bg-gradient-to-r from-secondary-100 to-secondary-200 text-secondary-800",
      accent: "bg-gradient-to-r from-accent-100 to-accent-200 text-accent-800"
    };

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

export default Badge;