import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import { classService } from "@/services/api/classService";
import { studentService } from "@/services/api/studentService";

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    period: "",
    room: ""
  });

  const handleAddClass = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim() || !formData.subject.trim() || !formData.period.trim() || !formData.room.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const newClass = await classService.create({
        name: formData.name.trim(),
        subject: formData.subject.trim(),
        period: formData.period.trim(),
        room: formData.room.trim()
      });

      // Add enrollment count (0 for new class)
      const classWithEnrollment = { ...newClass, enrollmentCount: 0 };
      
      setClasses(prev => [...prev, classWithEnrollment]);
      setFilteredClasses(prev => [...prev, classWithEnrollment]);
      
      // Reset form and close modal
      setFormData({ name: "", subject: "", period: "", room: "" });
      setShowAddModal(false);
      
      toast.success("Class created successfully!");
    } catch (err) {
      toast.error("Failed to create class. Please try again.");
      console.error("Create class error:", err);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [classesData, studentsData] = await Promise.all([
        classService.getAll(),
        studentService.getAll()
      ]);
      
      // Add enrollment count to classes
      const classesWithEnrollment = classesData.map(classItem => ({
        ...classItem,
        enrollmentCount: studentsData.filter(s => s.classId === classItem.Id).length
      }));
      
      setClasses(classesWithEnrollment);
      setStudents(studentsData);
      setFilteredClasses(classesWithEnrollment);
    } catch (err) {
      setError("Failed to load classes. Please try again.");
      console.error("Classes load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const filtered = classes.filter(classItem => 
      classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.period.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClasses(filtered);
  }, [classes, searchTerm]);

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Classes</h1>
          <p className="text-gray-600 mt-1">Manage your classes and course information.</p>
        </div>
<Button variant="primary" onClick={() => setShowAddModal(true)}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Add Class
        </Button>
      </div>

      {/* Search */}
      <SearchBar
        placeholder="Search classes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-md"
      />

      {/* Classes Grid */}
      {filteredClasses.length === 0 ? (
        <Empty
          title="No classes found"
          description="Start organizing your curriculum by creating your first class."
          actionLabel="Add Class"
          icon="BookOpen"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((classItem) => (
            <Card key={classItem.Id} className="hover:scale-[1.02] transition-transform duration-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{classItem.name}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{classItem.subject}</p>
                  </div>
                  <Badge variant="primary">{classItem.period}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Room:</span>
                    <span className="font-medium">{classItem.room}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Enrollment:</span>
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Users" className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{classItem.enrollmentCount} students</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <ApperIcon name="Eye" className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="ghost" size="sm">
                      <ApperIcon name="Edit" className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <ApperIcon name="Trash2" className="h-4 w-4 text-error-500" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
{/* Add Class Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-semibold text-gray-900">Add New Class</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowAddModal(false);
                    setFormData({ name: "", subject: "", period: "", room: "" });
                  }}
                >
                  <ApperIcon name="X" className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleAddClass} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Class Name
                  </label>
                  <Input
                    placeholder="e.g., Algebra I"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <Input
                    placeholder="e.g., Mathematics"
                    value={formData.subject}
                    onChange={(e) => handleInputChange("subject", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Period
                  </label>
                  <Select
                    value={formData.period}
                    onChange={(value) => handleInputChange("period", value)}
                    required
                  >
                    <option value="">Select Period</option>
                    <option value="1st Period">1st Period</option>
                    <option value="2nd Period">2nd Period</option>
                    <option value="3rd Period">3rd Period</option>
                    <option value="4th Period">4th Period</option>
                    <option value="5th Period">5th Period</option>
                    <option value="6th Period">6th Period</option>
                    <option value="7th Period">7th Period</option>
                    <option value="8th Period">8th Period</option>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room
                  </label>
                  <Input
                    placeholder="e.g., Room 101"
                    value={formData.room}
                    onChange={(e) => handleInputChange("room", e.target.value)}
                    required
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddModal(false);
                      setFormData({ name: "", subject: "", period: "", room: "" });
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" className="flex-1">
                    <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
                    Create Class
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Classes;