"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ChevronDown, ChevronUp, Menu, X } from "lucide-react";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import Drawer from "@mui/material/Drawer";

import categoryOne from "../../../../../public/images/tv.png";
import ItemCard from "@/components/ItemCard";

const BE_URL = "https://api.bestbuyelectronics.lk";

interface Product {
    id: number;
    name: string;
    sku: string;
    price: number;
    old_price?: number;
    quantity: number;
    category: string;
    images?: string[];
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

function FilterContent({
                           selectedCategories,
                           selectedBrands,
                           toggleCategory,
                           toggleBrand,
                           categoriesOpen,
                           setCategoriesOpen,
                           brandsOpen,
                           setBrandsOpen,
                       }: any) {
    return (
        <div className="p-6 w-full bg-white">
            <h3 className="text-xl font-semibold mb-6">Filter Products</h3>

            <div className="mb-8">
                <button
                    onClick={() => setCategoriesOpen(!categoriesOpen)}
                    className="flex justify-between w-full font-semibold text-gray-800 mb-3"
                >
                    <span>Categories</span>
                    {categoriesOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {categoriesOpen && (
                    <div className="flex flex-col space-y-2">
                        {categories.map((cat) => (
                            <label key={cat} className="inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="mr-3 w-4 h-4 text-red-500 accent-red-500"
                                    checked={selectedCategories.includes(cat)}
                                    onChange={() => toggleCategory(cat)}
                                />
                                {cat}
                            </label>
                        ))}
                    </div>
                )}
            </div>

            <div>
                <button
                    onClick={() => setBrandsOpen(!brandsOpen)}
                    className="flex justify-between w-full font-semibold text-gray-800 mb-3"
                >
                    <span>Brands</span>
                    {brandsOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {brandsOpen && (
                    <div className="flex flex-col space-y-2">
                        {brands.map((brand) => (
                            <label key={brand} className="inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="mr-3 w-4 h-4 text-red-500 accent-red-500"
                                    checked={selectedBrands.includes(brand)}
                                    onChange={() => toggleBrand(brand)}
                                />
                                {brand}
                            </label>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
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
            {/* Desktop Sidebar */}
            <aside className="hidden md:block w-64 border-r border-gray-200 bg-white">
                <FilterContent
                    selectedCategories={selectedCategories}
                    selectedBrands={selectedBrands}
                    toggleCategory={toggleCategory}
                    toggleBrand={toggleBrand}
                    categoriesOpen={categoriesOpen}
                    setCategoriesOpen={setCategoriesOpen}
                    brandsOpen={brandsOpen}
                    setBrandsOpen={setBrandsOpen}
                />
            </aside>

            {/* Mobile Drawer */}
            <Drawer
                anchor="left"
                open={isOpen}
                onClose={onClose}
                sx={{
                    display: { xs: "block", md: "none" },
                    "& .MuiDrawer-paper": {
                        width: "80%",
                        maxWidth: 320,
                    },
                }}
            >
                <div className="flex justify-end p-4 border-b">
                    <button onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>
                <FilterContent
                    selectedCategories={selectedCategories}
                    selectedBrands={selectedBrands}
                    toggleCategory={toggleCategory}
                    toggleBrand={toggleBrand}
                    categoriesOpen={categoriesOpen}
                    setCategoriesOpen={setCategoriesOpen}
                    brandsOpen={brandsOpen}
                    setBrandsOpen={setBrandsOpen}
                />
            </Drawer>
        </>
    );
}

function ProductGrid({ id }: { id?: any }) {
    const productsPerPage = 7;
    const [products, setProducts] = useState<Product[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchProducts(pageNum: number) {
            setLoading(true);
            try {
                const res = await fetch(
                    `https://api.bestbuyelectronics.lk/products/?page=${pageNum}&limit=${productsPerPage}&category=${id}`,
                    { cache: "no-store" }
                );
                const data = await res.json();
                const apiProducts = data.results || [];

                setProducts(apiProducts);
                if (data.count) {
                    setTotalPages(Math.ceil(data.count / productsPerPage));
                }
            } catch (error) {
                console.error("Failed to fetch products", error);
            }
            setLoading(false);
        }

        fetchProducts(page);
    }, [page, id]);

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    return (
        <div className="flex-1 p-4">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">TV (ALL)</h2>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Sort Products By</span>
                    <select className="bg-white border border-gray-300 rounded px-4 py-2">
                        <option>New Arrivals</option>
                        <option>Price: Low to High</option>
                        <option>Price: High to Low</option>
                        <option>Discount</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20 text-red-600 font-medium">Loading products...</div>
            ) : (
                <>
                    <div className="flex flex-wrap gap-4">
                        {products.map((product) => (
                            <ItemCard
                                id={product.id}
                                key={product.id}
                                imageUrl={`${BE_URL}${product.images?.[0] || ""}`}
                                imageSrc={categoryOne}
                                title={product.name}
                                oldPrice={product.old_price}
                                newPrice={product.price}
                                inStock={product.quantity > 0}
                            />
                        ))}
                    </div>

                    <div className="flex justify-center mt-8">
                        <Stack spacing={2}>
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={handlePageChange}
                                variant="outlined"
                                shape="rounded"
                                sx={{
                                    "& .MuiPaginationItem-root": {
                                        borderColor: "red",
                                        color: "red",
                                    },
                                    "& .Mui-selected": {
                                        backgroundColor: "red !important",
                                        color: "white !important",
                                        borderColor: "red !important",
                                    },
                                }}
                            />
                        </Stack>
                    </div>
                </>
            )}
        </div>
    );
}

export default function Page() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const params = useParams();
    const id = params?.id;

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <div className="mx-auto mt-6 gap-6 flex flex-1">
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                <div className="flex-1 flex flex-col">
                    {/* Mobile button to open filter drawer */}
                    <div className="md:hidden p-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="flex items-center gap-2 text-purple-700 font-semibold"
                        >
                            <Menu size={24} />
                            Filters
                        </button>
                    </div>

                    <ProductGrid id={id} />
                </div>
            </div>
        </div>
    );
}
