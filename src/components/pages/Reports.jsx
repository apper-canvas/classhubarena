import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import ProgressRing from "@/components/molecules/ProgressRing";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { studentService } from "@/services/api/studentService";
import { classService } from "@/services/api/classService";
import { attendanceService } from "@/services/api/attendanceService";
import { gradeService } from "@/services/api/gradeService";

const Reports = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("all");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [studentsData, classesData, attendanceData, gradesData] = await Promise.all([
        studentService.getAll(),
        classService.getAll(),
        attendanceService.getAll(),
        gradeService.getAll()
      ]);
      
      setStudents(studentsData);
      setClasses(classesData);
      setAttendance(attendanceData);
      setGrades(gradesData);
    } catch (err) {
      setError("Failed to load reports data. Please try again.");
      console.error("Reports load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  // Calculate statistics
const filteredStudents = selectedClassId === "all" 
    ? students 
    : students.filter(s => (s.classId_c || s.classId) === parseInt(selectedClassId));

const totalStudents = filteredStudents.length;
  const activeStudents = filteredStudents.filter(s => (s.status_c || s.status) === "Active").length;
  
// Calculate attendance stats
  const presentRecords = attendance.filter(a => (a.status_c || a.status) === "present");
  const totalAttendanceRecords = attendance.length;
  const attendanceRate = totalAttendanceRecords > 0 
    ? Math.round((presentRecords.length / totalAttendanceRecords) * 100) 
    : 0;

// Calculate grade stats
  const averageGrade = grades.length > 0 
    ? Math.round(grades.reduce((sum, g) => sum + (g.score_c || g.score), 0) / grades.length) 
    : 0;

  // Top performing students
const studentGradeAverages = filteredStudents.map(student => {
    const studentGrades = grades.filter(g => (g.studentId_c || g.studentId) === student.Id);
    const average = studentGrades.length > 0 
      ? studentGrades.reduce((sum, g) => sum + (g.score_c || g.score), 0) / studentGrades.length 
      : 0;
    return { ...student, average };
  }).sort((a, b) => b.average - a.average);

  // Class performance
const classPerformance = classes.map(classItem => {
    const classStudents = students.filter(s => (s.classId_c || s.classId) === classItem.Id);
    const classGrades = grades.filter(g => 
      classStudents.some(s => s.Id === (g.studentId_c || g.studentId))
    );
    const average = classGrades.length > 0 
      ? Math.round(classGrades.reduce((sum, g) => sum + (g.score_c || g.score), 0) / classGrades.length)
      : 0;
    return { ...classItem, average, studentCount: classStudents.length };
  }).sort((a, b) => b.average - a.average);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-1">Analyze student performance and attendance patterns.</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <ApperIcon name="Download" className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="primary">
            <ApperIcon name="FileText" className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Class Filter */}
      <div className="flex items-center space-x-4">
        <label className="text-sm font-medium text-gray-700">Filter by Class:</label>
        <Select
          value={selectedClassId}
          onChange={(e) => setSelectedClassId(e.target.value)}
          className="w-64"
        >
          <option value="all">All Classes</option>
{classes.map((classItem) => (
            <option key={classItem.Id} value={classItem.Id}>
              {classItem.name_c || classItem.name} - {classItem.subject_c || classItem.subject}
            </option>
          ))}
        </Select>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <ProgressRing percentage={100} size={60} color="primary" />
            </div>
            <p className="text-2xl font-bold text-gradient mb-1">{totalStudents}</p>
            <p className="text-sm text-gray-600">Total Students</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <ProgressRing percentage={(activeStudents / totalStudents) * 100} size={60} color="success" />
            </div>
            <p className="text-2xl font-bold text-gradient mb-1">{activeStudents}</p>
            <p className="text-sm text-gray-600">Active Students</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <ProgressRing percentage={attendanceRate} size={60} color="info" />
            </div>
            <p className="text-2xl font-bold text-gradient mb-1">{attendanceRate}%</p>
            <p className="text-sm text-gray-600">Attendance Rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <ProgressRing percentage={averageGrade} size={60} color="accent" />
            </div>
            <p className="text-2xl font-bold text-gradient mb-1">{averageGrade}%</p>
            <p className="text-sm text-gray-600">Average Grade</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Students */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {studentGradeAverages.slice(0, 5).map((student, index) => (
                <div key={student.Id} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-r from-primary-100 to-primary-200 text-primary-700 font-semibold text-sm">
                      #{index + 1}
                    </div>
                    <div>
<p className="font-medium text-gray-900">
                        {student.firstName_c || student.firstName} {student.lastName_c || student.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{student.grade_c || student.grade}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary-600">
                      {Math.round(student.average)}%
                    </p>
                    <Badge variant="success" className="text-xs">
                      A Student
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Class Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Class Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {classPerformance.slice(0, 5).map((classItem) => (
                <div key={classItem.Id} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg">
                  <div>
<p className="font-medium text-gray-900">{classItem.name_c || classItem.name}</p>
                    <p className="text-sm text-gray-600">
                      {classItem.subject_c || classItem.subject} • {classItem.studentCount} students
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <ProgressRing percentage={classItem.average} size={40} color="secondary" />
                    <div className="text-right">
                      <p className="text-lg font-bold text-secondary-600">
                        {classItem.average}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="h-16 w-16 bg-gradient-to-r from-success-100 to-success-200 rounded-full flex items-center justify-center mx-auto mb-3">
                <ApperIcon name="UserCheck" className="h-8 w-8 text-success-600" />
              </div>
              <p className="text-2xl font-bold text-gradient mb-1">{presentRecords.length}</p>
              <p className="text-sm text-gray-600">Present Records</p>
            </div>
            
            <div className="text-center">
              <div className="h-16 w-16 bg-gradient-to-r from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-3">
                <ApperIcon name="GraduationCap" className="h-8 w-8 text-primary-600" />
              </div>
              <p className="text-2xl font-bold text-gradient mb-1">{grades.length}</p>
              <p className="text-sm text-gray-600">Grades Recorded</p>
            </div>
            
            <div className="text-center">
              <div className="h-16 w-16 bg-gradient-to-r from-accent-100 to-accent-200 rounded-full flex items-center justify-center mx-auto mb-3">
                <ApperIcon name="BookOpen" className="h-8 w-8 text-accent-600" />
              </div>
              <p className="text-2xl font-bold text-gradient mb-1">{classes.length}</p>
              <p className="text-sm text-gray-600">Active Classes</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;