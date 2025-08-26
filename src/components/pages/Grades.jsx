import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import GradeMatrix from "@/components/organisms/GradeMatrix";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { studentService } from "@/services/api/studentService";
import { classService } from "@/services/api/classService";
import { assignmentService } from "@/services/api/assignmentService";
import { gradeService } from "@/services/api/gradeService";

const Grades = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [studentsData, classesData, assignmentsData, gradesData] = await Promise.all([
        studentService.getAll(),
        classService.getAll(),
        assignmentService.getAll(),
        gradeService.getAll()
      ]);
      
      setStudents(studentsData);
      setClasses(classesData);
      setAssignments(assignmentsData);
      setGrades(gradesData);
      
      // Set default class selection
      if (classesData.length > 0 && !selectedClassId) {
        setSelectedClassId(classesData[0].Id);
      }
    } catch (err) {
      setError("Failed to load grades data. Please try again.");
      console.error("Grades load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedClassId) {
      const classStudents = students.filter(s => s.classId === parseInt(selectedClassId));
      const classAssignments = assignments.filter(a => a.classId === parseInt(selectedClassId));
      setFilteredStudents(classStudents);
      setFilteredAssignments(classAssignments);
    }
  }, [selectedClassId, students, assignments]);

  const handleGradeChange = (studentId, assignmentId, score) => {
    setGrades(prevGrades => {
      const existingGradeIndex = prevGrades.findIndex(
        g => g.studentId === studentId && g.assignmentId === assignmentId
      );
      
      if (existingGradeIndex >= 0) {
        // Update existing grade
        const updatedGrades = [...prevGrades];
        updatedGrades[existingGradeIndex] = {
          ...updatedGrades[existingGradeIndex],
          score: score
        };
        return updatedGrades;
      } else {
        // Add new grade
        const newGrade = {
          Id: Math.max(...prevGrades.map(g => g.Id)) + 1,
          studentId: studentId,
          assignmentId: assignmentId,
          score: score,
          submittedDate: new Date().toISOString()
        };
        return [...prevGrades, newGrade];
      }
    });
  };

  const handleSaveGrades = async () => {
    try {
      // In a real app, this would batch update grades
      toast.success("Grades saved successfully!");
    } catch (err) {
      toast.error("Failed to save grades. Please try again.");
      console.error("Save grades error:", err);
    }
  };

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Grades</h1>
          <p className="text-gray-600 mt-1">Track and manage student grades and assignments.</p>
        </div>
        <Button variant="primary">
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Add Assignment
        </Button>
      </div>

      {/* Class Selection */}
      <div className="flex items-center space-x-4">
        <label className="text-sm font-medium text-gray-700">Select Class:</label>
        <Select
          value={selectedClassId}
          onChange={(e) => setSelectedClassId(e.target.value)}
          className="w-64"
        >
          <option value="">Choose a class...</option>
          {classes.map((classItem) => (
            <option key={classItem.Id} value={classItem.Id}>
              {classItem.name} - {classItem.subject}
            </option>
          ))}
        </Select>
      </div>

      {/* Grade Matrix */}
      {!selectedClassId ? (
        <Empty
          title="Select a class to view grades"
          description="Choose a class from the dropdown above to start managing grades."
          icon="GraduationCap"
        />
      ) : filteredStudents.length === 0 ? (
        <Empty
          title="No students in this class"
          description="Add students to this class to start tracking their grades."
          icon="Users"
        />
      ) : filteredAssignments.length === 0 ? (
        <Empty
          title="No assignments yet"
          description="Create assignments for this class to start entering grades."
          actionLabel="Add Assignment"
          icon="FileText"
        />
      ) : (
        <GradeMatrix
          students={filteredStudents}
          assignments={filteredAssignments}
          grades={grades}
          onGradeChange={handleGradeChange}
          onSave={handleSaveGrades}
        />
      )}
    </div>
  );
};

export default Grades;