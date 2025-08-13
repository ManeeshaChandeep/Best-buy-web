
'use client'
import { useState } from "react";
import Sidebar from "@/components/AdminDashboardNavBar";
import AddItemSection from "@/components/AdminManageItems/AddItemSection";
import CategoryManagement from "@/components/AdminManageCategory/CategoryManagement";
import ManageBanners from "@/components/AdminManageBanners/ManageBanner";


export type ViewType = "add" | "view" | "banner";

const Dashboard = () => {
    const [activeView, setActiveView] = useState<ViewType>("add");

    return (
        <div className="flex min-h-screen">
            <Sidebar active={activeView} setActive={setActiveView} />
            <main className="flex-1 bg-gray-100">
                {activeView === "add" && <AddItemSection />}
                {activeView === "view" && <CategoryManagement />}
                {activeView === "banner" && <ManageBanners />}
            </main>
        </div>
    );
};

export default Dashboard;
