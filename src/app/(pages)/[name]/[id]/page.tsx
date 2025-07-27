"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Menu, X } from "lucide-react";

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
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 group relative">
            <div className="relative">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {discount > 0 && (
                    <div className="absolute top-3 left-3">
                        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                            {discount}%
                        </span>
                        <div className="text-xs text-white bg-red-500 px-1 rounded-b">OFF</div>
                    </div>
                )}
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
                    {originalPrice > salePrice && (
                        <span className="text-xs text-gray-500 line-through">
                            {formatPrice(originalPrice)}
                        </span>
                    )}
                    <span className="text-lg font-bold text-red-600">
                        {formatPrice(salePrice)}
                    </span>
                </div>
            </div>
        </div>
    );
};

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const categories = [
    "LED TV",
    "Smart LED TV",
    "OLED TV",
    "UHD TV",
    "JVC TV Special Offer",
    "TV Accessories",
];

const brands = ["LG", "Toshiba", "Haier", "JVC", "Abans"];

function Sidebar({ isOpen, onClose }: SidebarProps) {
    const [categoriesOpen, setCategoriesOpen] = useState(true);
    const [brandsOpen, setBrandsOpen] = useState(true);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

    const toggleCategory = (category: string) => {
        setSelectedCategories((prev) =>
            prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
        );
    };

    const toggleBrand = (brand: string) => {
        setSelectedBrands((prev) =>
            prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
        );
    };

    return (
        <>
            <div
                onClick={onClose}
                className={`fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity duration-300 ${
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                } md:hidden`}
            />

            <aside
                className={`fixed top-0 left-0 bottom-0 w-72 bg-white border-r border-gray-200 p-6 z-50 transform transition-transform duration-300 ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                } md:translate-x-0 md:static md:w-64 flex flex-col`}
            >
                <div className="flex justify-end mb-4 md:hidden">
                    <button
                        onClick={onClose}
                        className="p-2 rounded hover:bg-gray-100 focus:outline-none"
                        aria-label="Close sidebar"
                    >
                        <X size={24} />
                    </button>
                </div>

                <h3 className="text-xl font-semibold mb-6">Filter Products</h3>

                <div className="flex-grow overflow-y-auto">
                    <section className="mb-8">
                        <button
                            onClick={() => setCategoriesOpen(!categoriesOpen)}
                            className="flex items-center justify-between w-full font-semibold text-gray-800 mb-3"
                        >
                            <span>Categories</span>
                            {categoriesOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                        {categoriesOpen && (
                            <div className="flex flex-col space-y-2">
                                {categories.map((cat) => (
                                    <label key={cat} className="inline-flex items-center cursor-pointer text-gray-700 hover:text-purple-600">
                                        <input
                                            type="checkbox"
                                            className="mr-3 w-4 h-4 text-purple-600"
                                            checked={selectedCategories.includes(cat)}
                                            onChange={() => toggleCategory(cat)}
                                        />
                                        {cat}
                                    </label>
                                ))}
                            </div>
                        )}
                    </section>

                    <section>
                        <button
                            onClick={() => setBrandsOpen(!brandsOpen)}
                            className="flex items-center justify-between w-full font-semibold text-gray-800 mb-3"
                        >
                            <span>Brands</span>
                            {brandsOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                        {brandsOpen && (
                            <div className="flex flex-col space-y-2">
                                {brands.map((brand) => (
                                    <label key={brand} className="inline-flex items-center cursor-pointer text-gray-700 hover:text-purple-600">
                                        <input
                                            type="checkbox"
                                            className="mr-3 w-4 h-4 text-purple-600"
                                            checked={selectedBrands.includes(brand)}
                                            onChange={() => toggleBrand(brand)}
                                        />
                                        {brand}
                                    </label>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </aside>
        </>
    );
}

function ProductGrid() {
    const productsPerPage = 7;
    const [products, setProducts] = useState<ProductCardProps[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchProducts(pageNum: number) {
            setLoading(true);
            try {
                const res = await fetch(
                    `https://api.bestbuyelectronics.lk/products/?page=${pageNum}&limit=50`,
                    { cache: "no-store" }
                );
                const data = await res.json();
                const apiProducts = data.results || [];

                const formatted: ProductCardProps[] = apiProducts.map((p: any) => ({
                    id: p.id,
                    image: p.image || p.images?.[0] || "",
                    title: p.title || p.name || "Unknown Product",
                    originalPrice: Number(p.oldPrice || p.originalPrice || 0),
                    salePrice: Number(p.newPrice || p.salePrice || 0),
                    discount: p.discount || 0,
                    isNew: p.isNew || false,
                }));

                setProducts(formatted);
                setTotalPages(Math.ceil((data.total || formatted.length) / productsPerPage));
            } catch (error) {
                console.error("Failed to fetch products", error);
            }
            setLoading(false);
        }

        fetchProducts(page);
    }, [page]);

    const paginatedProducts = products.slice(
        (page - 1) * productsPerPage,
        page * productsPerPage
    );

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
                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20 text-purple-600 font-medium">
                    Loading products...
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {paginatedProducts.map((product) => (
                            <ProductCard key={product.id} {...product} />
                        ))}
                    </div>

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
                </>
            )}
        </div>
    );
}

export default function Page() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <div className="max-w-7xl mx-auto mt-6 gap-6 flex flex-1">
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                <div className="flex-1 flex flex-col">
                    <div className="md:hidden p-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="flex items-center gap-2 text-purple-700 font-semibold"
                        >
                            <Menu size={24} />
                            Filters
                        </button>
                    </div>

                    <ProductGrid />
                </div>
            </div>
        </div>
    );
}
