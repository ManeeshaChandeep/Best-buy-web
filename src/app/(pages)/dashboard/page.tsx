'use client'
import { useState } from "react";
import Sidebar from "@/components/DashboardNavBar";
import AddItemSection from "@/components/ManageItems/AddItemSection";
import CategoryManagement from "@/components/ManageCategory/CategoryManagement";
import ManageImages from "@/components/ManageImages/ManageImages";
import ManageBanners from "@/components/ManageBanners/ManageBanner";


export type ViewType = "add" | "view" | "image" | "banner";

const Dashboard = () => {
    const [activeView, setActiveView] = useState<ViewType>("add");

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

export default Dashboard;
