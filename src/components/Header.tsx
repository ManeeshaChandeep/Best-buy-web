"use client";
import { useState, useEffect } from "react";
import { HiMenu, HiX, HiUserCircle } from "react-icons/hi";
import { FiSearch } from "react-icons/fi";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const categories = [
        { name: "Electronics", subcategories: ["Phones", "Laptops", "Cameras"] },
        { name: "Home Appliances", subcategories: ["TVs", "Refrigerators", "Washing Machines"] },
        { name: "Audio", subcategories: ["Headphones", "Speakers", "Earbuds"] }
    ];

    return (
        <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-lg backdrop-blur-sm bg-opacity-90" : "bg-white"}`}>
            <div className="container mx-auto px-4">
                {/* Main Navbar */}
                <div className="flex justify-between items-center py-4">
                    {/* Logo */}
                    <a href="#" className="text-2xl font-bold text-red-600 flex items-center">
                        BestBuy
                    </a>

                    {/* Desktop Navigation - Centered */}
                    <div className="hidden lg:flex space-x-8 items-center mx-auto">
                        <a href="#" className="relative py-2 text-red-600 font-medium transition-colors">
                            Home
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600"></span>
                        </a>
                        <a href="#" className="relative py-2 text-gray-700 hover:text-red-600 transition-colors">
                            About Us
                        </a>
                        <a href="#" className="relative py-2 text-gray-700 hover:text-red-600 transition-colors">
                            Contact
                        </a>

                        {/* Categories Dropdown */}
                        <div className="relative group">
                            <button
                                className="flex items-center text-gray-700 hover:text-red-600 py-2"
                                onClick={() => setActiveCategory(activeCategory ? null : "Categories")}
                            >
                                Categories
                                <svg
                                    className={`ml-1 w-4 h-4 transition-transform ${activeCategory ? "rotate-180" : ""}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {activeCategory && (
                                <div className="absolute left-0 mt-2 w-56 bg-white shadow-xl rounded-lg py-2 z-20 border border-gray-100">
                                    {categories.map((category) => (
                                        <div key={category.name} className="relative group/sub">
                                            <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex justify-between items-center">
                                                <span>{category.name}</span>
                                                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                            <div className="absolute left-full top-0 ml-1 hidden group-hover/sub:block w-56 bg-white shadow-lg rounded-lg py-2 z-20 border border-gray-100">
                                                {category.subcategories.map((sub) => (
                                                    <a
                                                        key={sub}
                                                        href="#"
                                                        className="block px-4 py-2 text-sm hover:bg-gray-50 text-gray-700 hover:text-red-600"
                                                    >
                                                        {sub}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden flex items-center">
                        <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-700 hover:text-red-600">
                            {menuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Desktop Search Bar */}
                <div className="hidden lg:flex justify-center pb-4">
                    <div className="relative w-full max-w-2xl">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for premium electronics..."
                            className="w-full px-5 py-2.5 border text-gray-700 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent shadow-sm"
                        />
                        <button className="absolute right-4 top-2.5 text-gray-500 hover:text-red-600">
                            <FiSearch size={20} />
                        </button>
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-12 top-2.5 text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="lg:hidden bg-white border-t border-gray-100 shadow-inner">
                    {/* Mobile Search */}
                    <div className="px-4 py-3">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search products..."
                                className="w-full px-4 py-2 pl-10 border text-gray-700 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm"
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

                    {/* Mobile Navigation Links */}
                    <div className="px-4 py-2 space-y-1">
                        <a href="#" className="block py-3 px-3 rounded-lg bg-red-50 text-red-600 font-medium">
                            Home
                        </a>
                        <a href="#" className="block py-3 px-3 rounded-lg text-gray-700 hover:bg-gray-50">
                            About Us
                        </a>
                        <a href="#" className="block py-3 px-3 rounded-lg text-gray-700 hover:bg-gray-50">
                            Contact
                        </a>

                        {/* Mobile Categories */}
                        <div className="border-t border-gray-100 mt-2 pt-2">
                            <button
                                className="w-full text-left py-3 px-3 rounded-lg flex justify-between items-center text-gray-700 hover:bg-gray-50"
                                onClick={() => setActiveCategory(activeCategory === "mobile" ? null : "mobile")}
                            >
                                Categories
                                <svg
                                    className={`w-4 h-4 transition-transform ${activeCategory === "mobile" ? "rotate-180" : ""}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {activeCategory === "mobile" && (
                                <div className="pl-4 space-y-1">
                                    {categories.map((category) => (
                                        <div key={category.name} className="pt-1">
                                            <button
                                                className="w-full text-left py-2 px-3 rounded-lg flex justify-between items-center text-gray-700 hover:bg-gray-50"
                                            >
                                                {category.name}
                                            </button>
                                            <div className="pl-4 space-y-1">
                                                {category.subcategories.map((sub) => (
                                                    <a
                                                        key={sub}
                                                        href="#"
                                                        className="block py-2 px-3 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-red-600"
                                                    >
                                                        {sub}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
