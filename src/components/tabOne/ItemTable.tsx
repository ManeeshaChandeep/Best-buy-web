import { useState, useEffect, useRef } from 'react';

interface Product {
    id: number;
    name: string;
    sku: string;
    price: number;
    category: string;
}

export default function ItemTable() {
    // Sample product data
    const initialProducts: Product[] = [
        { id: 1, name: 'Premium Coffee 500g', sku: 'COF500', price: 12.99, category: 'Beverages' },
        { id: 2, name: 'Organic Tea Bags 100ct', sku: 'TEA100', price: 8.49,  category: 'Beverages' },
        { id: 3, name: 'Stainless Steel Water Bottle', sku: 'BTL001', price: 19.99,  category: 'Accessories' },
        { id: 4, name: 'Wireless Earbuds', sku: 'BUD001', price: 59.99, category: 'Electronics' },
        { id: 5, name: 'Energy Bar 6-Pack', sku: 'BAR006', price: 6.99, category: 'Snacks' },
    ];

    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [activeActionMenu, setActiveActionMenu] = useState<number | null>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const actionMenuRef = useRef<HTMLDivElement>(null);

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

    // Filter products based on search term and category
    useEffect(() => {
        let results = products;

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            results = results.filter(product =>
                product.name.toLowerCase().includes(term) || product.sku.toLowerCase().includes(term))

        }

        if (selectedCategory !== 'all') {
            results = results.filter(product => product.category === selectedCategory);
        }

        setFilteredProducts(results);
    }, [searchTerm, selectedCategory, products]);

    const categories = ['all', ...new Set(products.map(p => p.category))];

    const handleEdit = (product: Product) => {
        console.log('Edit product:', product);
        alert(`Editing: ${product.name}`);
        setActiveActionMenu(null);
    };

    const handleDelete = (product: Product) => {
        console.log('Delete product:', product);
        if (confirm(`Are you sure you want to delete ${product.name}?`)) {
            setProducts(products.filter(p => p.id !== product.id));
        }
        setActiveActionMenu(null);
    };

    const toggleActionMenu = (id: number) => {
        setActiveActionMenu(activeActionMenu === id ? null : id);
    };

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
                        placeholder="Search by name or SKU (Press F2 to focus)"
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

                <div className="flex items-center">
                    <label htmlFor="category" className="mr-2 text-sm font-medium text-gray-700">
                        Category:
                    </label>
                    <select
                        id="category"
                        className="block w-40 pl-3 pr-10 py-1 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        {categories.map(category => (
                            <option key={category} value={category}>
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            SKU
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                        </th>
                        {/*<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">*/}
                        {/*    Stock*/}
                        {/*</th>*/}
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Category
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Action
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map(product => (
                            <tr key={product.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {product.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {product.sku}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    ${product.price.toFixed(2)}
                                </td>
                                {/*<td className={`px-6 py-4 whitespace-nowrap text-sm ${product.stock < 10 ? 'font-bold text-red-600' : 'text-gray-500'}`}>*/}
                                {/*    {product.stock} {product.stock < 10 && '(Low)'}*/}
                                {/*</td>*/}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {product.category}
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
                                                    onClick={() => handleEdit(product)}
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
                            <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                                No products found
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
