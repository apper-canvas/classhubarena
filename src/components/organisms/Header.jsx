import React, { useContext } from "react";
import { useSelector } from "react-redux";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";
import { AuthContext } from "../../App";

const Header = ({ onMobileMenuToggle }) => {
  const { logout } = useContext(AuthContext);
  const { user } = useSelector((state) => state.user);
  return (
    <header className="h-16 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-4 lg:px-6">
      {/* Mobile Menu Button */}
      <div className="flex items-center lg:hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={onMobileMenuToggle}
          className="mr-2"
        >
          <ApperIcon name="Menu" className="h-5 w-5" />
        </Button>
        <div className="flex items-center space-x-2">
          <div className="h-6 w-6 bg-gradient-to-r from-primary-500 to-primary-600 rounded-md flex items-center justify-center">
            <ApperIcon name="GraduationCap" className="h-4 w-4 text-white" />
          </div>
          <span className="font-display font-bold text-gradient">ClassHub</span>
        </div>
      </div>

      {/* Desktop Title */}
      <div className="hidden lg:block">
        <h1 className="text-xl font-display font-semibold text-gray-900">
          Student Management System
        </h1>
      </div>

      {/* Search and Actions */}
      <div className="flex items-center space-x-4">
        <SearchBar 
          placeholder="Search students, classes..." 
          className="hidden sm:block w-64"
        />
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <ApperIcon name="Bell" className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="sm">
            <ApperIcon name="Settings" className="h-5 w-5" />
          </Button>
          
<div className="flex items-center space-x-3">
            <div className="text-sm text-gray-600">
              Welcome, {user?.firstName || user?.name || 'User'}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="flex items-center space-x-2"
            >
              <ApperIcon name="LogOut" className="h-4 w-4" />
              <span>Logout</span>
            </Button>
            <div className="h-8 w-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
              <ApperIcon name="User" className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;