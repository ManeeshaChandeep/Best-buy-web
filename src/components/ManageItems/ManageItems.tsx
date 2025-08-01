'use client';

import React, { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Select, MenuItem, ListSubheader } from '@mui/material';
import { apiClient } from '@/../src/libs/network';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), {
    ssr: false,
    loading: () => <p className="text-gray-500">Loading editor...</p>,
});

interface Category {
    id: string | number;
    name: string;
    parent?: string | number;
    image?: string;
    subcategories?: Category[];
}

interface Brand {
    id: string;
    name: string;
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
    brand?: string;
    image_url?: string;
    images?: string[];
}

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
    description: string;
    category?: string;
    subcategory?: string;
    brand?: string;
    image_url?: string;
    images?: string[];
}

interface ManageItemsProps {
    productId?: number;
    onProductUpdated?: () => void;
}

const renderCategories = (categories: Category[], level = 0): React.ReactNode[] => {
    const indent = '\u00A0\u00A0\u00A0'.repeat(level);
    return categories.flatMap((category) => {
        if (category.subcategories && category.subcategories.length > 0) {
            return [
                level === 0 ? (
                    <ListSubheader key={`header-${category.id}`}>{category.name}</ListSubheader>
                ) : null,
                ...renderCategories(category.subcategories, level + 1),
            ];
        } else {
            return (
                <MenuItem key={category.id} value={category.id}>
                    {indent + category.name}
                </MenuItem>
            );
        }
    });
};

const GroupedSelect = ({
                           categories,
                           value,
                           onChange,
                       }: {
    categories: Category[];
    value: string;
    onChange: (e: any) => void;
}) => (
    <Select value={value} onChange={onChange} fullWidth displayEmpty>
        <MenuItem value="">
            <em>Select a category</em>
        </MenuItem>
        {renderCategories(categories)}
    </Select>

);

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
        subcategory: '',
        brand: '',
        images: [],
    });

    const [loading, setLoading] = useState<boolean>(true);
    const [allCategories, setAllCategories] = useState<Category[]>([]);
    const [allCategoriesNested, setAllCategoriesNested] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState(false);

    const nestCategories = (flat: Category[]): Category[] => {
        const map: { [key: string]: Category } = {};
        const roots: Category[] = [];
        flat.forEach((cat) => (map[cat.id] = { ...cat, subcategories: [] }));
        flat.forEach((cat) =>
            cat.parent ? map[cat.parent]?.subcategories?.push(map[cat.id]) : roots.push(map[cat.id])
        );
        return roots;
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const data: Category[] = await apiClient.get('categories/');
                setAllCategories(data);
                setAllCategoriesNested(nestCategories(data));
            } catch (err) {
                setError('Failed to load categories');
            } finally {
                setLoading(false);
            }
        };

        const fetchBrands = async () => {
            try {
                const data: Brand[] = await apiClient.get('brands/');
                setBrands(data);
            } catch (err) {
                setError('Failed to load brands');
            }
        };

        fetchCategories();
        fetchBrands();
    }, []);

    useEffect(() => {
        if (!productId) return;
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const product: Product = await apiClient.get(`products/${productId}/`);
                setFormData({
                    id: product.id,
                    name: product.name,
                    sku: product.sku,
                    model_number: product.model_number || '',
                    price: product.price.toString(),
                    old_price: product.old_price?.toString() || '',
                    quantity: product.quantity.toString(),
                    warranty: product.warranty?.toString() || '',
                    delivery_available: product.delivery_available,
                    description: product.description,
                    category: product.category || '',
                    subcategory: product.subcategory || '',
                    brand: product.brand || '',
                    image_url: product.image_url,
                    images: product.images || [],
                });
                setIsEditing(true);
            } catch (err) {
                setError('Failed to load product');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId]);

    const onSelectChange = useCallback((e) =>
        setFormData((prev) => ({ ...prev, brand: e.target.value })), []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = {
                ...formData,
                price: parseFloat(formData.price),
                old_price: formData.old_price ? parseFloat(formData.old_price) : null,
                quantity: parseInt(formData.quantity),
                warranty: formData.warranty ? parseInt(formData.warranty) : null,
                category: formData.subcategory || formData.category,
                brand: formData.brand || null,
            };
            if (isEditing && formData.id) {
                await apiClient.put(`products/${formData.id}/`, payload);
                setSuccess(true);
                onProductUpdated?.();
            } else {
                await apiClient.post('products/', payload);
                setSuccess(true);
                setFormData({
                    ...formData,
                    name: '',
                    sku: '',
                    model_number: '',
                    price: '',
                    old_price: '',
                    quantity: '',
                    warranty: '',
                    description: '',
                    brand: '',
                    images: [],
                });
            }
        } catch (err) {
            setError('Failed to save product');
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<any>) => {
        const { name, value, type } = e.target;
        const checked = type === 'checkbox' ? e.target.checked : undefined;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleDescriptionChange = (value: string) => {
        setFormData((prev) => ({ ...prev, description: value }));
    };

    return (
        <div className="container mx-auto p-4 sm:p-6">
            <h1 className="text-2xl font-bold mb-4">{isEditing ? 'Edit Product' : 'Add Product'}</h1>

            {error && <p className="text-red-500 mb-2">{error}</p>}
            {success && <p className="text-green-500 mb-2">Saved successfully!</p>}

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="name" value={formData.name} onChange={handleChange} className="border px-3 py-2 rounded w-full" placeholder="Product Name" required />
                    <input name="sku" value={formData.sku} onChange={handleChange} className="border px-3 py-2 rounded w-full" placeholder="SKU" required />
                    <input name="model_number" value={formData.model_number} onChange={handleChange} className="border px-3 py-2 rounded w-full" placeholder="Model Number" required />
                    <input name="price" type="number" value={formData.price} onChange={handleChange} className="border px-3 py-2 rounded w-full" placeholder="Price" required />
                    <input name="old_price" type="number" value={formData.old_price} onChange={handleChange} className="border px-3 py-2 rounded w-full" placeholder="Old Price" />
                    <input name="quantity" type="number" value={formData.quantity} onChange={handleChange} className="border px-3 py-2 rounded w-full" placeholder="Quantity" required />
                </div>

                {/* Category Selector */}
                <div>
                    <label className="block text-sm font-medium mb-1">Category*</label>
                    <GroupedSelect
                        categories={allCategoriesNested}
                        value={formData.category}
                        onChange={(e) => {
                            const val = e.target.value;
                            setFormData((prev) => ({
                                ...prev,
                                category: val,
                                subcategory: '',
                            }));
                        }}
                    />
                </div>

                {/* Brand Selector */}
                <div className="w-64"> {/* or w-48, w-40 based  design */}
                    <label className="block text-sm font-medium mb-1">Brand</label>
                    <Select
                        value={formData.brand || ''}
                        onChange={onSelectChange}
                        fullWidth
                        displayEmpty
                    >
                        <MenuItem value="">
                            <em>Select a brand</em>
                        </MenuItem>
                        {brands.map((brand) => (
                            <MenuItem key={brand.id} value={brand.id}>
                                {brand.name}
                            </MenuItem>
                        ))}
                    </Select>

                </div>


                {/* Description */}
                <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <ReactQuill
                        theme="snow"
                        value={formData.description}
                        onChange={handleDescriptionChange}
                        className="bg-white"
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                        disabled={submitting}
                    >
                        {submitting ? 'Saving...' : isEditing ? 'Update Product' : 'Add Product'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ManageItems;
