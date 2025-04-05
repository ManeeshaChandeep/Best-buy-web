"use client";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { FiSearch } from "react-icons/fi";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                {/* Logo */}
                <a href="#" className="text-2xl font-bold text-red-600">Best Buy</a>

                {/* Search Bar (Hidden on Mobile) */}
                <div className="hidden lg:flex flex-1 justify-end mx-6">
                    <div className="relative w-full max-w-md">
                        <input
                            type="text"
                            placeholder="What are you looking for?"
                            className="w-full px-4 py-1 pl-5 pr-10 border text-gray-500 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <FiSearch className="absolute right-3 top-2 text-gray-400" size={18} />
                    </div>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex space-x-10">
                    <a href="#" className="text-red-600 font-medium">Home</a>
                    <a href="#" className="text-gray-700 hover:text-red-600">About Us</a>
                    <a href="#" className="text-gray-700 hover:text-red-600">Contact Us</a>
                </div>

                {/* Mobile Menu Button */}
                <button className="lg:hidden" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <HiX className="w-7 h-7" /> : <HiMenu className="w-7 h-7" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="lg:hidden bg-white shadow-lg p-4">
                    <a href="#" className="block py-2 text-red-600">Home</a>
                    <a href="#" className="block py-2 text-gray-700 hover:text-red-600">About Us</a>
                    <a href="#" className="block py-2 text-gray-700 hover:text-red-600">Contact Us</a>
                </div>
            )}
        </nav>
    );
}
