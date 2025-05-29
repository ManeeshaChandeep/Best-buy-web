import React, {Dispatch, SetStateAction} from "react";
import {ViewType} from "@/app/(pages)/dashboard/page";
import { FiPlus, FiList, FiMenu } from "react-icons/fi";

type SidebarProps = {
    active: string;
    setActive: Dispatch<SetStateAction<ViewType>>;
};

const Sidebar: React.FC<SidebarProps> = ({ active, setActive }) => {
    const [isCollapsed, setIsCollapsed] = React.useState(false);

    React.useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 700) {
                setIsCollapsed(true);
            } else {
                setIsCollapsed(false);
            }
        };

        // Set initial state
        handleResize();

        // Add event listener
        window.addEventListener("resize", handleResize);

        // Clean up
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div
            className={`h-full bg-gray-200 p-4 space-y-4 ${
                isCollapsed ? "w-16" : "w-64"
            } transition-all duration-300`}
        >
            <div className="flex items-center justify-between mb-6">
                {!isCollapsed && <h2 className="text-xl font-bold">Dashboard</h2>}
                <button
                    onClick={toggleSidebar}
                    className="p-2 rounded hover:bg-gray-300"
                >
                    <FiMenu size={20} />
                </button>
            </div>

            <button
                onClick={() => setActive("add")}
                className={`flex items-center w-full text-left p-2 rounded ${
                    active === "add" ? "bg-blue-500 text-white" : "hover:bg-gray-300"
                }`}
            >
                <FiPlus size={20} />
                {!isCollapsed && <span className="ml-3">Add Product</span>}
            </button>

            <button
                onClick={() => setActive("view")}
                className={`flex items-center w-full text-left p-2 rounded ${
                    active === "view" ? "bg-blue-500 text-white" : "hover:bg-gray-300"
                }`}
            >
                <FiList size={20} />
                {!isCollapsed && <span className="ml-3">View Products</span>}
            </button>
        </div>
    );
};

export default Sidebar;
