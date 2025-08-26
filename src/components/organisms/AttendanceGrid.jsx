import React from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import AttendanceDot from "@/components/molecules/AttendanceDot";
import ApperIcon from "@/components/ApperIcon";

const AttendanceGrid = ({ students, attendance, currentDate, onAttendanceChange, onSave }) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getAttendanceStatus = (studentId, date) => {
const record = attendance.find(a => 
      (a.studentId_c || a.studentId) === studentId && 
      isSameDay(new Date(a.date_c || a.date), date)
    );
    return record ? record.status : null;
  };

  const getAttendanceStats = (studentId) => {
const studentAttendance = attendance.filter(a => (a.studentId_c || a.studentId) === studentId);
    const present = studentAttendance.filter(a => a.status === "present").length;
    const total = studentAttendance.length;
    return total > 0 ? Math.round((present / total) * 100) : 0;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            Attendance - {format(currentDate, "MMMM yyyy")}
          </CardTitle>
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
                <th className="text-left py-3 px-4 font-medium text-gray-700 sticky left-0 bg-white min-w-[150px]">
                  Student
                </th>
                {days.slice(0, 15).map((day) => (
                  <th key={day.toISOString()} className="text-center py-3 px-2 font-medium text-gray-700 min-w-[40px]">
                    <div className="text-xs">
                      <div>{format(day, "EEE")}</div>
                      <div>{format(day, "d")}</div>
                    </div>
                  </th>
                ))}
                <th className="text-center py-3 px-4 font-medium text-gray-700 min-w-[80px]">
                  Rate
                </th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr 
                  key={student.Id} 
                  className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-gray-50 hover:to-white"
                >
                  <td className="py-3 px-4 font-medium text-gray-900 sticky left-0 bg-white">
{student.firstName_c || student.firstName} {student.lastName_c || student.lastName}
                  </td>
                  {days.slice(0, 15).map((day) => (
                    <td key={day.toISOString()} className="py-3 px-2 text-center">
                      <div className="flex justify-center">
                        <AttendanceDot
                          status={getAttendanceStatus(student.Id, day)}
                          onClick={() => {
                            const currentStatus = getAttendanceStatus(student.Id, day);
                            let newStatus;
                            if (currentStatus === "present") newStatus = "absent";
                            else if (currentStatus === "absent") newStatus = "late";
                            else if (currentStatus === "late") newStatus = "excused";
                            else newStatus = "present";
                            
                            onAttendanceChange(student.Id, day, newStatus);
                          }}
                        />
                      </div>
                    </td>
                  ))}
                  <td className="py-3 px-4 text-center">
                    <span className="font-semibold text-primary-600">
                      {getAttendanceStats(student.Id)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Legend */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <AttendanceDot status="present" />
              <span>Present</span>
            </div>
            <div className="flex items-center space-x-2">
              <AttendanceDot status="absent" />
              <span>Absent</span>
            </div>
            <div className="flex items-center space-x-2">
              <AttendanceDot status="late" />
              <span>Late</span>
            </div>
            <div className="flex items-center space-x-2">
              <AttendanceDot status="excused" />
              <span>Excused</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceGrid;