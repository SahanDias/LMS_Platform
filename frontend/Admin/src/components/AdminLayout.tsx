import React from "react";
import AdminSidebar from "@/components/AdminSidebar";

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <main className="ml-64 p-8 animate-fade-in">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
