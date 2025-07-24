"use client";

import React, { useState } from "react";
import {
    Search,
    ShoppingCart,
    User,
    Phone,
    MapPin,
    Globe,
    ChevronDown,
    ChevronUp,
    Menu,
    X,
} from "lucide-react";

// ProductCard Component
interface ProductCardProps {
    id: number;
    image: string;
    title: string;
    originalPrice: number;
    salePrice: number;
    discount: number;
    isNew?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
                                                     image,
                                                     title,
                                                     originalPrice,
                                                     salePrice,
                                                     discount,
                                                     isNew,
                                                 }) => {
    const formatPrice = (price: number) => `Rs. ${price.toLocaleString()}`;

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
            <div className="relative">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
          <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            {discount}%
          </span>
                    <div className="text-xs text-white bg-red-500 px-1 rounded-b">OFF</div>
                </div>
                {isNew && (
                    <div className="absolute top-3 right-3">
            <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
              NEW
            </span>
                    </div>
                )}
            </div>

            <div className="p-4">
                <h3 className="text-sm font-medium text-gray-800 mb-2 line-clamp-2 hover:text-purple-600 transition-colors">
                    {title}
                </h3>
                <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-gray-500 line-through">
            {formatPrice(originalPrice)}
          </span>
                    <span className="text-lg font-bold text-red-600">
            {formatPrice(salePrice)}
          </span>
                </div>
            </div>
        </div>
    );
};

