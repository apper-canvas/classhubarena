import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const StudentTable = ({ students, onEdit, onDelete, onView }) => {
  const getStatusVariant = (status) => {
    switch(status) {
      case "Active": return "success";
      case "Inactive": return "error";
      case "Suspended": return "warning";
      default: return "default";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Roster</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Grade</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Class</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr 
                  key={student.Id} 
                  className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-colors duration-200"
                >
                  <td className="py-4 px-4">
                    <div className="font-medium text-gray-900">
{student.firstName_c || student.firstName} {student.lastName_c || student.lastName}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-600">
{student.email_c || student.email}
                  </td>
                  <td className="py-4 px-4">
<Badge variant="primary">{student.grade_c || student.grade}</Badge>
                  </td>
                  <td className="py-4 px-4 text-gray-600">
                    {student.className}
                  </td>
                  <td className="py-4 px-4">
<Badge variant={getStatusVariant(student.status_c || student.status)}>
                      {student.status_c || student.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onView(student)}
                      >
                        <ApperIcon name="Eye" className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onEdit(student)}
                      >
                        <ApperIcon name="Edit" className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onDelete(student.Id)}
                      >
                        <ApperIcon name="Trash2" className="h-4 w-4 text-error-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentTable;