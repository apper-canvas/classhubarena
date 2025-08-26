import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data found", 
  description = "Get started by adding your first item.",
  actionLabel = "Add Item",
  onAction,
  icon = "Plus"
}) => {
  return (
    <Card className="text-center py-16">
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <div className="h-20 w-20 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
            <ApperIcon name={icon} className="h-10 w-10 text-gray-400" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-display font-semibold text-gray-900">
            {title}
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            {description}
          </p>
        </div>
        {onAction && (
          <Button onClick={onAction} variant="primary" className="mx-auto">
            <ApperIcon name={icon} className="h-4 w-4 mr-2" />
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default Empty;