// Sidebar Component
const Sidebar = ({
                     isOpen,
                     onClose,
                 }: {
    isOpen: boolean;
    onClose: () => void;
}) => {
    const [categoriesOpen, setCategoriesOpen] = useState(true);
    const [brandsOpen, setBrandsOpen] = useState(true);

    const categories = [
        "LED TV",
        "Smart LED TV",
        "OLED TV",
        "UHD TV",
        "JVC TV Special Offer",
        "TV Accessories",
    ];

    const brands = ["LG", "Toshiba", "Haier", "JVC", "Abans"];

    return (
        <>
            {/* Overlay for mobile */}
            <div
                onClick={onClose}
                className={`fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity duration-300 ${
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                } md:hidden`}
            ></div>

            {/* Drawer Sidebar */}
            <aside
                className={`fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-gray-200 p-6 z-50 transform transition-transform duration-300
          ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                } md:static md:translate-x-0 md:w-80 flex flex-col h-screen`}
            >
                {/* Close button on mobile */}
                <div className="flex justify-end mb-4 md:hidden">
                    <button
                        onClick={onClose}
                        className="p-2 rounded hover:bg-gray-100 focus:outline-none"
                        aria-label="Close sidebar"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Sticky Filter Title */}
                <h3 className="text-lg font-semibold text-gray-800 mb-6 flex-shrink-0 sticky top-0 bg-white z-10 py-2">
                    Filter Products by
                </h3>

                {/* Scrollable filter area */}
                <div className="overflow-y-auto flex-1 max-h-[calc(100vh-4.5rem)]">
                    {/* Categories */}
                    <div className="mb-8">
                        <button
                            onClick={() => setCategoriesOpen(!categoriesOpen)}
                            className="flex items-center justify-between w-full text-left font-medium text-gray-800 mb-4"
                        >
                            <span>Categories</span>
                            {categoriesOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                        {categoriesOpen &&
                            categories.map((category) => (
                                <label
                                    key={category}
                                    className="flex items-center cursor-pointer hover:text-purple-600 mb-2"
                                >
                                    <input type="checkbox" className="mr-3 h-4 w-4 text-purple-600" />
                                    <span className="text-sm text-gray-700">{category}</span>
                                </label>
                            ))}
                    </div>

                    {/* Brands */}
                    <div>
                        <button
                            onClick={() => setBrandsOpen(!brandsOpen)}
                            className="flex items-center justify-between w-full text-left font-medium text-gray-800 mb-4"
                        >
                            <span>Brand</span>
                            {brandsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                        {brandsOpen &&
                            brands.map((brand) => (
                                <label
                                    key={brand}
                                    className="flex items-center cursor-pointer hover:text-purple-600 mb-2"
                                >
                                    <input type="checkbox" className="mr-3 h-4 w-4 text-purple-600" />
                                    <span className="text-sm text-gray-700">{brand}</span>
                                </label>
                            ))}
                    </div>
                </div>
            </aside>
        </>
    );
};

// ProductGrid Component with Pagination
const ProductGrid = () => {
    const allProducts: ProductCardProps[] = [
        {
            id: 1,
            image:
                "https://images.pexels.com/photos/6292382/pexels-photo-6292382.jpeg",
            title: "Toshiba 43 Inch Smart TV",
            originalPrice: 149999,
            salePrice: 129999,
            discount: 13,
        },
        {
            id: 2,
            image:
                "https://images.pexels.com/photos/6292370/pexels-photo-6292370.jpeg",
            title: "LG 43 Inch UHD 4K Smart TV",
            originalPrice: 279999,
            salePrice: 199999,
            discount: 28,
        },
        {
            id: 3,
            image:
                "https://images.pexels.com/photos/6280847/pexels-photo-6280847.jpeg",
            title: "Samsung 50 Inch QLED TV",
            originalPrice: 249999,
            salePrice: 219999,
            discount: 12,
        },
        {
            id: 4,
            image:
                "https://images.pexels.com/photos/277394/pexels-photo-277394.jpeg",
            title: "Sony Bravia 55 Inch 4K UHD",
            originalPrice: 319999,
            salePrice: 279999,
            discount: 13,
        },
        {
            id: 5,
            image:
                "https://images.pexels.com/photos/276452/pexels-photo-276452.jpeg",
            title: "Panasonic 40 Inch HD Ready TV",
            originalPrice: 99999,
            salePrice: 84999,
            discount: 15,
        },
        {
            id: 6,
            image:
                "https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg",
            title: "Philips 42 Inch Smart LED TV",
            originalPrice: 139999,
            salePrice: 119999,
            discount: 14,
        },
        {
            id: 7,
            image:
                "https://images.pexels.com/photos/271627/pexels-photo-271627.jpeg",
            title: "Hisense 43 Inch LED TV",
            originalPrice: 109999,
            salePrice: 94999,
            discount: 14,
        },
        {
            id: 8,
            image:
                "https://images.pexels.com/photos/271634/pexels-photo-271634.jpeg",
            title: "TCL 50 Inch 4K TV",
            originalPrice: 159999,
            salePrice: 139999,
            discount: 12,
        },
    ];

    const productsPerPage = 4;
    const [page, setPage] = useState(1);

    // Calculate paginated products
    const paginatedProducts = allProducts.slice(
        (page - 1) * productsPerPage,
        page * productsPerPage
    );

    const totalPages = Math.ceil(allProducts.length / productsPerPage);

    return (
        <div className="flex-1 p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">TV (ALL)</h2>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Sort Products By</span>
                    <div className="relative">
                        <select className="appearance-none bg-white border border-gray-300 rounded px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-purple-500">
                            <option>New Arrivals</option>
                            <option>Price: Low to High</option>
                            <option>Price: High to Low</option>
                            <option>Discount</option>
                        </select>
                        <ChevronDown
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={16}
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} {...product} />
                ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center gap-4 mt-8">
                <button
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                    className={`px-4 py-2 rounded-lg ${
                        page === 1
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-purple-600 text-white hover:bg-purple-700"
                    }`}
                >
                    Prev
                </button>

                {Array.from({ length: totalPages }).map((_, idx) => {
                    const pageNum = idx + 1;
                    return (
                        <button
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            className={`px-4 py-2 rounded-lg ${
                                page === pageNum
                                    ? "bg-purple-700 text-white"
                                    : "bg-purple-200 text-purple-800 hover:bg-purple-300"
                            }`}
                        >
                            {pageNum}
                        </button>
                    );
                })}

                <button
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    disabled={page === totalPages}
                    className={`px-4 py-2 rounded-lg ${
                        page === totalPages
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-purple-600 text-white hover:bg-purple-700"
                    }`}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

// Main Page Component
export default function Page() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <div className="max-w-7xl mx-auto mt-6 gap-6 flex flex-1">
                {/* Sidebar Drawer on mobile, always visible on desktop */}
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                {/* Main content area */}
                <div className="flex-1 flex flex-col">
                    {/* Mobile menu button */}
                    <div className="md:hidden p-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="flex items-center gap-2 text-purple-700 font-semibold"
                        >
                            <Menu size={24} />
                            Filters
                        </button>
                    </div>

                    {/* Product Grid */}
                    <ProductGrid />
                </div>
            </div>
        </div>
    );
}
