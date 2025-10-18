'use client'
import { useState } from "react";
import Sidebar from "@/components/DashboardNavBar";
import AddItemSection from "@/components/ManageItems/AddItemSection";
import CategoryManagement from "@/components/ManageCategory/CategoryManagement";
import ManageImages from "@/components/ManageImages/ManageImages";
import ManageBanners from "@/components/ManageBanners/ManageBanner";
import LoginPage from "@/components/LoginPage";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";


export type ViewType = "add" | "view" | "image" | "banner";

const DashboardContent = () => {
    const [activeView, setActiveView] = useState<ViewType>("add");
    const { isAuthenticated, isLoading, login } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <LoginPage onLoginSuccess={login} />;
    }

    return (
        <div className="flex min-h-screen">
            <Sidebar active={activeView} setActive={setActiveView} />
            <main className="flex-1 bg-gray-100">
                {activeView === "add" && <AddItemSection />}
                {activeView === "view" && <CategoryManagement />}
                {activeView === "image" && <ManageImages />}
                {activeView === "banner" && <ManageBanners />}
            </main>
        </div>
    );
};

const Dashboard = () => {
    return (
        <AuthProvider>
            <DashboardContent />
        </AuthProvider>
    );
};

export default Dashboard;
