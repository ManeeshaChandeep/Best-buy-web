import { useState, useEffect, useRef, useCallback } from 'react';
import { apiClient } from '@/../src/libs/network';

interface Product {
    id: number;
    name: string;
    sku: string;
    model_number?: string;
    price: number;
    old_price?: number;
    quantity: number;
    warranty?: number;
    delivery_available: boolean;
    category: Category;
    subcategory?: Category;
    image_url?: string;
    description?: string;
    images?: string[];
}

interface ProductListResponse {
    count: number;
    total_pages: number;
    current_page: number;
    limit: number;
    results: Product[];
}

interface Category {
    id: string | number;
    name: string;
    parent?: string | number;
}

interface ItemTableProps {
    onEditProduct: (productId: number) => void;
    refreshKey: number;
}

export default function ItemTable({ onEditProduct, refreshKey }: ItemTableProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedSubcategory, setSelectedSubcategory] = useState('all');
    const [loading, setLoading] = useState(true);
    const [searchLoading, setSearchLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeActionMenu, setActiveActionMenu] = useState<number | null>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const actionMenuRef = useRef<HTMLDivElement>(null);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [pageSize] = useState(10);

    // Type guard for Product array
    function isProductArray(data: any): data is Product[] {
        return Array.isArray(data) && data.every(item =>
            typeof item.id === 'number' &&
            typeof item.name === 'string' &&
            typeof item.sku === 'string' &&
            (typeof item.price === 'number' || typeof item.price === 'string')
        );
    }

    // Type guard for Category array
    function isCategoryArray(data: any): data is Category[] {
        return Array.isArray(data) && data.every(item =>
            (typeof item.id === 'string' || typeof item.id === 'number') &&
            typeof item.name === 'string'
        );
    }

    // Fetch products and categories with search and filters
    const fetchData = useCallback(async (page: number = 1, search: string = '', category: string = 'all', subcategory: string = 'all', isSearch: boolean = false) => {
        try {
            if (isSearch) {
                setSearchLoading(true);
            } else {
                setLoading(true);
            }
            setError(null);

            // Build query parameters
            const params = new URLSearchParams();
            params.append('page', page.toString());
            params.append('limit', pageSize.toString());

            if (search.trim()) {
                params.append('search', search.trim());
            }

            if (category !== 'all') {
                params.append('category', category);
            }

            if (subcategory !== 'all') {
                params.append('subcategory', subcategory);
            }

            const [productsResponse, categoriesResponse] = await Promise.all([
                apiClient.get<ProductListResponse>(`products/?${params.toString()}`),
                apiClient.get<Category[]>('categories/')
            ]);

            if (!isProductArray(productsResponse.results)) {
                throw new Error('Invalid product data format from API');
            }

            if (!isCategoryArray(categoriesResponse)) {
                throw new Error('Invalid category data format from API');
            }

            // Convert all prices to numbers and handle potential missing data
            const processedProducts = productsResponse.results.map(product => ({
                ...product,
                price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
                old_price: product.old_price
                    ? (typeof product.old_price === 'string' ? parseFloat(product.old_price) : product.old_price)
                    : undefined,
                quantity: product.quantity || 0,
                delivery_available: product.delivery_available || false,
                warranty: product.warranty || undefined
            }));

            setProducts(processedProducts);
            setCategories(categoriesResponse);
            setTotalPages(productsResponse.total_pages);
            setTotalCount(productsResponse.count);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load data');
            console.error('API Error:', err);
        } finally {
            if (isSearch) {
                setSearchLoading(false);
            } else {
                setLoading(false);
            }
        }
    }, [pageSize]);

    // Fetch data on component mount and refresh
    useEffect(() => {
        fetchData(currentPage, searchTerm, selectedCategory, selectedSubcategory);
    }, [refreshKey, currentPage, fetchData]);

    // Debounced search function
    const debouncedSearch = useCallback((searchValue: string) => {
        // Clear existing timeout
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        // Set new timeout for search
        searchTimeoutRef.current = setTimeout(() => {
            setCurrentPage(1); // Reset to first page when searching
            fetchData(1, searchValue, selectedCategory, selectedSubcategory, true); // Pass true for search loading
        }, 500); // 500ms delay
    }, [fetchData, selectedCategory, selectedSubcategory]);

    // Handle search input change
    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        debouncedSearch(value);
    };

    // Close action menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
                setActiveActionMenu(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Focus search input on component mount and when a key is pressed
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === 'F2' || (e.ctrlKey && e.key === 'k')) {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        searchInputRef.current?.focus();

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, []);

    // Cleanup search timeout on unmount
    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    // Get unique main categories
    const mainCategories = ['all', ...new Set(
        categories.filter(cat => !cat.parent).map(cat => cat.name)
    )];

    // Get subcategories based on selected main category
    const getSubcategories = () => {
        if (selectedCategory === 'all') return ['all'];

        const parentCategory = categories.find(c => c.name === selectedCategory);
        if (!parentCategory) return ['all'];

        return ['all', ...new Set(
            categories
                .filter(cat => cat.parent?.toString() === parentCategory.id.toString())
                .map(cat => cat.name)
        )];
    };

    // Safe price formatter
    const formatPrice = (price?: number): string => {
        if (price === undefined) return 'N/A';
        return new Intl.NumberFormat('en-lk', {
            style: 'currency',
            currency: 'LKR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(price);
    };

    const handleEdit = (productId: number) => {
        onEditProduct(productId);
        setActiveActionMenu(null);
    };

    const handleDelete = async (product: Product) => {
        if (!confirm(`Are you sure you want to delete ${product.name}?`)) return;

        try {
            await apiClient.delete(`products/${product.id}/`);
            // Refresh data after deletion
            fetchData(currentPage, searchTerm, selectedCategory, selectedSubcategory, true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete product');
            console.error('Delete Error:', err);
        } finally {
            setActiveActionMenu(null);
        }
    };

    const toggleActionMenu = (id: number) => {
        setActiveActionMenu(activeActionMenu === id ? null : id);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        setActiveActionMenu(null);
        // Fetch data for the new page
        fetchData(page, searchTerm, selectedCategory, selectedSubcategory, true);
    };

    const handleCategoryFilter = (category: string) => {
        setSelectedCategory(category);
        setSelectedSubcategory('all');
        setCurrentPage(1);
        // Fetch data with new category filter
        fetchData(1, searchTerm, category, 'all', true);
    };

    const handleSubcategoryFilter = (subcategory: string) => {
        setSelectedSubcategory(subcategory);
        setCurrentPage(1);
        // Fetch data with new subcategory filter
        fetchData(1, searchTerm, selectedCategory, subcategory, true);
    };

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };

    if (loading) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    <span className="ml-3 text-gray-600">Loading products...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                    <p className="font-bold">Error loading products:</p>
                    <p>{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Product List</h2>

                {/* Search and Filters */}
                <div className="space-y-4">
                    {/* Search Bar */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            ref={searchInputRef}
                            type="text"
                            className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            placeholder="Search by name, SKU or model (Press F2 to focus)"
                            value={searchTerm}
                            onChange={(e) => handleSearchChange(e.target.value)}
                        />
                        {searchLoading && (
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        )}
                        {searchTerm && !searchLoading && (
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                                onClick={() => {
                                    setSearchTerm('');
                                    setCurrentPage(1);
                                    fetchData(1, '', selectedCategory, selectedSubcategory, true);
                                }}
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Category Filters */}
                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center">
                            <label htmlFor="category" className="mr-3 text-sm font-medium text-gray-700">
                                Category:
                            </label>
                            <select
                                id="category"
                                className="block w-40 pl-3 pr-10 py-2 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg"
                                value={selectedCategory}
                                onChange={(e) => handleCategoryFilter(e.target.value)}
                            >
                                {mainCategories.map(category => (
                                    <option key={category} value={category}>
                                        {category === 'all' ? 'All Categories' : category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedCategory !== 'all' && (
                            <div className="flex items-center">
                                <label htmlFor="subcategory" className="mr-3 text-sm font-medium text-gray-700">
                                    Subcategory:
                                </label>
                                <select
                                    id="subcategory"
                                    className="block w-40 pl-3 pr-10 py-2 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg"
                                    value={selectedSubcategory}
                                    onChange={(e) => handleSubcategoryFilter(e.target.value)}
                                >
                                    {getSubcategories().map(subcategory => (
                                        <option key={subcategory} value={subcategory}>
                                            {subcategory === 'all' ? 'All Subcategories' : subcategory}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    {/* Results Count */}
                    <div className="text-sm text-gray-600">
                        Showing {products.length} of {totalCount} products (Page {currentPage} of {totalPages})
                    </div>
                </div>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Image
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                SKU
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Model
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Price
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Quantity
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Category
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.length > 0 ? (
                            products.map(product => (
                                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {product.images?.length > 0 ? (
                                            <img
                                                src={`https://api.bestbuyelectronics.lk${product.images[0]}`}
                                                alt={product.name}
                                                className="h-12 w-12 rounded-lg object-cover border border-gray-200"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = '/placeholder-product.png';
                                                    (e.target as HTMLImageElement).classList.add('bg-gray-100');
                                                }}
                                            />
                                        ) : (
                                            <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center border border-gray-200">
                                                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900 max-w-xs truncate" title={product.name}>
                                            {product.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
                                            {product.sku}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">
                                            {product.model_number || '-'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {formatPrice(product.price)}
                                            {product.old_price && product.old_price > product.price && (
                                                <div className="text-xs text-gray-400 line-through">
                                                    {formatPrice(product.old_price)}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className={`text-sm font-medium ${product.quantity <= 0 ? 'text-red-600' : 'text-gray-900'}`}>
                                            {product.quantity}
                                            {product.quantity <= 0 && (
                                                <div className="text-xs text-red-500">Out of stock</div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {product.category?.name}
                                            {product.subcategory && (
                                                <div className="text-xs text-gray-500">
                                                    {product.subcategory?.name}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 relative">
                                        <button
                                            onClick={() => toggleActionMenu(product.id)}
                                            className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                                        >
                                            Actions
                                        </button>

                                        {activeActionMenu === product.id && (
                                            <div
                                                ref={actionMenuRef}
                                                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200"
                                            >
                                                <div className="py-1">
                                                    <button
                                                        onClick={() => handleEdit(product.id)}
                                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                                    >
                                                        ✏️ Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product)}
                                                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
                                                    >
                                                        🗑️ Delete
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} className="px-6 py-8 text-center text-sm text-gray-500">
                                    <div className="flex flex-col items-center">
                                        <svg className="h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                        </svg>
                                        <p className="text-lg font-medium text-gray-900 mb-1">No products found</p>
                                        <p className="text-gray-500">No products match your current search criteria</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                        Showing page {currentPage} of {totalPages} ({totalCount} total products)
                    </div>
                    <div className="flex items-center space-x-2">
                        {/* Previous Page */}
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Previous
                        </button>

                        {/* Page Numbers */}
                        {getPageNumbers().map(page => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${page === currentPage
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}

                        {/* Next Page */}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            <div className="mt-4 text-xs text-gray-500 text-center">
                💡 Tip: Press F2 or Ctrl+K to quickly focus the search field
            </div>
        </div>
    );
}
