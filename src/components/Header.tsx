// components/Navbar.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HiOutlineViewGrid } from "react-icons/hi";
import { FiSearch } from "react-icons/fi";
import { GrCart } from "react-icons/gr";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import { apiClient } from "@/libs/network";

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

function MobileCategoryPanel({
                                 showMobileCategories,
                                 setShowMobileCategories,
                                 categories,
                                 loading,
                             }: {
    showMobileCategories: boolean;
    setShowMobileCategories: React.Dispatch<React.SetStateAction<boolean>>;
    categories: Category[];
    loading: boolean;
}) {
    const [expanded, setExpanded] = useState<string | null>(null);

    useEffect(() => {
        document.body.style.overflow = showMobileCategories ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [showMobileCategories]);

    if (!showMobileCategories) return null;

    return (
        <div className="fixed top-0 left-0 h-full w-2/3 bg-white shadow-lg z-50 overflow-y-auto">
            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
                <h2 className="font-semibold text-lg text-gray-800">All Categories</h2>
                <button onClick={() => setShowMobileCategories(false)}>
                    <CloseIcon className="text-gray-600 hover:text-red-600" />
                </button>
            </div>

            <div className="p-4">
                {loading ? (
                    <p className="text-center text-gray-500">Loading...</p>
                ) : (
                    categories.map((category) => (
                        <Accordion
                            key={category.id}
                            expanded={expanded === category.id}
                            onChange={() =>
                                setExpanded(expanded === category.id ? null : category.id)
                            }
                            disableGutters
                            square
                            elevation={0}
                        >
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <span className="font-medium text-gray-800">{category.name}</span>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div className="flex flex-col space-y-2 ml-4">
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
                            </AccordionDetails>
                        </Accordion>
                    ))
                )}
            </div>
        </div>
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
                const categoriesWithSubs = mainCategories.map((category) => ({
                    id: category.id,
                    name: category.name,
                    subcategories: response
                        .filter((sub) => sub.parent === category.id)
                        .map((sub) => ({ id: sub.id, name: sub.name })),
                }));
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
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setShowMobileSearch(false);
        }
    };

    const toggleSearch = () => {
        setShowMobileSearch(!showMobileSearch);
    };

    if (error) console.error("Error loading categories:", error);

    return (
        <nav className={`sticky top-0 z-50 ${scrolled ? "bg-white shadow-lg" : "bg-white"}`}>
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-4 relative">
                    <div className="lg:hidden flex items-center">
                        <button
                            onClick={() => setShowMobileCategories(!showMobileCategories)}
                            className="text-gray-700 hover:text-red-600 mr-2"
                            aria-label="Toggle categories"
                        >
                            <HiOutlineViewGrid size={24} />
                        </button>
                    </div>

                    <a href="#" className="text-2xl font-bold text-red-600">BestBuy</a>

                    <div className="flex items-center space-x-4">
                        <button onClick={toggleSearch} className="lg:hidden text-gray-700 hover:text-red-600">
                            <FiSearch size={24} />
                        </button>
                        <button className="text-gray-700 hover:text-red-600 relative">
                            <GrCart size={24} />
                            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                3
                            </span>
                        </button>
                    </div>

                    <div className={`lg:hidden absolute top-full left-0 right-0 px-4 py-3 transition-all duration-300 ${showMobileSearch ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
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
                                    aria-label="Clear search"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="hidden lg:flex items-center pb-4 relative">
                    {!loading && (
                        <div className="relative mr-4">
                            <button
                                className="flex items-center px-5 py-3 bg-gray-300 rounded-lg hover:bg-gray-400 text-lg font-semibold"
                                onClick={() => setDesktopDropdownOpen(!desktopDropdownOpen)}
                            >
                                <HiOutlineViewGrid className="mr-3" size={24} />
                                <span>All Categories</span>
                            </button>

                            {desktopDropdownOpen && (
                                <div className="absolute top-full left-0 flex z-50 mt-2">
                                    <div className="w-72 bg-white rounded-l-lg shadow-lg border border-gray-200 py-3">
                                        {categories.map((category) => (
                                            <button
                                                key={category.id}
                                                className="w-full text-left px-6 py-3 text-gray-800 hover:text-red-600 hover:bg-gray-50"
                                                onMouseEnter={() => setActiveCategory(category.id)}
                                            >
                                                <span>{category.name}</span>
                                            </button>
                                        ))}
                                    </div>

                                    {activeCategory && (
                                        <div className="w-72 bg-white rounded-r-lg shadow-lg border border-gray-200 ml-2 py-3">
                                            <a
                                                href={`/category/${activeCategory}`}
                                                className="px-6 py-3 font-semibold text-gray-800 hover:text-red-600 border-b border-gray-200"
                                            >
                                                {categories.find(c => c.id === activeCategory)?.name}
                                            </a>
                                            {categories.find(c => c.id === activeCategory)?.subcategories.map((sub) => (
                                                <a
                                                    key={sub.id}
                                                    href={`/category/${activeCategory}/subcategory/${sub.id}`}
                                                    className="block px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-red-600"
                                                >
                                                    {sub.name}
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex-1 flex justify-center">
                        <div className="relative w-full max-w-3xl">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                placeholder="Search for premium electronics..."
                                className="w-full px-6 py-3 border text-gray-700 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 text-lg"
                            />
                            <button
                                className="absolute right-5 top-3 text-gray-500 hover:text-red-600"
                                onClick={handleSearch}
                                aria-label="Search"
                            >
                                <FiSearch size={24} />
                            </button>
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-16 top-3 text-gray-400 hover:text-gray-600"
                                    aria-label="Clear search"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    </div>
                </div>

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
