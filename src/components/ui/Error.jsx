import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <Card className="text-center py-12">
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-full bg-gradient-to-r from-error-100 to-error-200 flex items-center justify-center">
            <ApperIcon name="AlertCircle" className="h-8 w-8 text-error-500" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-display font-semibold text-gray-900">
            Oops! Something went wrong
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            {message}
          </p>
        </div>
        {onRetry && (
          <Button onClick={onRetry} variant="primary" className="mx-auto">
            <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default Error;