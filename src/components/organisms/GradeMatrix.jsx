import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import GradePill from "@/components/molecules/GradePill";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const GradeMatrix = ({ students, assignments, grades, onGradeChange, onSave }) => {
  const getGrade = (studentId, assignmentId) => {
    const grade = grades.find(g => g.studentId === studentId && g.assignmentId === assignmentId);
    return grade ? grade.score : "";
  };

  const calculateLetterGrade = (score, totalPoints) => {
    const percentage = (score / totalPoints) * 100;
    if (percentage >= 97) return "A+";
    if (percentage >= 93) return "A";
    if (percentage >= 90) return "A-";
    if (percentage >= 87) return "B+";
    if (percentage >= 83) return "B";
    if (percentage >= 80) return "B-";
    if (percentage >= 77) return "C+";
    if (percentage >= 73) return "C";
    if (percentage >= 70) return "C-";
    if (percentage >= 67) return "D+";
    if (percentage >= 63) return "D";
    if (percentage >= 60) return "D-";
    return "F";
  };

  const getStudentAverage = (studentId) => {
    const studentGrades = grades.filter(g => g.studentId === studentId);
    if (studentGrades.length === 0) return null;
    
    let totalScore = 0;
    let totalPoints = 0;
    
    studentGrades.forEach(grade => {
      const assignment = assignments.find(a => a.Id === grade.assignmentId);
      if (assignment) {
        totalScore += grade.score;
        totalPoints += assignment.totalPoints;
      }
    });
    
    const percentage = (totalScore / totalPoints) * 100;
    return {
      percentage: Math.round(percentage),
      letter: calculateLetterGrade(totalScore, totalPoints)
    };
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Grade Matrix</CardTitle>
          <Button onClick={onSave} variant="primary" size="sm">
            <ApperIcon name="Save" className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700 sticky left-0 bg-white">
                  Student
                </th>
                {assignments.map((assignment) => (
                  <th key={assignment.Id} className="text-center py-3 px-4 font-medium text-gray-700 min-w-[120px]">
                    <div className="space-y-1">
                      <div className="text-sm">{assignment.title}</div>
                      <div className="text-xs text-gray-500">({assignment.totalPoints} pts)</div>
                    </div>
                  </th>
                ))}
                <th className="text-center py-3 px-4 font-medium text-gray-700 min-w-[100px]">
                  Average
                </th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => {
                const average = getStudentAverage(student.Id);
                return (
                  <tr 
                    key={student.Id} 
                    className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-gray-50 hover:to-white"
                  >
                    <td className="py-3 px-4 font-medium text-gray-900 sticky left-0 bg-white">
                      {student.firstName} {student.lastName}
                    </td>
                    {assignments.map((assignment) => (
                      <td key={assignment.Id} className="py-3 px-4 text-center">
                        <Input
                          type="number"
                          min="0"
                          max={assignment.totalPoints}
                          value={getGrade(student.Id, assignment.Id)}
                          onChange={(e) => onGradeChange(student.Id, assignment.Id, parseFloat(e.target.value) || 0)}
                          className="w-20 text-center mx-auto"
                          placeholder="0"
                        />
                      </td>
                    ))}
                    <td className="py-3 px-4 text-center">
                      {average ? (
                        <GradePill 
                          grade={average.letter} 
                          score={average.percentage}
                        />
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default GradeMatrix;