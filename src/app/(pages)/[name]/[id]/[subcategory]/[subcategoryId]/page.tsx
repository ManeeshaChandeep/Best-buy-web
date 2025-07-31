"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ChevronDown, ChevronUp, Menu, X } from "lucide-react";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";

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

// ------------------ ItemCard ------------------

function ItemCard({
                      id,
                      imageUrl,
                      title,
                      oldPrice,
                      newPrice,
                  }: {
    id: number;
    imageUrl: string;
    title: string;
    oldPrice?: number;
    newPrice: number;
}) {
    return (
        <div className="bg-white rounded shadow-sm p-3 hover:shadow-md transition w-full sm:w-auto">
            <img
                src={imageUrl}
                alt={title}
                className="w-full h-32 object-contain mb-2"
            />
            <h3 className="text-sm font-medium text-gray-700 truncate">{title}</h3>
            <div className="mt-1">
                {oldPrice && (
                    <p className="text-xs line-through text-gray-400 mb-0.5">
                        Rs. {oldPrice.toLocaleString()}.00
                    </p>
                )}
                <p className="text-sm text-red-600 font-semibold">
                    Rs. {newPrice.toLocaleString()}.00
                </p>
            </div>
        </div>
    );
}

// ------------------ Sidebar ------------------

function Sidebar({
                     isOpen,
                     onClose,
                     selectedCategories,
                     selectedBrands,
                     toggleCategory,
                     toggleBrand,
                 }: {
    isOpen: boolean;
    onClose: () => void;
    selectedCategories: string[];
    selectedBrands: string[];
    toggleCategory: (cat: string) => void;
    toggleBrand: (brand: string) => void;
}) {
    const [categoriesOpen, setCategoriesOpen] = useState(true);
    const [brandsOpen, setBrandsOpen] = useState(true);

    const FilterContent = () => (
        <div className="p-6 w-full bg-white">
            <h3 className="text-xl font-semibold mb-6">Filter Products</h3>
            <div className="mb-8">
                <button
                    onClick={() => setCategoriesOpen(!categoriesOpen)}
                    className="flex justify-between w-full font-semibold text-gray-800 mb-3"
                    aria-expanded={categoriesOpen}
                    aria-controls="categories-list"
                >
                    <span>Categories</span>
                    {categoriesOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {categoriesOpen && (
                    <div id="categories-list" className="flex flex-col space-y-2">
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
                    aria-expanded={brandsOpen}
                    aria-controls="brands-list"
                >
                    <span>Brands</span>
                    {brandsOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {brandsOpen && (
                    <div id="brands-list" className="flex flex-col space-y-2">
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

    return (
        <>
            {/* Desktop sidebar: visible only at lg and above */}
            <aside className="hidden lg:block w-64 border-r border-gray-200 bg-white sticky top-0 h-screen overflow-auto">
                <FilterContent />
            </aside>

            {/* Mobile + Tablet Drawer: visible below lg */}
            <Drawer
                anchor="left"
                open={isOpen}
                onClose={onClose}
                sx={{
                    display: { xs: "block", md: "block", lg: "none" }, // xs + sm + md (mobile+tablet)
                    "& .MuiDrawer-paper": {
                        width: "80%",
                        maxWidth: 320,
                    },
                }}
            >
                <div className="flex justify-end p-4 border-b">
                    <button onClick={onClose} aria-label="Close filters">
                        <X size={24} />
                    </button>
                </div>
                <FilterContent />
            </Drawer>
        </>
    );
}

// ------------------ ProductGrid ------------------

function ProductGrid({
                         id,
                         selectedCategories,
                         selectedBrands,
                         sortBy,
                     }: {
    id?: any;
    selectedCategories: string[];
    selectedBrands: string[];
    sortBy: string;
}) {
    const productsPerPage = 8;
    const [products, setProducts] = useState<Product[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchProducts(pageNum: number) {
            setLoading(true);
            try {
                const queryParams = new URLSearchParams({
                    page: pageNum.toString(),
                    limit: productsPerPage.toString(),
                    category: id || "",
                    sort: sortBy,
                });

                if (selectedCategories.length > 0)
                    queryParams.append("categoryFilter", selectedCategories.join(","));
                if (selectedBrands.length > 0)
                    queryParams.append("brandFilter", selectedBrands.join(","));

                const res = await fetch(`${BE_URL}/products/?${queryParams.toString()}`, {
                    cache: "no-store",
                });
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

    const handlePageChange = (_: any, value: number) => {
        setPage(value);
    };

    return (
        <div className="flex-1 px-0 max-w-screen-xl mx-auto">
            <h2 className="text-xl font-semibold mb-4 mt-2 text-gray-800">TV (ALL)</h2>
            {loading ? (
                <div className="text-center py-20 text-red-600 font-medium">
                    Loading products...
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ItemCard
                                key={product.id}
                                id={product.id}
                                imageUrl={`${BE_URL}${product.images?.[0] || ""}`}
                                title={product.name}
                                oldPrice={product.old_price}
                                newPrice={product.price}
                            />
                        ))}
                    </div>

                    <div className="flex justify-center mt-8 mb-6">
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

// ------------------ Main Page ------------------

export default function Page() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState("new");
    const params = useParams();
    const id = params?.subcategoryId;

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
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <div className="mx-auto mt-4 gap-6 flex flex-1 max-w-screen-xl px-4 md:px-2">
                <Sidebar
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                    selectedCategories={selectedCategories}
                    selectedBrands={selectedBrands}
                    toggleCategory={toggleCategory}
                    toggleBrand={toggleBrand}
                />

                <div className="flex-1 flex flex-col">
                    {/* Filter toggle button: visible only below lg */}
                    <div className="lg:hidden flex justify-between items-center mb-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="flex items-center gap-2 text-red-600 font-semibold"
                        >
                            <Menu size={24} />
                            Filters
                        </button>

                        <select
                            className="bg-white border border-gray-300 rounded px-4 py-2 text-sm text-gray-700"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            aria-label="Sort products"
                        >
                            <option value="new">New Arrivals</option>
                            <option value="low">Price: Low to High</option>
                            <option value="high">Price: High to Low</option>
                            <option value="discount">Discount</option>
                        </select>
                    </div>

                    <ProductGrid
                        id={id}
                        selectedCategories={selectedCategories}
                        selectedBrands={selectedBrands}
                        sortBy={sortBy}
                    />
                </div>
            </div>
        </div>
    );
}
