'use client'
import { useState } from "react";
import Sidebar from "@/components/DashboardNavBar";
import AddItemSection from "@/components/tabOne/AddItemSection";
import CategoryManagement from "@/components/CategoryManagement";


export type ViewType = "add" | "view";

const Dashboard = () => {
    const [activeView, setActiveView] = useState<ViewType>("add");

    return (
        <div className="flex min-h-screen">
            <Sidebar active={activeView} setActive={setActiveView} />
            <main className="flex-1 bg-gray-100">
                {activeView === "add" && <AddItemSection />}
                {activeView === "view" && <CategoryManagement />}
            </main>
        </div>
    );
};

export default Dashboard;
