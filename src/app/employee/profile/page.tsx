"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { employeesApi } from "@/lib/api/employees";
import { uploadApi } from "@/lib/api/upload";
import { Employee } from "@/lib/db/schema";
import {
  User,
  Mail,
  Building2,
  DollarSign,
  Calendar,
  MapPin,
  Phone,
  Camera,
  Upload,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Toast } from "@/components/ui/toast";
import { motion, AnimatePresence } from "framer-motion";

export default function EmployeeProfilePage() {
  const { state } = useAuth();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
    isVisible: boolean;
  }>({
    message: "",
    type: "success",
    isVisible: false,
  });

  useEffect(() => {
    const fetchEmployeeProfile = async () => {
      try {
        setLoading(true);
        // Fetch the current employee's profile
        const employeeData = await employeesApi.getEmployeeProfile();
        setEmployee(employeeData);
      } catch (error) {
        console.error("Error fetching employee profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (state.user?.email) {
      fetchEmployeeProfile();
    }
  }, [state.user?.email]);

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);

      // Validate file size (1MB limit)
      if (file.size > 1024 * 1024) {
        setToast({
          message: "File size must be less than 1MB",
          type: "error",
          isVisible: true,
        });
        return;
      }

      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        setToast({
          message: "Please select a valid image file (JPEG, PNG, GIF, or WebP)",
          type: "error",
          isVisible: true,
        });
        return;
      }

      // Generate upload URL
      const uploadData = await uploadApi.generateUploadUrl({
        fileName: file.name,
        contentType: file.type,
      });

      // Upload to S3
      const uploadResponse = await fetch(uploadData.signedUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image");
      }

      // Update employee profile with new image URL
      const updatedEmployee = await employeesApi.updateEmployeeProfile(
        uploadData.imageUrl
      );
      setEmployee(updatedEmployee);

      setShowUploadModal(false);
      // Show success message
      setToast({
        message: "Profile image updated successfully!",
        type: "success",
        isVisible: true,
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      setToast({
        message: "Failed to upload image. Please try again.",
        type: "error",
        isVisible: true,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const closeToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Profile Not Found
        </h2>
        <p className="text-gray-600">Unable to load your employee profile.</p>
      </div>
    );
  }

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(salary);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-2">View your employee information</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <motion.div
                  className="relative w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-blue-200 transition-colors"
                  onClick={openFileDialog}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {employee.image_url ? (
                    <img
                      src={employee.image_url}
                      alt={employee.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-blue-600">
                      {employee.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  )}

                  {/* Upload overlay */}
                  <motion.div
                    className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  >
                    {uploading ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    ) : (
                      <Camera className="w-6 h-6 text-white" />
                    )}
                  </motion.div>
                </motion.div>

                <motion.h2
                  className="text-xl font-semibold text-gray-900 mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {employee.name}
                </motion.h2>
                <motion.p
                  className="text-gray-600 mb-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {employee.position}
                </motion.p>
                <motion.span
                  className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  {employee.department}
                </motion.span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Details Card */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">
                Personal Information
              </h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Information */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </h4>

                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Email
                        </p>
                        <p className="text-sm text-gray-600">
                          {employee.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Phone
                        </p>
                        <p className="text-sm text-gray-600">
                          +1 (555) 123-4567
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Location
                        </p>
                        <p className="text-sm text-gray-600">
                          San Francisco, CA
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Employment Information */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Employment
                  </h4>

                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Building2 className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Department
                        </p>
                        <p className="text-sm text-gray-600">
                          {employee.department}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <User className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Position
                        </p>
                        <p className="text-sm text-gray-600">
                          {employee.position}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Hire Date
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatDate(employee.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Salary Information */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Annual Salary
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatSalary(employee.salary)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Last updated</p>
                    <p className="text-sm font-medium text-gray-900">
                      3 months ago
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Additional Information */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {/* Benefits */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Benefits</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Health Insurance</span>
                <span className="text-sm font-medium text-green-600">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Dental Insurance</span>
                <span className="text-sm font-medium text-green-600">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">401(k) Plan</span>
                <span className="text-sm font-medium text-green-600">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Paid Time Off</span>
                <span className="text-sm font-medium text-blue-600">
                  15 days remaining
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Activity
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Timesheet submitted
                  </p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Performance review completed
                  </p>
                  <p className="text-xs text-gray-500">1 week ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Training completed
                  </p>
                  <p className="text-xs text-gray-500">2 weeks ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={closeToast}
      />
    </div>
  );
}
