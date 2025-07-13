import { useState, useEffect, useRef } from 'react';
import { apiClient } from '@/../src/libs/network'; // Adjust path as needed

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
    category: string;
    subcategory?: string;
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
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedSubcategory, setSelectedSubcategory] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeActionMenu, setActiveActionMenu] = useState<number | null>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const actionMenuRef = useRef<HTMLDivElement>(null);

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

    // Fetch products and categories
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const [productsResponse, categoriesResponse] = await Promise.all([
                    apiClient.get<ProductListResponse>('products/'),
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
                    category: product.category || 'Uncategorized',
                    subcategory: product.subcategory || undefined,
                    delivery_available: product.delivery_available || false,
                    warranty: product.warranty || undefined
                }));

                setProducts(processedProducts);
                setCategories(categoriesResponse);
                setFilteredProducts(processedProducts);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load data');
                console.error('API Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [refreshKey]);

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

    // Filter products based on search term, category, and subcategory
    useEffect(() => {
        let results = products;

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            results = results.filter(product =>
                product.name.toLowerCase().includes(term) ||
                product.sku.toLowerCase().includes(term) ||
                (product.model_number && product.model_number.toLowerCase().includes(term))
            );
        }

        if (selectedCategory !== 'all') {
            results = results.filter(product => product.category === selectedCategory);

            if (selectedSubcategory !== 'all') {
                results = results.filter(product => product.subcategory === selectedSubcategory);
            }
        }

        setFilteredProducts(results);
    }, [searchTerm, selectedCategory, selectedSubcategory, products]);

    // Get unique main categories
    const mainCategories = ['all', ...new Set([
        ...categories.filter(cat => !cat.parent).map(cat => cat.name),
        ...products.map(p => p.category)
    ].filter(Boolean))];

    // Get subcategories based on selected main category
    const getSubcategories = () => {
        if (selectedCategory === 'all') return ['all'];

        return ['all', ...new Set([
            ...categories
                .filter(cat => {
                    const parentCategory = categories.find(c => c.name === selectedCategory);
                    return parentCategory && cat.parent?.toString() === parentCategory.id.toString();
                })
                .map(cat => cat.name),
            ...products
                .filter(p => p.category === selectedCategory && p.subcategory)
                .map(p => p.subcategory as string)
        ].filter(Boolean))];
    };

    // Safe price formatter
    const formatPrice = (price?: number): string => {
        if (price === undefined) return 'N/A';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
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
            setProducts(products.filter(p => p.id !== product.id));
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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <span className="ml-3">Loading products...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="m-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                <p className="font-bold">Error loading products:</p>
                <p>{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="m-4 p-4 bg-white rounded-lg shadow-md">
            <div className="mb-4 space-y-3">
                <div className="relative flex items-center">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        ref={searchInputRef}
                        type="text"
                        className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Search by name, SKU or model (Press F2 to focus)"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                            onClick={() => setSearchTerm('')}
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>

                <div className="flex flex-wrap gap-3">
                    <div className="flex items-center">
                        <label htmlFor="category" className="mr-2 text-sm font-medium text-gray-700">
                            Category:
                        </label>
                        <select
                            id="category"
                            className="block w-40 pl-3 pr-10 py-1 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                            value={selectedCategory}
                            onChange={(e) => {
                                setSelectedCategory(e.target.value);
                                setSelectedSubcategory('all');
                            }}
                        >
                            {mainCategories.map(category => (
                                <option key={category} value={category}>
                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedCategory !== 'all' && (
                        <div className="flex items-center">
                            <label htmlFor="subcategory" className="mr-2 text-sm font-medium text-gray-700">
                                Subcategory:
                            </label>
                            <select
                                id="subcategory"
                                className="block w-40 pl-3 pr-10 py-1 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                value={selectedSubcategory}
                                onChange={(e) => setSelectedSubcategory(e.target.value)}
                            >
                                {getSubcategories().map(subcategory => (
                                    <option key={subcategory} value={subcategory}>
                                        {subcategory.charAt(0).toUpperCase() + subcategory.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            </div>

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
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map(product => (
                            <tr key={product.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {product.images?.length > 0 ? (
                                        <img
                                            src={`https://api.bestbuyelectronics.lk${product.images[0]}`}
                                            alt={product.name}
                                            className="h-10 w-10 rounded-md object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = '/placeholder-product.png';
                                                (e.target as HTMLImageElement).classList.add('bg-gray-100');
                                            }}
                                        />
                                    ) : (
                                        <div className="h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center">
                                            <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {product.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {product.sku}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {product.model_number || '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatPrice(product.price)}
                                    {product.old_price && product.old_price > product.price && (
                                        <span className="ml-2 text-xs text-gray-400 line-through">
                                            {formatPrice(product.old_price)}
                                        </span>
                                    )}
                                </td>
                                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                                    product.quantity <= 0 ? 'text-red-600 font-bold' : 'text-gray-500'
                                }`}>
                                    {product.quantity}
                                    {product.quantity <= 0 && ' (Out of stock)'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {product.category}
                                    {product.subcategory && (
                                        <span className="block text-xs text-gray-400">
                                            {product.subcategory}
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 relative">
                                    <button
                                        onClick={() => toggleActionMenu(product.id)}
                                        className="px-3 py-1 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                    >
                                        Actions
                                    </button>

                                    {activeActionMenu === product.id && (
                                        <div
                                            ref={actionMenuRef}
                                            className="absolute right-11 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200"
                                        >
                                            <div className="py-1">
                                                <button
                                                    onClick={() => handleEdit(product.id)}
                                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product)}
                                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                                No products found matching your criteria
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            <div className="mt-3 text-xs text-gray-500">
                Tip: Press F2 or Ctrl+K to quickly focus the search field
            </div>
        </div>
    );
}
