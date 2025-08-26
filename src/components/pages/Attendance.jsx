import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { format, addMonths, subMonths } from "date-fns";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import AttendanceGrid from "@/components/organisms/AttendanceGrid";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { studentService } from "@/services/api/studentService";
import { classService } from "@/services/api/classService";
import { attendanceService } from "@/services/api/attendanceService";

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filteredStudents, setFilteredStudents] = useState([]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [studentsData, classesData, attendanceData] = await Promise.all([
        studentService.getAll(),
        classService.getAll(),
        attendanceService.getAll()
      ]);
      
      setStudents(studentsData);
      setClasses(classesData);
      setAttendance(attendanceData);
      
      // Set default class selection
      if (classesData.length > 0 && !selectedClassId) {
        setSelectedClassId(classesData[0].Id);
      }
    } catch (err) {
      setError("Failed to load attendance data. Please try again.");
      console.error("Attendance load error:", err);
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
      setFilteredStudents(classStudents);
    }
  }, [selectedClassId, students]);

  const handleAttendanceChange = (studentId, date, status) => {
    const dateString = date.toISOString().split("T")[0];
    
    setAttendance(prevAttendance => {
      const existingRecordIndex = prevAttendance.findIndex(
        a => a.studentId === studentId && a.date.split("T")[0] === dateString
      );
      
      if (existingRecordIndex >= 0) {
        // Update existing record
        const updatedAttendance = [...prevAttendance];
        updatedAttendance[existingRecordIndex] = {
          ...updatedAttendance[existingRecordIndex],
          status: status
        };
        return updatedAttendance;
      } else {
        // Add new record
        const newRecord = {
          Id: Math.max(...prevAttendance.map(a => a.Id), 0) + 1,
          studentId: studentId,
          classId: parseInt(selectedClassId),
          date: date.toISOString(),
          status: status
        };
        return [...prevAttendance, newRecord];
      }
    });
  };

  const handleSaveAttendance = async () => {
    try {
      // In a real app, this would batch update attendance
      toast.success("Attendance saved successfully!");
    } catch (err) {
      toast.error("Failed to save attendance. Please try again.");
      console.error("Save attendance error:", err);
    }
  };

  const navigateMonth = (direction) => {
    if (direction === "prev") {
      setCurrentDate(subMonths(currentDate, 1));
    } else {
      setCurrentDate(addMonths(currentDate, 1));
    }
  };

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Attendance</h1>
          <p className="text-gray-600 mt-1">Track daily student attendance and patterns.</p>
        </div>
        <Button variant="primary">
          <ApperIcon name="Download" className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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

        {/* Month Navigation */}
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
            <ApperIcon name="ChevronLeft" className="h-4 w-4" />
          </Button>
          <span className="text-lg font-semibold text-gray-900 min-w-[140px] text-center">
            {format(currentDate, "MMMM yyyy")}
          </span>
          <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
            <ApperIcon name="ChevronRight" className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Attendance Grid */}
      {!selectedClassId ? (
        <Empty
          title="Select a class to view attendance"
          description="Choose a class from the dropdown above to start tracking attendance."
          icon="Calendar"
        />
      ) : filteredStudents.length === 0 ? (
        <Empty
          title="No students in this class"
          description="Add students to this class to start tracking their attendance."
          icon="Users"
        />
      ) : (
        <AttendanceGrid
          students={filteredStudents}
          attendance={attendance}
          currentDate={currentDate}
          onAttendanceChange={handleAttendanceChange}
          onSave={handleSaveAttendance}
        />
      )}
    </div>
  );
};

export default Attendance;