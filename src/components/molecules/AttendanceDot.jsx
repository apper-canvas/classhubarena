import React from "react";
import { cn } from "@/utils/cn";

const AttendanceDot = ({ status, className, ...props }) => {
  const statusColors = {
    present: "bg-gradient-to-r from-success-400 to-success-500 border-success-300",
    absent: "bg-gradient-to-r from-error-400 to-error-500 border-error-300",
    late: "bg-gradient-to-r from-warning-400 to-warning-500 border-warning-300",
    excused: "bg-gradient-to-r from-info-400 to-info-500 border-info-300"
  };

  return (
    <div 
      className={cn(
        "h-3 w-3 rounded-full border-2 shadow-sm hover:scale-110 transition-transform duration-150 cursor-pointer",
        statusColors[status] || "bg-gray-300 border-gray-200",
        className
      )}
      {...props}
    />
  );
};

export default AttendanceDot;