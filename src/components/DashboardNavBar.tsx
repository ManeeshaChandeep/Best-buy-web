import React, {Dispatch, SetStateAction} from "react";
import {ViewType} from "@/app/(pages)/dashboard/page";
import { FiPlus, FiList, FiMenu } from "react-icons/fi";
import { TbCategoryPlus } from "react-icons/tb";
import { FaRegImage } from "react-icons/fa6";
import { MdLocalOffer } from "react-icons/md";

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
                <TbCategoryPlus  size={20} />
                {!isCollapsed && <span className="ml-3">Category</span>}
            </button>

            <button
                onClick={() => setActive("image")}
                className={`flex items-center w-full text-left p-2 rounded ${
                    active === "image" ? "bg-blue-500 text-white" : "hover:bg-gray-300"
                }`}
            >
                <FaRegImage  size={20} />
                {!isCollapsed && <span className="ml-3">Manage Images</span>}
            </button>

            <button
                onClick={() => setActive("banner")}
                className={`flex items-center w-full text-left p-2 rounded ${
                    active === "banner" ? "bg-blue-500 text-white" : "hover:bg-gray-300"
                }`}
            >
                <MdLocalOffer   size={20} />
                {!isCollapsed && <span className="ml-3">Manage Banners</span>}
            </button>

        </div>
    );
};

export default Sidebar;
