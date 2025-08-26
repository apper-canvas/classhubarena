import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const DesktopSidebar = () => {
  const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Students", href: "/students", icon: "Users" },
    { name: "Classes", href: "/classes", icon: "BookOpen" },
    { name: "Grades", href: "/grades", icon: "GraduationCap" },
    { name: "Attendance", href: "/attendance", icon: "Calendar" },
    { name: "Reports", href: "/reports", icon: "FileText" }
  ];

  return (
    <div className="h-full bg-white border-r border-gray-200 shadow-premium flex flex-col">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
            <ApperIcon name="GraduationCap" className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-display font-bold text-gradient">
            ClassHub
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group hover:scale-[1.02]",
                isActive
                  ? "bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 shadow-sm"
                  : "text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100"
              )
            }
          >
            <ApperIcon 
              name={item.icon} 
              className="mr-3 h-5 w-5 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" 
            />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-4">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
              <ApperIcon name="User" className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Teacher</p>
              <p className="text-xs text-gray-500">Mathematics Dept</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopSidebar;