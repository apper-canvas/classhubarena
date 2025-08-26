import React, { useState, useEffect } from "react";
import StatCard from "@/components/molecules/StatCard";
import ProgressRing from "@/components/molecules/ProgressRing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { studentService } from "@/services/api/studentService";
import { classService } from "@/services/api/classService";
import { attendanceService } from "@/services/api/attendanceService";
import { gradeService } from "@/services/api/gradeService";

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
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
      setError("Failed to load dashboard data. Please try again.");
      console.error("Dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

// Calculate stats
  const totalStudents = students.length;
  const activeStudents = students.filter(s => (s.status_c || s.status) === "Active").length;
  const totalClasses = classes.length;
  
  // Calculate attendance rate
  const todayAttendance = attendance.filter(a => {
    const today = new Date().toISOString().split("T")[0];
    const attendanceDate = (a.date_c || a.date);
    return attendanceDate && attendanceDate.split("T")[0] === today;
  });
  const presentToday = todayAttendance.filter(a => (a.status_c || a.status) === "present").length;
  const attendanceRate = todayAttendance.length > 0 ? Math.round((presentToday / todayAttendance.length) * 100) : 0;

  // Calculate average grade
  const averageGrade = grades.length > 0 ? Math.round(grades.reduce((sum, g) => sum + (g.score_c || g.score), 0) / grades.length) : 0;

  // Recent activity (mock data based on real data structure)
  const recentActivity = [
    { type: "grade", student: "Emma Johnson", action: "New grade: A in Math Quiz", time: "2 hours ago" },
    { type: "attendance", student: "Michael Chen", action: "Marked present", time: "3 hours ago" },
    { type: "student", student: "Sarah Williams", action: "Profile updated", time: "5 hours ago" }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's your classroom overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={totalStudents}
          icon="Users"
          color="primary"
        />
        <StatCard
          title="Active Students"
          value={activeStudents}
          icon="UserCheck"
          color="success"
        />
        <StatCard
          title="Total Classes"
          value={totalClasses}
          icon="BookOpen"
          color="secondary"
        />
        <StatCard
          title="Attendance Rate"
          value={`${attendanceRate}%`}
          icon="Calendar"
          color="accent"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Class Performance */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Class Performance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {classes.slice(0, 4).map((classItem) => {
const classStudents = students.filter(s => (s.classId_c || s.classId) === classItem.Id);
                const classGrades = grades.filter(g => 
                  classStudents.some(s => s.Id === (g.studentId_c || g.studentId))
                );
                const classAverage = classGrades.length > 0 
                  ? Math.round(classGrades.reduce((sum, g) => sum + (g.score_c || g.score), 0) / classGrades.length)
                  : 0;
                
                return (
                  <div key={classItem.Id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border">
                    <div>
                      <h4 className="font-semibold text-gray-900">{classItem.name}</h4>
                      <p className="text-sm text-gray-600">{classItem.subject} • {classStudents.length} students</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <ProgressRing percentage={classAverage} size={50} />
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary-600">{classAverage}%</p>
                        <p className="text-xs text-gray-500">Class Average</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`h-2 w-2 rounded-full mt-2 ${
                    activity.type === "grade" ? "bg-primary-500" :
                    activity.type === "attendance" ? "bg-success-500" :
                    "bg-secondary-500"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.student}</p>
                    <p className="text-sm text-gray-600">{activity.action}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Today's Attendance</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex justify-center mb-4">
              <ProgressRing percentage={attendanceRate} size={80} color="success" />
            </div>
            <p className="text-2xl font-bold text-gradient mb-1">{presentToday}/{todayAttendance.length}</p>
            <p className="text-sm text-gray-600">Students Present</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Grade</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex justify-center mb-4">
              <ProgressRing percentage={averageGrade} size={80} color="primary" />
            </div>
            <p className="text-2xl font-bold text-gradient mb-1">{averageGrade}%</p>
            <p className="text-sm text-gray-600">Class Average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Class Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active</span>
                <Badge variant="success">{activeStudents} Students</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Inactive</span>
                <Badge variant="error">{totalStudents - activeStudents} Students</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Classes</span>
                <Badge variant="primary">{totalClasses} Classes</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;