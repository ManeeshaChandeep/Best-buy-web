import React, { Dispatch, SetStateAction, useState, useEffect } from "react";
import { ViewType } from "@/app/(pages)/adminpanel/page";
import { FaRegImage } from "react-icons/fa6";
import { TbCategory } from "react-icons/tb";
import { MdLocalOffer } from "react-icons/md";
import { FiMenu } from "react-icons/fi";

type SidebarProps = {
    active: string;
    setActive: Dispatch<SetStateAction<ViewType>>;
};

const Sidebar: React.FC<SidebarProps> = ({ active, setActive }) => {
    const [isMobile, setIsMobile] = useState(false);
    const [isOpen, setIsOpen] = useState(true);

    const menuItems = [
        { key: "products", label: "Products", icon: <FaRegImage size={18} /> },
        { key: "categories", label: "Categories", icon: <TbCategory size={18} /> },
        { key: "banners", label: "Banners", icon: <MdLocalOffer size={18} /> },
    ];

    // Detect screen size
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setIsMobile(true);
                setIsOpen(false);
            } else {
                setIsMobile(false);
                setIsOpen(true);
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Handle click on menu item
    const onMenuItemClick = (key: ViewType) => {
        setActive(key);
        if (isMobile) {
            setIsOpen(false); // Close sidebar on mobile after selection
        }
    };

    return (
        <>
            {/* Mobile hamburger */}
            {isMobile && (
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 m-2 rounded bg-gray-200 hover:bg-gray-300"
                >
                    <FiMenu size={20} />
                </button>
            )}

            {/* Sidebar */}
            {isOpen && (
                <div
                    className={`h-full bg-white p-4 space-y-4 border-r transition-all duration-300
            ${isMobile ? "w-48 fixed top-0 left-0 z-50 h-screen" : "w-48"}
          `}
                >
                    {menuItems.map((item) => (
                        <button
                            key={item.key}
                            onClick={() => onMenuItemClick(item.key as ViewType)}
                            className={`flex items-center gap-2 w-full px-3 py-2 rounded transition-all 
                ${
                                active === item.key
                                    ? "bg-red-400 text-white"
                                    : "text-black hover:bg-gray-100"
                            }
              `}
                        >
                            {item.icon}
                            <span className="text-sm">{item.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </>
    );
};

export default Sidebar;
