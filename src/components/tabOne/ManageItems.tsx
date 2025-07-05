'use client'
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Select from 'react-select';
import { apiClient } from '@/../src/libs/network';

const ReactQuill = dynamic(() => import('react-quill-new'), {
    ssr: false,
    loading: () => <p className="text-gray-500">Loading editor...</p>,
});
import 'react-quill-new/dist/quill.snow.css';

interface Category {
    id: string | number;
    name: string;
    parent?: string | number;
    image?: string;
}

interface Product {
    id: number;
    name: string;
    sku: string;
    model_number?: string;
    price: number | string;
    old_price?: number | string;
    quantity: number | string;
    warranty?: number | string;
    delivery_available: boolean;
    description: string;
    category: string;
    subcategory?: string;
    image_url?: string;
}

interface FormData {
    id?: number;
    name: string;
    sku: string;
    model_number: string;
    price: string;
    old_price: string;
    quantity: string;
    warranty: string;
    delivery_available: boolean;
    description: string;
    category: string;
    subcategory: string;
    image_url?: string;
}

interface ManageItemsProps {
    productId?: number;
    onProductUpdated?: () => void;
}

interface SelectOption {
    value: string;
    label: string;
}

const ManageItems = ({ productId, onProductUpdated }: ManageItemsProps) => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        sku: '',
        model_number: '',
        price: '',
        old_price: '',
        quantity: '',
        warranty: '',
        delivery_available: false,
        description: '',
        category: '',
        subcategory: ''
    });

    const [loading, setLoading] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [allCategories, setAllCategories] = useState<Category[]>([]);
    const [mainCategories, setMainCategories] = useState<SelectOption[]>([]);
    const [availableSubcategories, setAvailableSubcategories] = useState<SelectOption[]>([]);
    const [isEditing, setIsEditing] = useState<boolean>(false);

    // ReactQuill modules configuration
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image'],
            ['clean'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'align': [] }],
        ],
    };

    // Organize categories into main and subcategories
    const organizeCategories = (categories: Category[]) => {
        const mains = categories.filter(cat => !cat.parent);
        const subs = categories.filter(cat => cat.parent !== undefined);

        const mainOptions = mains.map(cat => ({
            value: cat.id.toString(),
            label: cat.name
        }));

        const subOptions = subs.map(cat => ({
            value: cat.id.toString(),
            label: cat.name
        }));

        return { mainOptions, subOptions };
    };

    // Fetch all categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const data = await apiClient.get<Category[]>('categories/');
                setAllCategories(data);
                const { mainOptions, subOptions } = organizeCategories(data);
                setMainCategories(mainOptions);
                setAvailableSubcategories(subOptions);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load categories');
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // Fetch product data when productId changes
    useEffect(() => {
        if (!productId) {
            resetForm();
            return;
        }

        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError(null);
                const product = await apiClient.get<Product>(`products/${productId}/`);

                setFormData({
                    id: product.id,
                    name: product.name,
                    sku: product.sku,
                    model_number: product.model_number || '',
                    price: product.price.toString(),
                    old_price: product.old_price ? product.old_price.toString() : '',
                    quantity: product.quantity.toString(),
                    warranty: product.warranty ? product.warranty.toString() : '',
                    delivery_available: product.delivery_available || false,
                    description: product.description || '',
                    category: product.category || '',
                    subcategory: product.subcategory || '',
                    image_url: product.image_url
                });

                setIsEditing(true);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load product');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    // Filter subcategories when main category is selected
    useEffect(() => {
        if (formData.category) {
            const filteredSubs = allCategories
                .filter(sub => sub.parent?.toString() === formData.category.toString())
                .map(cat => ({
                    value: cat.id.toString(),
                    label: cat.name
                }));

            setAvailableSubcategories(filteredSubs);

            // Reset subcategory if the selected one is no longer valid
            if (formData.subcategory && !filteredSubs.some(sub => sub.value === formData.subcategory.toString())) {
                setFormData(prev => ({ ...prev, subcategory: '' }));
            }
        }
    }, [formData.category, allCategories]);

    const resetForm = () => {
        setFormData({
            name: '',
            sku: '',
            model_number: '',
            price: '',
            old_price: '',
            quantity: '',
            warranty: '',
            delivery_available: false,
            description: '',
            category: '',
            subcategory: ''
        });
        setIsEditing(false);
        setError(null);
        setSuccess(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleCategoryChange = (selectedOption: SelectOption | null) => {
        if (selectedOption) {
            setFormData(prev => ({
                ...prev,
                category: selectedOption.value,
                subcategory: '' // Reset subcategory when main category changes
            }));
        }
    };

    const handleSubcategoryChange = (selectedOption: SelectOption | null) => {
        if (selectedOption) {
            setFormData(prev => ({
                ...prev,
                subcategory: selectedOption.value
            }));
        }
    };

    const handleDescriptionChange = (value: string) => {
        setFormData(prev => ({
            ...prev,
            description: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccess(false);

        try {
            // Prepare the data for API
            const itemData = {
                ...formData,
                price: parseFloat(formData.price),
                old_price: formData.old_price ? parseFloat(formData.old_price) : null,
                quantity: parseInt(formData.quantity),
                warranty: formData.warranty ? parseInt(formData.warranty) : null,
                category: formData.subcategory || formData.category
            };

            if (isEditing && formData.id) {
                await apiClient.put(`products/${formData.id}/`, itemData);
                setSuccess(true);
                if (onProductUpdated) onProductUpdated();
            } else {
                await apiClient.post('products/', itemData);
                setSuccess(true);
                resetForm();
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : isEditing ? 'Failed to update item' : 'Failed to add item');
        } finally {
            setSubmitting(false);
        }
    };

    const getCurrentCategory = () => {
        return mainCategories.find(cat => cat.value === formData.category.toString()) || null;
    };

    const getCurrentSubcategory = () => {
        return availableSubcategories.find(sub => sub.value === formData.subcategory.toString()) || null;
    };

    if (loading && allCategories.length === 0) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">
                {isEditing ? 'Edit Product' : 'Add New Product'}
                {isEditing && formData.id && <span className="text-gray-500 ml-2">(ID: {formData.id})</span>}
            </h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    {isEditing ? 'Product updated successfully!' : 'Product added successfully!'}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div>
                        {/* Name */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="name">
                                Product Name*
                            </label>
                            <input
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                id="name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                disabled={submitting}
                            />
                        </div>

                        {/* SKU */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="sku">
                                SKU*
                            </label>
                            <input
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                id="sku"
                                type="text"
                                name="sku"
                                value={formData.sku}
                                onChange={handleChange}
                                required
                                disabled={submitting}
                            />
                        </div>

                        {/* Model Number */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="model_number">
                                Model Number*
                            </label>
                            <input
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                id="model_number"
                                type="text"
                                name="model_number"
                                value={formData.model_number}
                                onChange={handleChange}
                                required
                                disabled={submitting}
                            />
                        </div>

                        {/* Price */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="price">
                                Price (LKR)*
                            </label>
                            <input
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                id="price"
                                type="number"
                                name="price"
                                min="0"
                                step="0.01"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                disabled={submitting}
                            />
                        </div>

                        {/* Old Price */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="old_price">
                                Old Price (LKR)
                            </label>
                            <input
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                id="old_price"
                                type="number"
                                name="old_price"
                                min="0"
                                step="0.01"
                                value={formData.old_price}
                                onChange={handleChange}
                                disabled={submitting}
                            />
                        </div>
                    </div>

                    {/* Right Column */}
                    <div>
                        {/* Quantity */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="quantity">
                                Quantity*
                            </label>
                            <input
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                id="quantity"
                                type="number"
                                name="quantity"
                                min="0"
                                value={formData.quantity}
                                onChange={handleChange}
                                required
                                disabled={submitting}
                            />
                        </div>

                        {/* Warranty */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="warranty">
                                Warranty (months)
                            </label>
                            <input
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                id="warranty"
                                type="number"
                                name="warranty"
                                min="0"
                                value={formData.warranty}
                                onChange={handleChange}
                                disabled={submitting}
                            />
                        </div>

                        {/* Delivery Available */}
                        <div className="mb-4">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="delivery_available"
                                    checked={formData.delivery_available}
                                    onChange={handleChange}
                                    className="form-checkbox h-5 w-5 text-blue-600"
                                    disabled={submitting}
                                />
                                <span className="ml-2 text-gray-700 font-bold">Delivery Available</span>
                            </label>
                        </div>

                        {/* Category Dropdown */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">
                                Category*
                            </label>
                            <Select
                                options={mainCategories}
                                value={getCurrentCategory()}
                                onChange={handleCategoryChange}
                                isDisabled={submitting || loading}
                                placeholder="Select a category"
                                className="react-select-container"
                                classNamePrefix="react-select"
                                required
                            />
                        </div>

                        {/* Subcategory Dropdown */}
                        {formData.category && availableSubcategories.length > 0 && (
                            <div className="mb-4">
                                <label className="block text-gray-700 font-bold mb-2">
                                    Subcategory
                                </label>
                                <Select
                                    options={availableSubcategories}
                                    value={getCurrentSubcategory()}
                                    onChange={handleSubcategoryChange}
                                    isDisabled={submitting || loading}
                                    placeholder="Select a subcategory"
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Description - Full width */}
                <div className="mt-6 mb-6">
                    <label className="block text-gray-700 font-bold mb-2">
                        Description*
                    </label>
                    <ReactQuill
                        theme="snow"
                        value={formData.description}
                        onChange={handleDescriptionChange}
                        modules={modules}
                        className="bg-white rounded"
                        style={{ height: '200px', marginBottom: '50px' }}
                        readOnly={submitting}
                    />
                </div>

                {/* Submit Button */}
                <div className="flex justify-between mt-6">
                    {isEditing && (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 ml-auto"
                        disabled={submitting || loading}
                    >
                        {submitting ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {isEditing ? 'Updating...' : 'Adding...'}
                            </span>
                        ) : isEditing ? 'Update Product' : 'Add Product'}
                    </button>
                </div>
            </form>

            <style jsx global>{`
                .react-select-container .react-select__control {
                    border: 1px solid #d1d5db;
                    min-height: 42px;
                    box-shadow: none;
                }
                .react-select-container .react-select__control:hover {
                    border-color: #d1d5db;
                }
                .react-select-container .react-select__control--is-focused {
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
                }
                .react-select-container .react-select__menu {
                    z-index: 10;
                }
                .react-select-container .react-select__option--is-focused {
                    background-color: #e5e7eb;
                }
                .react-select-container .react-select__option--is-selected {
                    background-color: #3b82f6;
                }
            `}</style>
        </div>
    );
};

export default ManageItems;
