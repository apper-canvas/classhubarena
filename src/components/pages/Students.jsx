import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import StudentTable from "@/components/organisms/StudentTable";
import StudentModal from "@/components/organisms/StudentModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { studentService } from "@/services/api/studentService";
import { classService } from "@/services/api/classService";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [studentsData, classesData] = await Promise.all([
        studentService.getAll(),
        classService.getAll()
      ]);
      
// Add class names to students
      const studentsWithClasses = studentsData.map(student => ({
        ...student,
        className: classesData.find(c => c.Id === (student.classId_c || student.classId))?.name_c || classesData.find(c => c.Id === (student.classId_c || student.classId))?.name || "No Class"
      }));
      
      setStudents(studentsWithClasses);
      setClasses(classesData);
      setFilteredStudents(studentsWithClasses);
    } catch (err) {
      setError("Failed to load students. Please try again.");
      console.error("Students load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

useEffect(() => {
    const filtered = students.filter(student => 
      `${student.firstName_c || student.firstName} ${student.lastName_c || student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.email_c || student.email).toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.grade_c || student.grade).toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [students, searchTerm]);

  const handleAddStudent = () => {
    setSelectedStudent(null);
    setIsModalOpen(true);
  };

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleSaveStudent = async (studentData) => {
    try {
if (selectedStudent) {
        // Convert field names for database
        const dbStudentData = {
          firstName_c: studentData.firstName || studentData.firstName_c,
          lastName_c: studentData.lastName || studentData.lastName_c,
          email_c: studentData.email || studentData.email_c,
          grade_c: studentData.grade || studentData.grade_c,
          classId_c: studentData.classId || studentData.classId_c,
          status_c: studentData.status || studentData.status_c
        };
        await studentService.update(selectedStudent.Id, dbStudentData);
        toast.success("Student updated successfully!");
      } else {
        await studentService.create(studentData);
        toast.success("Student added successfully!");
      }
      
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      toast.error("Failed to save student. Please try again.");
      console.error("Save student error:", err);
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (!window.confirm("Are you sure you want to delete this student?")) {
      return;
    }

    try {
      await studentService.delete(studentId);
      toast.success("Student deleted successfully!");
      loadData();
    } catch (err) {
      toast.error("Failed to delete student. Please try again.");
      console.error("Delete student error:", err);
    }
  };

  const handleViewStudent = (student) => {
    // For now, just show the edit modal
    handleEditStudent(student);
  };

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Students</h1>
          <p className="text-gray-600 mt-1">Manage your student roster and information.</p>
        </div>
        <Button onClick={handleAddStudent} variant="primary">
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Add Student
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBar
          placeholder="Search students..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
      </div>

      {/* Students Table */}
      {filteredStudents.length === 0 ? (
        <Empty
          title="No students found"
          description="Start building your classroom by adding your first student."
          actionLabel="Add Student"
          onAction={handleAddStudent}
          icon="Users"
        />
      ) : (
        <StudentTable
          students={filteredStudents}
          onEdit={handleEditStudent}
          onDelete={handleDeleteStudent}
          onView={handleViewStudent}
        />
      )}

      {/* Student Modal */}
      <StudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        student={selectedStudent}
        onSave={handleSaveStudent}
        classes={classes}
      />
    </div>
  );
};

export default Students;