import React from "react";
import { cn } from "@/utils/cn";
import { Card, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const StatCard = ({ className, title, value, change, trend, icon, color = "primary" }) => {
  const colors = {
    primary: "from-primary-500 to-primary-600",
    secondary: "from-secondary-500 to-secondary-600",
    accent: "from-accent-500 to-accent-600",
    success: "from-success-500 to-success-600",
    warning: "from-warning-500 to-warning-600",
    error: "from-error-500 to-error-600",
    info: "from-info-500 to-info-600"
  };

  return (
    <Card className={cn("overflow-hidden hover:scale-[1.02] transition-transform duration-200", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold font-display text-gradient">{value}</p>
            {change && (
              <div className="flex items-center space-x-1">
                <ApperIcon 
                  name={trend === "up" ? "TrendingUp" : "TrendingDown"} 
                  className={cn(
                    "h-4 w-4",
                    trend === "up" ? "text-success-500" : "text-error-500"
                  )} 
                />
                <span className={cn(
                  "text-sm font-medium",
                  trend === "up" ? "text-success-600" : "text-error-600"
                )}>
                  {change}
                </span>
              </div>
            )}
          </div>
          <div className={cn(
            "h-12 w-12 rounded-xl bg-gradient-to-br flex items-center justify-center",
            colors[color]
          )}>
            <ApperIcon name={icon} className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;