import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";

const StudentModal = ({ isOpen, onClose, student, onSave, classes }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    grade: "",
    classId: "",
    status: "Active"
  });

  useEffect(() => {
    if (student) {
      setFormData({
        firstName: student.firstName || "",
        lastName: student.lastName || "",
        email: student.email || "",
        grade: student.grade || "",
        classId: student.classId || "",
        status: student.status || "Active"
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        grade: "",
        classId: "",
        status: "Active"
      });
    }
  }, [student, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md animate-scale-in">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {student ? "Edit Student" : "Add New Student"}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ApperIcon name="X" className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="First Name"
                required
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
              />
              <FormField
                label="Last Name"
                required
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
              />
            </div>
            
            <FormField
              label="Email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
            
<FormField label="Grade" required>
              <Select
                value={formData.grade}
                onChange={(value) => handleChange("grade", value)}
              >
                <option value="">Select Grade</option>
                <option value="9th Grade">9th Grade</option>
                <option value="10th Grade">10th Grade</option>
                <option value="11th Grade">11th Grade</option>
                <option value="12th Grade">12th Grade</option>
              </Select>
            </FormField>
            
<FormField label="Class" required>
              <Select
                value={formData.classId}
                onChange={(value) => handleChange("classId", value)}
              >
                <option value="">Select Class</option>
                {classes.map((cls) => (
                  <option key={cls.Id} value={cls.Id}>
                    {cls.name} - {cls.subject}
                  </option>
                ))}
              </Select>
            </FormField>
            
<FormField label="Status">
              <Select
                value={formData.status}
                onChange={(value) => handleChange("status", value)}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </Select>
            </FormField>
            
            <div className="flex space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" variant="primary" className="flex-1">
                {student ? "Update" : "Add"} Student
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentModal;