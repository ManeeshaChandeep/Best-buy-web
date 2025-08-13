"use client";

import React, {useState, useEffect, JSX} from "react";
import { useRouter } from "next/navigation";
import { HiOutlineViewGrid } from "react-icons/hi";
import { FiSearch } from "react-icons/fi";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Drawer from "@mui/material/Drawer";
import { apiClient } from "@/libs/network";
import Link from "next/link";
import {
    FaTv,
    FaHeadphones,
    FaTshirt,
    FaMobileAlt,
    FaBlender,
    FaCogs
} from "react-icons/fa";

interface ApiCategory {
    id: string;
    name: string;
    parent: string | null;
}

interface Subcategory {
    id: string;
    name: string;
}

interface Category {
    id: string;
    name: string;
    subcategories: Subcategory[];
}

const categoryIcons: Record<string, JSX.Element> = {
    "TV": <FaTv className="text-red-500" />,
    "Audio & Video": <FaHeadphones className="text-red-500" />,
    "Home Appliances": <FaCogs className="text-red-500" />,
    "Kitchen Appliances": <FaBlender className="text-red-500" />,
    "Mobile Phones & Devices": <FaMobileAlt className="text-red-500" />,
    "Personal Care": <FaTshirt className="text-red-500" />
};

function MobileCategoryPanel({
                                 showMobileCategories,
                                 setShowMobileCategories,
                                 categories,
                                 loading
                             }: {
    showMobileCategories: boolean;
    setShowMobileCategories: React.Dispatch<React.SetStateAction<boolean>>;
    categories: Category[];
    loading: boolean;
}) {
    const [expanded, setExpanded] = useState<string | null>(null);

    const toggleExpanded = (id: string) => {
        setExpanded(expanded === id ? null : id);
    };

    return (
        <Drawer
            anchor="left"
            open={showMobileCategories}
            onClose={() => setShowMobileCategories(false)}
            PaperProps={{ sx: { width: "75%", maxWidth: 300 } }}
        >
            <div className="p-4 overflow-y-auto" style={{ maxHeight: "calc(100vh - 64px)" }}>
                {loading ? (
                    <p className="text-center text-gray-500">Loading...</p>
                ) : (
                    categories.map((category, index) => (
                        <div
                            key={category.id}
                            className={`pb-3 ${index !== categories.length - 1 ? "border-b border-gray-200 mb-3" : ""}`}
                        >
                            {/* Category Button */}
                            <button
                                onClick={() => toggleExpanded(category.id)}
                                className="w-full flex justify-between items-center transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    {categoryIcons[category.name] || <FaCogs className="text-red-500" />}
                                    <span className="text-base text-black">{category.name}</span>
                                </div>
                                <ExpandMoreIcon
                                    className={`transform transition-transform duration-300 ${
                                        expanded === category.id ? "rotate-180" : "rotate-0"
                                    } text-gray-500`}
                                />
                            </button>

                            {/* Subcategories */}
                            {expanded === category.id && (
                                <div className="mt-2 ml-9 flex flex-col space-y-2">
                                    <a
                                        href={`/category/${category.id}`}
                                        className="text-sm font-medium text-gray-700 hover:text-red-600"
                                        onClick={() => setShowMobileCategories(false)}
                                    >
                                        View All
                                    </a>
                                    {category.subcategories.map((sub) => (
                                        <a
                                            key={sub.id}
                                            href={`/category/${category.id}/subcategory/${sub.id}`}
                                            className="text-sm text-gray-600 hover:text-red-600"
                                            onClick={() => setShowMobileCategories(false)}
                                        >
                                            {sub.name}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </Drawer>
    );
}

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [showMobileCategories, setShowMobileCategories] = useState(false);
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);
    const [searchWarning, setSearchWarning] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get<ApiCategory[]>("categories/");
                const mainCategories = response.filter((cat) => !cat.parent);

                // Order categories according to your first screenshot
                const desiredOrder = [
                    "TV",
                    "Audio & Video",
                    "Home Appliances",
                    "Kitchen Appliances",
                    "Mobile Phones & Devices",
                    "Personal Care"
                ];

                const categoriesWithSubs = desiredOrder
                    .map((name) => {
                        const category = mainCategories.find((cat) => cat.name === name);
                        if (!category) return null;
                        return {
                            id: category.id,
                            name: category.name,
                            subcategories: response
                                .filter((sub) => sub.parent === category.id)
                                .map((sub) => ({ id: sub.id, name: sub.name }))
                        };
                    })
                    .filter(Boolean) as Category[];

                setCategories(categoriesWithSubs);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load categories");
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const handleSearch = () => {
        const trimmedQuery = searchQuery.trim();
        if (trimmedQuery.length < 2) {
            setSearchWarning(true);
            return;
        }
        setSearchWarning(false);
        router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
        setShowMobileSearch(false);
    };

    if (error) console.error("Error loading categories:", error);

    return (
        <nav
            className={`sticky top-0 z-50 transition-all ${
                scrolled ? "bg-white shadow-md" : "bg-white"
            }`}
        >
            <div className="max-w-screen-xl mx-auto px-4">
                {/* MOBILE NAVBAR */}
                <div className="flex justify-between items-center py-3 lg:hidden">
                    <button
                        onClick={() => setShowMobileCategories(!showMobileCategories)}
                        className="text-gray-700 hover:text-red-600"
                    >
                        <HiOutlineViewGrid size={22} />
                    </button>
                    <Link href="/" className="text-xl font-bold text-red-600">
                        BestBuy
                    </Link>
                    <button
                        onClick={() => setShowMobileSearch(!showMobileSearch)}
                        className="text-gray-700 hover:text-red-600"
                    >
                        <FiSearch size={22} />
                    </button>
                </div>

                {/* MOBILE SEARCH INPUT */}
                <div
                    className={`lg:hidden absolute top-full left-0 right-0 px-4 py-3 transition-all duration-300 ${
                        showMobileSearch ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                >
                    <div className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            placeholder="Search products..."
                            className="w-full px-4 py-2 pl-10 bg-white border text-gray-700 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                        <FiSearch className="absolute left-3 top-3 text-gray-400" size={18} />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>

                {/* DESKTOP NAVBAR */}
                <div className="hidden lg:flex items-center justify-between py-2 relative">
                    {/* LEFT: Category icon and logo */}
                    <div className="flex items-center space-x-3">
                        <button
                            className="p-2 bg-gray-100 rounded-md hover:bg-gray-200 transition"
                            onClick={() => setDesktopDropdownOpen(!desktopDropdownOpen)}
                            aria-label="All Categories"
                        >
                            <HiOutlineViewGrid size={20} />
                        </button>
                        <Link href="/" className="text-xl font-bold text-red-600">
                            BestBuy
                        </Link>
                    </div>

                    {/* CENTER: Search Bar */}
                    <div className="flex-1 max-w-md">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                placeholder="Search for premium electronics..."
                                className="w-full px-5 py-2 text-sm border text-gray-700 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                            <button
                                className="absolute right-4 top-2 text-gray-500 hover:text-red-600"
                                onClick={handleSearch}
                                aria-label="Search"
                            >
                                <FiSearch size={20} />
                            </button>
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-10 top-2 text-gray-400 hover:text-gray-600"
                                    aria-label="Clear search"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* CATEGORY DROPDOWN */}
                {desktopDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 z-50 bg-white shadow-lg border border-gray-200 rounded-lg flex">
                        <div className="w-64 border-r border-gray-200 py-2">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    className="w-full text-left px-5 py-2 text-sm text-gray-800 hover:text-red-600 hover:bg-gray-50"
                                    onMouseEnter={() => setActiveCategory(category.id)}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                        {activeCategory && (
                            <div className="w-64 py-2">
                                <a
                                    href={`/category/${activeCategory}`}
                                    className="block px-5 py-2 font-medium text-gray-800 hover:text-red-600 border-b border-gray-200"
                                >
                                    {categories.find((c) => c.id === activeCategory)?.name}
                                </a>
                                {categories
                                    .find((c) => c.id === activeCategory)
                                    ?.subcategories.map((sub) => (
                                        <a
                                            key={sub.id}
                                            href={`/category/${activeCategory}/subcategory/${sub.id}`}
                                            className="block px-5 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600"
                                        >
                                            {sub.name}
                                        </a>
                                    ))}
                            </div>
                        )}
                    </div>
                )}

                {/* MOBILE CATEGORY PANEL */}
                <MobileCategoryPanel
                    showMobileCategories={showMobileCategories}
                    setShowMobileCategories={setShowMobileCategories}
                    categories={categories}
                    loading={loading}
                />
            </div>
        </nav>
    );
}
