import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";

const SearchBar = React.forwardRef(
  ({ className, placeholder = "Search...", ...props }, ref) => {
    return (
      <div className={cn("relative", className)}>
        <ApperIcon 
          name="Search" 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" 
        />
        <Input
          ref={ref}
          className="pl-10 bg-gradient-to-r from-gray-50 to-white border-gray-200 focus:from-white focus:to-white"
          placeholder={placeholder}
          {...props}
        />
      </div>
    );
  }
);

SearchBar.displayName = "SearchBar";

export default SearchBar;