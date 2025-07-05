'use client'
import { useState } from "react";
import Sidebar from "@/components/DashboardNavBar";
import AddItemSection from "@/components/tabItems/AddItemSection";
import CategoryManagement from "@/components/CategoryManagement";
import ManageImages from "@/components/tabManageImages/ManageImages";


export type ViewType = "add" | "view" | "image";

const Dashboard = () => {
    const [activeView, setActiveView] = useState<ViewType>("add");

    return (
        <div className="flex min-h-screen">
            <Sidebar active={activeView} setActive={setActiveView} />
            <main className="flex-1 bg-gray-100">
                {activeView === "add" && <AddItemSection />}
                {activeView === "view" && <CategoryManagement />}
                {activeView === "image" && <ManageImages />}
            </main>
        </div>
    );
};

export default Dashboard;
