'use client'
import { useState } from "react";
import Sidebar from "@/components/DashboardNavBar";
import AddProduct from "@/components/AddItem";
import ViewProducts from "@/components/ViewProductList";


type ViewType = "add" | "view";

const Dashboard = () => {
    const [activeView, setActiveView] = useState<ViewType>("add");

    return (
        <div className="flex min-h-screen">
            <Sidebar active={activeView} setActive={setActiveView} />
            <main className="flex-1 bg-gray-100">
                {activeView === "add" && <AddProduct />}
                {activeView === "view" && <ViewProducts />}
            </main>
        </div>
    );
};

export default Dashboard;
