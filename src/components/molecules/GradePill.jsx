import React from "react";
import { cn } from "@/utils/cn";
import Badge from "@/components/atoms/Badge";

const GradePill = ({ grade, score, className }) => {
  const getGradeVariant = (grade) => {
    switch(grade) {
      case "A":
      case "A+":
      case "A-":
        return "success";
      case "B":
      case "B+":
      case "B-":
        return "info";
      case "C":
      case "C+":
      case "C-":
        return "warning";
      case "D":
      case "D+":
      case "D-":
        return "accent";
      case "F":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Badge 
      variant={getGradeVariant(grade)} 
      className={cn("font-semibold px-3 py-1", className)}
    >
      {grade} {score && `(${score}%)`}
    </Badge>
  );
};

export default GradePill;