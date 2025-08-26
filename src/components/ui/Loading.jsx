import React from "react";
import { Card, CardContent, CardHeader } from "@/components/atoms/Card";

const Loading = ({ type = "default" }) => {
  if (type === "table") {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/4"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex space-x-4">
                <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/4"></div>
                <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/4"></div>
                <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/4"></div>
                <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (type === "cards") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20"></div>
                  <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16"></div>
                </div>
                <div className="h-12 w-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/3"></div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2"></div>
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-2/3"></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Loading;