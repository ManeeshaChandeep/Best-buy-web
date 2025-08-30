"use client";

import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Menu, X } from "lucide-react";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import Drawer from "@mui/material/Drawer";
import { apiClient } from "@/libs/network";
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

interface Category {
    id: number;
    name: string;
    image: string;
    parent: number | null;
    subcategories: Category[];
}

interface Brand {
    id: number;
    name: string;
}

interface DetailsResponse {
    id: number;
    image: string;
    name: string;
    subcategories: Category[];
    brands: Brand[];
}

interface ProductListingPageProps {
    categoryId: string;
    categoryName?: string;
    showSortInHeader?: boolean;
    pageTitle?: string;
}

function FilterContent({
    selectedCategories,
    selectedBrands,
    toggleCategory,
    toggleBrand,
    categoriesOpen,
    setCategoriesOpen,
    brandsOpen,
    setBrandsOpen,
    brands,
    subcategories,
}: {
    selectedCategories: string[];
    selectedBrands: string[];
    toggleCategory: (cat: string) => void;
    toggleBrand: (brand: string) => void;
    categoriesOpen: boolean;
    setCategoriesOpen: (open: boolean) => void;
    brandsOpen: boolean;
    setBrandsOpen: (open: boolean) => void;
    brands: Brand[];
    subcategories: Category[];
}) {
    return (
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
                        {subcategories.length > 0 ? (
                            subcategories.map((cat: Category) => (
                                <label key={cat.id} className="inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="mr-3 w-4 h-4 text-red-500 accent-red-500"
                                        checked={selectedCategories.includes(cat.id.toString())}
                                        onChange={() => toggleCategory(cat.id.toString())}
                                    />
                                    {cat.name}
                                </label>
                            ))
                        ) : (
                            <span className="text-gray-500 text-sm">No categories available</span>
                        )}
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
                        {brands.length > 0 ? (
                            brands.map((brand: Brand) => (
                                <label key={brand.id} className="inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="mr-3 w-4 h-4 text-red-500 accent-red-500"
                                        checked={selectedBrands.includes(brand.id.toString())}
                                        onChange={() => toggleBrand(brand.id.toString())}
                                    />
                                    {brand.name}
                                </label>
                            ))
                        ) : (
                            <span className="text-gray-500 text-sm">No brands available</span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function Sidebar({
    isOpen,
    onClose,
    selectedCategories,
    selectedBrands,
    toggleCategory,
    toggleBrand,
    brands,
    subcategories,
}: {
    isOpen: boolean;
    onClose: () => void;
    selectedCategories: string[];
    selectedBrands: string[];
    toggleCategory: (cat: string) => void;
    toggleBrand: (brand: string) => void;
    brands: Brand[];
    subcategories: Category[];
}) {
    const [categoriesOpen, setCategoriesOpen] = useState(true);
    const [brandsOpen, setBrandsOpen] = useState(true);

    return (
        <>
            {/* Desktop sidebar only at lg and above */}
            <aside className="hidden lg:block w-64 border-r border-gray-200 bg-white sticky top-0 h-screen overflow-auto">
                <FilterContent
                    selectedCategories={selectedCategories}
                    selectedBrands={selectedBrands}
                    toggleCategory={toggleCategory}
                    toggleBrand={toggleBrand}
                    categoriesOpen={categoriesOpen}
                    setCategoriesOpen={setCategoriesOpen}
                    brandsOpen={brandsOpen}
                    setBrandsOpen={setBrandsOpen}
                    brands={brands}
                    subcategories={subcategories}
                />
            </aside>

            {/* Mobile and tablet Drawer */}
            <Drawer
                anchor="left"
                open={isOpen}
                onClose={onClose}
                sx={{
                    display: { xs: "block", md: "block", lg: "none" },
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
                <FilterContent
                    selectedCategories={selectedCategories}
                    selectedBrands={selectedBrands}
                    toggleCategory={toggleCategory}
                    toggleBrand={toggleBrand}
                    categoriesOpen={categoriesOpen}
                    setCategoriesOpen={setCategoriesOpen}
                    brandsOpen={brandsOpen}
                    setBrandsOpen={setBrandsOpen}
                    brands={brands}
                    subcategories={subcategories}
                />
            </Drawer>
        </>
    );
}

function SortDropdown({ sortBy, setSortBy, className = "" }: { sortBy: string; setSortBy: (value: string) => void; className?: string }) {
    return (
        <select
            className={`bg-white border border-gray-300 rounded px-4 py-2 text-sm text-gray-700 ${className}`}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort products"
        >
            <option value="new">New Arrivals</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
            <option value="discount">Discount</option>
        </select>
    );
}

function ProductGrid({
    categoryId,
    selectedCategories,
    selectedBrands,
    sortBy,
    setSortBy,
    categoryName,
    showSortInHeader = false,
}: {
    categoryId: string;
    selectedCategories: string[];
    selectedBrands: string[];
    sortBy: string;
    setSortBy: (value: string) => void;
    categoryName: string;
    showSortInHeader?: boolean;
}) {
    const productsPerPage = 10;
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
                    filter_by: sortBy,
                });

                // category from `categoryId` if set
                if (categoryId) {
                    queryParams.set("category", categoryId);
                }

                // multiple categories
                if (selectedCategories.length > 0) {
                    queryParams.set("category", selectedCategories.join(","));
                }

                // multiple brands
                if (selectedBrands.length > 0) {
                    queryParams.set("brand", selectedBrands.join(","));
                }

                const res = await fetch(
                    `${BE_URL}/products/?${queryParams.toString()}`,
                    { cache: "no-store" }
                );

                if (!res.ok) {
                    throw new Error(`API error ${res.status}`);
                }

                const data = await res.json();
                const apiProducts = data.results || [];

                setProducts(apiProducts);
                if (data.count) {
                    setTotalPages(Math.ceil(data.count / productsPerPage));
                }
            } catch (error) {
                console.error("Failed to fetch products", error);
            } finally {
                setLoading(false);
            }
        }

        fetchProducts(page);
    }, [page, categoryId, selectedCategories, selectedBrands, sortBy]);

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    return (
        <div className="flex-1 px-0 max-w-screen-xl mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">{categoryName}</h2>
                {showSortInHeader && (
                    <div className="lg:block hidden">
                        <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />
                    </div>
                )}
            </div>

            {loading ? (
                <div className="text-center py-20 text-red-600 font-medium">
                    Loading products...
                </div>
            ) : (
                <>
                    {/* 2 cols on mobile/tablet, 3 on md laptop, 4 on lg desktop */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 bg-white">
                        {products.map((product) => (
                            <ItemCard
                                imageSrc={null}
                                inStock={true}
                                id={product.id}
                                key={product.id}
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

export default function ProductListingPage({
    categoryId,
    categoryName: initialCategoryName = "",
    showSortInHeader = false,
    pageTitle
}: ProductListingPageProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState("new");
    const [categoryName, setCategoryName] = useState<string>(initialCategoryName);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [subcategories, setSubcategories] = useState<Category[]>([]);

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

    useEffect(() => {
        const fetchCategory = () => {
            apiClient.get<DetailsResponse>(`/categories/details/${categoryId}/`).then((response) => {
                setCategoryName(response.name || "Unknown Category");
                setBrands(response.brands);
                setSubcategories(response.subcategories);
            }).catch((error) => {
                console.error("Failed to fetch category", error);
            });
        };

        if (categoryId) {
            fetchCategory();
        }
    }, [categoryId]);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Main Content */}
            <div className="mx-auto mt-4 gap-6 flex flex-1 max-w-screen-xl px-4 md:px-2">
                <Sidebar
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                    selectedCategories={selectedCategories}
                    selectedBrands={selectedBrands}
                    brands={brands}
                    subcategories={subcategories}
                    toggleCategory={toggleCategory}
                    toggleBrand={toggleBrand}
                />

                <div className="flex-1 flex flex-col">
                    {/* Filter + Sort Row for Mobile & Tablet */}
                    <div className="flex justify-between items-center mb-4 lg:hidden">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="flex items-center gap-2 text-red-600 font-semibold"
                            aria-label="Open filters"
                        >
                            <Menu size={20} />
                            Filters
                        </button>

                        <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />
                    </div>

                    <ProductGrid
                        categoryId={categoryId}
                        selectedCategories={selectedCategories}
                        selectedBrands={selectedBrands}
                        categoryName={categoryName}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                        showSortInHeader={showSortInHeader}
                    />
                </div>
            </div>
        </div>
    );
}
