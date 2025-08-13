'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { apiClient } from '@/../src/libs/network';
import { CircularProgress } from '@mui/material';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Category {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name: string;
    price: number;
    category?: Category;
}

interface ProductListResponse {
    count?: number;
    results?: Product[];
    current_page?: number;
    total_pages?: number;
}

const SORT_OPTIONS = [
    { label: 'Name ASC', value: 'name_asc' },
    { label: 'Name DESC', value: 'name_desc' },
    { label: 'Price ASC', value: 'price_asc' },
    { label: 'Price DESC', value: 'price_desc' },
];

const ItemTable: React.FC = () => {
    const limit = 10;

    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | ''>('');
    const [sortBy, setSortBy] = useState(SORT_OPTIONS[0].value);

    // Debounce search input
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            setCurrentPage(1); // reset to page 1 on search change
        }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    // Fetch categories once
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await apiClient.get<Category[]>('categories/');
                if (Array.isArray(res.data)) {
                    setCategories(res.data);
                }
            } catch (err) {
                console.error('Failed to fetch categories:', err);
            }
        };
        fetchCategories();
    }, []);

    // Fetch products with filters
    const fetchProducts = useCallback(
        async (page = 1) => {
            try {
                setLoading(true);
                setError(null);

                const params: any = {
                    page,
                    limit,
                };

                if (debouncedSearchTerm.trim()) {
                    params.search = debouncedSearchTerm.trim();
                }
                if (selectedCategoryId !== '') {
                    params.category = selectedCategoryId;
                }
                if (sortBy) {
                    params.sort = sortBy;
                }

                const res = await apiClient.get<ProductListResponse>('products/', { params });
                const data = res.data || {};
                const results = Array.isArray(data.results) ? data.results : [];

                setProducts(results);
                setTotalItems(data.count ?? results.length);
                setTotalPages(
                    data.total_pages ?? Math.max(1, Math.ceil((data.count ?? results.length) / limit))
                );
                setCurrentPage(data.current_page ?? page);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load data');
                console.error('Fetch products error:', err);
            } finally {
                setLoading(false);
            }
        },
        [debouncedSearchTerm, selectedCategoryId, sortBy]
    );

    // Refetch on filters/page change
    useEffect(() => {
        fetchProducts(currentPage);
    }, [fetchProducts, currentPage]);

    const handlePageChange = (page: number) => {
        if (page > 0 && page <= totalPages && page !== currentPage) {
            setCurrentPage(page);
        }
    };

    const startIndex = (currentPage - 1) * limit + 1;
    const endIndex = Math.min(currentPage * limit, totalItems);

    return (
        <div className="p-4  rounded-lg bg-white">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                {/* Left: Search Input */}
                <input
                    type="text"
                    placeholder="Search by Name"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="border border-gray-300 rounded-md px-3 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-red-500"
                />

                {/* Right: Category + Sort grouped */}
                <div className="flex gap-3 w-full sm:w-auto justify-end">
                    {/* Category Dropdown */}
                    <select
                        value={selectedCategoryId}
                        onChange={(e) => {
                            const val = e.target.value;
                            setSelectedCategoryId(val === '' ? '' : Number(val));
                            setCurrentPage(1);
                        }}
                        className="border border-gray-300 rounded-md px-3 py-2 w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        <option value="">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>

                    {/* Sort By Dropdown */}
                    <select
                        value={sortBy}
                        onChange={(e) => {
                            setSortBy(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="border border-gray-300 rounded-md px-3 py-2 w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        {SORT_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                Sort by: {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Loading / Error */}
            {loading && (
                <div className="flex justify-center p-4">
                    <CircularProgress size={28} />
                </div>
            )}
            {error && <div className="text-red-500 p-4">Error: {error}</div>}

            {/* Table */}
            {!loading && !error && (
                <>
                    <table className="w-full border-collapse text-sm">
                        <thead>
                        <tr className="bg-gray-100">
                            {/* Removed ID header */}
                            <th className="border border-gray-200 px-3 py-2 text-left font-normal">Name</th>
                            <th className="border border-gray-200 px-3 py-2 text-left font-normal">Price</th>
                            <th className="border border-gray-200 px-3 py-2 text-left font-normal">Category</th>
                            <th className="border border-gray-200 px-3 py-2 text-left font-normal">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {products.length > 0 ? (
                            products.map((product) => (
                                <tr key={product.id} className="bg-white">
                                    {/* Removed ID cell */}
                                    <td className="border border-gray-200 px-3 py-2">{product.name}</td>
                                    <td className="border border-gray-200 px-3 py-2">${product.price}</td>
                                    <td className="border border-gray-200 px-3 py-2">
                                        {product.category?.name || '—'}
                                    </td>
                                    <td className="border border-gray-200 px-3 py-2">
                                        <div className="flex gap-2">
                                            <button className="text-blue-500 hover:underline">Edit</button>
                                            <button className="text-red-500 hover:underline">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="text-center py-4 text-gray-500">
                                    No products found
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>

                    {/* Footer: Showing Entries + Pagination */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 text-sm gap-3">
                        <div className="text-gray-600">
                            {`Showing ${totalItems === 0 ? 0 : startIndex} to ${endIndex} of ${totalItems} entries`}
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center gap-1">
                            <ChevronLeft
                                size={20}
                                className={`cursor-pointer ${
                                    currentPage === 1
                                        ? 'text-gray-300 cursor-not-allowed'
                                        : 'hover:text-red-500'
                                }`}
                                onClick={() => handlePageChange(currentPage - 1)}
                            />

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <span
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`px-3 py-1 border rounded-md text-sm cursor-pointer ${
                                        page === currentPage
                                            ? 'bg-red-500 text-white border-red-500'
                                            : 'hover:bg-gray-200'
                                    }`}
                                >
                  {page}
                </span>
                            ))}

                            <ChevronRight
                                size={20}
                                className={`cursor-pointer ${
                                    currentPage === totalPages
                                        ? 'text-gray-300 cursor-not-allowed'
                                        : 'hover:text-red-500'
                                }`}
                                onClick={() => handlePageChange(currentPage + 1)}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ItemTable;
