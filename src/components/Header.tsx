"use client";

import React, { useState, useEffect, JSX } from "react";
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

interface ApiSubcategory {
    id: number;
    name: string;
    image: string;
    parent: number;
    subcategories: ApiSubcategory[];
}

interface ApiCategory {
    id: number;
    name: string;
    image: string;
    parent: number | null;
    subcategories: ApiSubcategory[];
}

interface Subcategory {
    id: number;
    name: string;
    subcategories: Subcategory[];
}

interface Category {
    id: number;
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

// Helper function to generate category URLs
const generateCategoryUrl = (categoryId: number, categoryName: string, subcategoryPath: Array<{ name: string, id: number }> = []): string => {
    const categorySlug = categoryName.toLowerCase().replace(/\s+/g, '-');

    if (subcategoryPath.length === 0) {
        return `/${categorySlug}/${categoryId}`;
    }

    if (subcategoryPath.length === 1) {
        const subcategory = subcategoryPath[0];
        return `/${categorySlug}/${categoryId}/${subcategory.name.toLowerCase().replace(/\s+/g, '-')}/${subcategory.id}`;
    } else if (subcategoryPath.length === 2) {
        const firstSub = subcategoryPath[0];
        const secondSub = subcategoryPath[1];
        return `/${categorySlug}/${categoryId}/${firstSub.name.toLowerCase().replace(/\s+/g, '-')}-${secondSub.name.toLowerCase().replace(/\s+/g, '-')}/${secondSub.id}`;
    }

    return `/${categorySlug}/${categoryId}`;
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
    const [expanded, setExpanded] = useState<Set<string>>(new Set());

    const toggleExpanded = (id: string) => {
        const newExpanded = new Set(expanded);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpanded(newExpanded);
    };

    const renderSubcategories = (subcategories: Subcategory[], level: number = 0, parentPath: Array<{ name: string, id: number }> = []) => {
        return subcategories.map((sub) => {
            const currentPath = [...parentPath, { name: sub.name, id: sub.id }];
            const categoryId = categories.find(cat =>
                cat.subcategories.some(subcat =>
                    subcat.id === sub.id ||
                    subcat.subcategories.some(subSub => subSub.id === sub.id)
                )
            )?.id || categories[0]?.id;

            return (
                <div key={sub.id} className={`${level > 0 ? 'ml-4' : ''}`}>
                    <div className="flex justify-between items-center">
                        <Link
                            href={generateCategoryUrl(categoryId, categories.find(cat => cat.id === categoryId)?.name || '', currentPath)}
                            className="flex-1 text-sm text-gray-700 hover:text-red-600 py-2"
                            onClick={() => setShowMobileCategories(false)}
                        >
                            {sub.name}
                        </Link>
                        {sub.subcategories.length > 0 && (
                            <button
                                onClick={() => toggleExpanded(`sub-${sub.id}`)}
                                className="p-1"
                            >
                                <ExpandMoreIcon
                                    className={`transform transition-transform duration-300 ${expanded.has(`sub-${sub.id}`) ? "rotate-180" : "rotate-0"
                                        } text-gray-500 text-sm`}
                                />
                            </button>
                        )}
                    </div>

                    {sub.subcategories.length > 0 && expanded.has(`sub-${sub.id}`) && (
                        <div className="ml-4 border-l border-gray-200 pl-2">
                            {renderSubcategories(sub.subcategories, level + 1, currentPath)}
                        </div>
                    )}
                </div>
            );
        });
    };

    return (
        <Drawer
            anchor="left"
            open={showMobileCategories}
            onClose={() => setShowMobileCategories(false)}
            PaperProps={{ sx: { width: "80%", maxWidth: 300 } }}
        >
            <div className="p-4 overflow-y-auto" style={{ maxHeight: "calc(100vh - 64px)" }}>

                {/* Hotline section */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-red-600 p-2 rounded">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h1.5a2.25 2.25 0 002.25-2.25v-2.25a1.125 1.125 0 00-1.125-1.125h-2.25a1.125 1.125 0 00-1.125 1.125v.375a11.25 11.25 0 01-11.25-11.25v-.375A1.125 1.125 0 006.375 5.25H4.125A1.125 1.125 0 003 6.375v.375z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm ">HOT LINE</p>
                        <p className="text-sm text-gray-600">+94 76 123 4567</p>
                    </div>
                </div>

                {/* Category List */}
                {loading ? (
                    <p className="text-center text-gray-500">Loading...</p>
                ) : (
                    categories.map((category, index) => (
                        <div
                            key={category.id}
                            className={`${index !== categories.length - 1 ? "border-b border-gray-200 mb-3" : ""}`}
                        >
                            {/* Category Button */}
                            <button
                                onClick={() => toggleExpanded(`cat-${category.id}`)}
                                className="w-full flex justify-between items-center transition-colors py-2"
                            >
                                <div className="flex items-center gap-2">
                                    {categoryIcons[category.name] || <FaCogs className="text-red-500" />}
                                    <span className="text-sm text-gray-800">{category.name}</span>
                                </div>
                                <ExpandMoreIcon
                                    className={`transform transition-transform duration-300 ${expanded.has(`cat-${category.id}`) ? "rotate-180" : "rotate-0"
                                        } text-gray-500`}
                                />
                            </button>

                            {/* Subcategories */}
                            {expanded.has(`cat-${category.id}`) && (
                                <div className="mt-2 ml-2 flex flex-col space-y-1">
                                    <Link
                                        href={generateCategoryUrl(category.id, category.name)}
                                        className="text-sm font-medium text-gray-700 hover:text-red-600 py-1"
                                        onClick={() => setShowMobileCategories(false)}
                                    >
                                        View All
                                    </Link>
                                    {renderSubcategories(category.subcategories, 0, [])}
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
    const [activeCategory, setActiveCategory] = useState<number | null>(null);
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
                const response = await apiClient.get<ApiCategory[]>("categories/v2/");

                // Filter only main categories (parent is null) and transform the data
                const mainCategories = response
                    .filter((cat) => !cat.parent)
                    .map((category) => ({
                        id: category.id,
                        name: category.name,
                        subcategories: category.subcategories.map((sub) => ({
                            id: sub.id,
                            name: sub.name,
                            subcategories: sub.subcategories.map((subSub) => ({
                                id: subSub.id,
                                name: subSub.name,
                                subcategories: subSub.subcategories
                            }))
                        }))
                    }));

                setCategories(mainCategories);
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
            className={`sticky top-0 z-50 transition-all ${scrolled ? "bg-white shadow-md" : "bg-white"
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
                    className={`lg:hidden absolute top-full left-0 right-0 px-4 py-3 transition-all duration-300 ${showMobileSearch ? "opacity-100" : "opacity-0 pointer-events-none"
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
                                className="absolute right-3 top-2 text-gray-400 hover:text-gray-600"
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
                                <Link
                                    href={generateCategoryUrl(activeCategory, categories.find(c => c.id === activeCategory)?.name || '')}
                                    className="block px-5 py-2 font-medium text-gray-800 hover:text-red-600 border-b border-gray-200"
                                >
                                    {categories.find((c) => c.id === activeCategory)?.name}
                                </Link>
                                {categories
                                    .find((c) => c.id === activeCategory)
                                    ?.subcategories.map((sub) => (
                                        <div key={sub.id}>
                                            <Link
                                                href={generateCategoryUrl(activeCategory, categories.find(c => c.id === activeCategory)?.name || '', [{ name: sub.name, id: sub.id }])}
                                                className="block px-5 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600"
                                            >
                                                {sub.name}
                                            </Link>
                                            {/* Show nested subcategories in horizontal grid */}
                                            {sub.subcategories.length > 0 && (
                                                <div className="ml-4 border-l border-gray-200 pl-2">
                                                    <div className="grid grid-cols-2 gap-1 mt-1 mb-2">
                                                        {sub.subcategories.map((subSub) => (
                                                            <Link
                                                                key={subSub.id}
                                                                href={generateCategoryUrl(activeCategory, categories.find(c => c.id === activeCategory)?.name || '', [{ name: sub.name, id: sub.id }, { name: subSub.name, id: subSub.id }])}
                                                                className="text-xs text-gray-600 hover:bg-gray-50 hover:text-red-600 px-2 py-1 rounded text-center hover:bg-gray-100 transition-colors"
                                                            >
                                                                {subSub.name}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
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
