'use client';

import React, { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Select, MenuItem, ListSubheader } from '@mui/material';
import { apiClient } from '@/../src/libs/network';
import 'react-quill-new/dist/quill.snow.css';
const BE_URL = "https://api.bestbuyelectronics.lk";

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

interface UploadResponse {
    filename: string;
    status?: string;
}

interface Brand {
    id: string;
    name: string;
}

interface ImagePreview {
    id: string;
    url: string;
    file: File | null;
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
    category?: Category;
    subcategory?: Category;
    brand?: Brand;
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
        const isLeaf = category.subcategories.length === 0;

        const current = isLeaf
            ? (
                <MenuItem key={category.id} value={category.id}>
                    {indent + category.name}
                </MenuItem>
            )
            : (
                <ListSubheader key={`header-${category.id}`}>
                    {indent + category.name}
                </ListSubheader>
            );

        const children = renderCategories(category.subcategories, level + 1);

        return [current, ...children];
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
    const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);

    // Initialize with 5 empty image slots (first one is main)
    useEffect(() => {
        if (imagePreviews.length === 0) {
            const initialImages = Array(5).fill(null).map((_, index) => ({
                id: `img-${Date.now()}-${index}`,
                url: '',
                file: null
            }));
            setImagePreviews(initialImages);
        }
    }, []);

    const fetchBrands = async () => {
        if (!formData.category) {
            setBrands([]);
            return;
        }

        try {
            const data: Brand[] = await apiClient.get(`categories/${formData.category}/brands/`);
            setBrands(data);
        } catch (err) {
            setError('Failed to load brands');
        }
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const data: Category[] = await apiClient.get('categories/v2/');
                setAllCategories(data);
                setAllCategoriesNested(data);
            } catch (err) {
                setError('Failed to load categories');
            } finally {
                setLoading(false);
            }
        };
        fetchBrands()
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchBrands();
    }, [formData.category]);

    useEffect(() => {
        if (!productId) return;
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const product: Product = await apiClient.get(`products/${productId}/`);

                // Process existing images to extract filenames and set up image previews
                const existingImages = product.images || [];
                const processedImagePreviews = Array(5).fill(null).map((_, index) => {
                    if (index < existingImages.length) {
                        const imageUrl = existingImages[index];
                        // Extract filename from full path (remove /media/products/ prefix)
                        const filename = imageUrl.replace('/media/products/', '');
                        return {
                            id: filename,
                            url: `${BE_URL}${imageUrl}`,
                            file: null
                        };
                    } else {
                        return {
                            id: `img-${Date.now()}-${index}`,
                            url: '',
                            file: null
                        };
                    }
                });

                setImagePreviews(processedImagePreviews);

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
                    category: product.subcategory?.id?.toString() || '',
                    subcategory: product.subcategory?.id?.toString() || '',
                    brand: product.brand?.id?.toString() || '',
                    image_url: product.image_url,
                    // Store only filenames (without /media/products/ prefix)
                    images: existingImages.map(img => img.replace('/media/products/', '')),
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
                // Refresh the item table after update
                onProductUpdated?.();
                // Reset form after successful update
                setTimeout(() => {
                    resetForm();
                }, 2000);
            } else {
                await apiClient.post('products/', payload);
                setSuccess(true);
                // Refresh the item table after creation
                onProductUpdated?.();
                resetForm();
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
            subcategory: '',
            brand: '',
            images: []
        });
        setImagePreviews(Array(5).fill(null).map((_, index) => ({
            id: `img-${Date.now()}-${index}`,
            url: '',
            file: null
        })));
        setIsEditing(false);
        setError(null);
        setSuccess(false);
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            const timestamp = Date.now();
            let imageName = "";

            const formPayload = new FormData();
            formPayload.append("file", file);
            formPayload.append("image_name", `image_${timestamp}`);
            formPayload.append("type", "products");

            try {
                console.log(file)

                await apiClient.post("upload/", formPayload).then((res: UploadResponse) => {
                    if (res?.filename) {
                        imageName = res?.filename;
                        // Store only the filename, not the full path
                        setFormData(prev => ({
                            ...prev,
                            images: [...(prev?.images || []), res.filename]
                        }));
                    }
                })
            } catch (e) {
                setError("Error Uploading Image, Try again")
                return
            }

            reader.onloadend = () => {
                const newImagePreviews = [...imagePreviews];
                newImagePreviews[index] = {
                    ...newImagePreviews[index],
                    url: `${BE_URL}/media/products/${imageName}`,
                    file: file,
                    id: imageName
                };
                setImagePreviews(newImagePreviews);
            };

            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = (index: number) => {
        const newImagePreviews = [...imagePreviews];
        const previousId = imagePreviews[index]?.id;

        newImagePreviews[index] = {
            id: `img-${Date.now()}-${index}`,
            url: '',
            file: null
        };
        setImagePreviews(newImagePreviews);

        // Remove the filename from the images array
        if (previousId && previousId !== `img-${Date.now()}-${index}`) {
            setFormData(prev => ({
                ...prev,
                images: prev.images.filter(imgName => imgName !== previousId)
            }));
        }
    };

    const renderImageUploads = () => (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Product Images</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {imagePreviews.map((image, index) => (
                    <div key={image.id} className={`relative border-2 rounded-lg p-2 ${index === 0 ? 'border-blue-500' : 'border-gray-300'}`}>
                        {image.url ? (
                            <>
                                <img
                                    src={`${image.url}`}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-32 object-contain mb-2"
                                />
                                {index === 0 && (
                                    <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                                        Main
                                    </div>
                                )}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index)}
                                    className="w-full text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded transition-colors"
                                >
                                    Remove
                                </button>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-32 bg-gray-100 rounded">
                                <span className="text-gray-500 text-sm mb-2 text-center">
                                    {index === 0 ? 'Main Image*' : `Image ${index + 1}`}
                                </span>
                                <label className="cursor-pointer bg-white border border-blue-500 text-blue-500 hover:bg-blue-50 px-3 py-1 rounded text-xs transition-colors">
                                    Upload
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleImageChange(e, index)}
                                        disabled={submitting}
                                        required={index === 0 && !image.url}
                                    />
                                </label>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <p className="text-sm text-gray-500">
                First image will be used as the main product image. Main image is required.
            </p>
        </div>
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-gray-600">Loading...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                    Product saved successfully!
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter product name"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
                            <input
                                name="sku"
                                value={formData.sku}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter SKU"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Model Number *</label>
                            <input
                                name="model_number"
                                value={formData.model_number}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter model number"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                            <input
                                name="price"
                                type="number"
                                step="0.01"
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="0.00"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Old Price</label>
                            <input
                                name="old_price"
                                type="number"
                                step="0.01"
                                value={formData.old_price}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                            <input
                                name="quantity"
                                type="number"
                                value={formData.quantity}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="0"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Warranty (months)</label>
                            <input
                                name="warranty"
                                type="number"
                                value={formData.warranty}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="delivery_available"
                            checked={formData.delivery_available}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700">
                            Delivery Available
                        </label>
                    </div>
                </div>

                {/* Category & Brand Selection */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Category & Brand</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                            <GroupedSelect
                                categories={allCategoriesNested}
                                value={formData.category}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setFormData((prev) => ({
                                        ...prev,
                                        category: val,
                                        subcategory: val,
                                    }));
                                    fetchBrands()
                                }}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
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
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Description</h3>
                    <ReactQuill
                        theme="snow"
                        value={formData.description}
                        onChange={handleDescriptionChange}
                        className="bg-white"
                    />
                </div>

                {/* Images */}
                {renderImageUploads()}

                {/* Submit Button */}
                <div className="flex justify-end pt-4 border-t">
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
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
