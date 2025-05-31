"use client";
import { useState, useEffect } from "react";
import { HiMenu, HiX, HiUserCircle, HiOutlineViewGrid } from "react-icons/hi";
import { FiSearch } from "react-icons/fi";
import { GrCart } from "react-icons/gr";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [showMobileCategories, setShowMobileCategories] = useState(false);
    const [showMobileSearch, setShowMobileSearch] = useState(false);

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

    const toggleSearch = () => {
        setShowMobileSearch(!showMobileSearch);
        if (!showMobileSearch) {
            setMenuOpen(false);
        }
    };

    return (
        <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-lg backdrop-blur-sm bg-opacity-90" : "bg-white"}`}>
            <div className="container mx-auto px-4">
                {/* Main Navbar */}
                <div className="flex justify-between items-center py-4 relative">
                    {/* Mobile Category Button (hidden on desktop) */}
                    <div className="lg:hidden flex items-center">
                        <button 
                            onClick={() => setShowMobileCategories(!showMobileCategories)} 
                            className="text-gray-700 hover:text-red-600 mr-2"
                        >
                            <HiOutlineViewGrid size={24} />
                        </button>
                    </div>

                    {/* Logo - Adjusted for mobile */}
                    <a href="#" className="text-2xl font-bold text-red-600 flex items-center">
                        BestBuy
                    </a>

                    {/* Right side icons (cart and mobile menu) */}
                    <div className="flex items-center space-x-4">
                        {/* Cart Icon */}
                        <button className="text-gray-700 hover:text-red-600 relative">
                            <GrCart size={24} />
                            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                3
                            </span>
                        </button>

                        {/* Mobile Search Button */}
                        <button 
                            onClick={toggleSearch} 
                            className="lg:hidden text-gray-700 hover:text-red-600"
                        >
                            <FiSearch size={24} />
                        </button>
                    </div>

                    {/* Mobile Search Bar (appears when search icon is clicked) */}
                    <div className={`lg:hidden absolute top-full left-0 right-0 bg-white px-4 py-3 shadow-md transition-all duration-300 ease-in-out ${showMobileSearch ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search products..."
                                className="w-full px-4 py-2 pl-10 border text-gray-700 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm transition-all duration-200"
                            />
                            <FiSearch className="absolute left-3 top-3 text-gray-400" size={18} />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Desktop Search Bar and Categories */}
                <div className="hidden lg:flex items-center pb-4">
                    {/* Desktop Categories - Left aligned */}
                    <div className="relative group mr-4">
                        <button 
                            className="flex items-center px-4 py-2.5 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors"
                            onMouseEnter={() => setActiveCategory('all')}
                        >
                            <HiOutlineViewGrid className="mr-2" size={20} />
                            <span className="font-medium">All Categories</span>
                        </button>
                        
                        {/* Categories Dropdown */}
                        {activeCategory && (
                            <div 
                                className="absolute left-0 mt-1 w-56 bg-white rounded-lg shadow-lg z-50 border border-gray-200"
                                onMouseLeave={() => setActiveCategory(null)}
                            >
                                <div className="py-1">
                                    {categories.map((category) => (
                                        <div key={category.name} className="px-4 py-2 group">
                                            <button 
                                                className="w-full text-left py-1 font-medium text-gray-800 hover:text-red-600 flex justify-between items-center"
                                                onMouseEnter={() => setActiveCategory(category.name)}
                                            >
                                                <span>{category.name}</span>
                                                <span>›</span>
                                            </button>
                                            {/* Subcategories Panel */}
                                            {activeCategory === category.name && (
                                                <div className="absolute left-full top-0 ml-1 w-56 bg-white rounded-r-lg shadow-lg border-l-0 border border-gray-200 py-1">
                                                    {category.subcategories.map((sub) => (
                                                        <a
                                                            key={sub}
                                                            href="#"
                                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600"
                                                        >
                                                            {sub}
                                                        </a>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Centered Search Bar */}
                    <div className="flex-1 flex justify-center">
                        <div className="relative w-full max-w-2xl">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search for premium electronics..."
                                className="w-full px-5 py-2.5 border text-gray-700 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent shadow-sm transition-all duration-200"
                            />
                            <button className="absolute right-4 top-2.5 text-gray-500 hover:text-red-600 transition-colors duration-200">
                                <FiSearch size={20} />
                            </button>
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-12 top-2.5 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile Categories Panel (appears when category icon is clicked) */}
                {showMobileCategories && (
                    <div className="lg:hidden bg-white border border-gray-200 rounded-lg shadow-sm mb-3 transition-all duration-300 ease-in-out">
                        <div className="px-4 py-3 font-medium text-gray-700 border-b border-gray-200">
                            All Categories
                        </div>
                        <div className="divide-y divide-gray-100">
                            {categories.map((category) => (
                                <div key={category.name} className="px-4 py-2">
                                    <button className="w-full text-left py-2 font-medium">
                                        {category.name}
                                    </button>
                                    <div className="pl-4 space-y-1 mt-1">
                                        {category.subcategories.map((sub) => (
                                            <a
                                                key={sub}
                                                href="#"
                                                className="block py-1.5 text-sm text-gray-600 hover:text-red-600 transition-colors duration-200"
                                            >
                                                {sub}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}