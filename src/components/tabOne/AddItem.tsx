'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';

// Import react-quill-new with dynamic loading
const ReactQuill = dynamic(() => import('react-quill-new'), {
    ssr: false,
    loading: () => <p className="text-gray-500">Loading editor...</p>,
});
import 'react-quill-new/dist/quill.snow.css';

interface Category {
    _id: string;
    name: string;
}

interface SubCategory {
    _id: string;
    name: string;
    categoryId: string;
}

const AddProduct: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [filteredSubcategories, setFilteredSubcategories] = useState<SubCategory[]>([]);
    const [description, setDescription] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        modelNumber: '',
        price: '',
        oldPrice: '',
        quantity: '',
        warranty: '',
        deliveryAvailable: false,
        categoryId: '',
        subcategoryId: '',
        images: [] as File[],
    });

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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesRes, subcategoriesRes] = await Promise.all([
                    axios.get('/api/categories'),
                    axios.get('/api/subcategories')
                ]);
                setCategories(categoriesRes.data);
                setSubcategories(subcategoriesRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        setFilteredSubcategories(
            subcategories.filter((sub) => sub.categoryId === selectedCategory)
        );
        // Reset subcategory when category changes
        setFormData(prev => ({ ...prev, subcategoryId: '' }));
    }, [selectedCategory, subcategories]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: checked,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files).slice(0, 4);
            setFormData((prev) => ({
                ...prev,
                images: filesArray,
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const productData = new FormData();
        productData.append('name', formData.name);
        productData.append('sku', formData.sku);
        productData.append('modelNumber', formData.modelNumber);
        productData.append('price', formData.price);
        productData.append('oldPrice', formData.oldPrice);
        productData.append('quantity', formData.quantity);
        productData.append('description', description);
        productData.append('warranty', formData.warranty);
        productData.append('deliveryAvailable', String(formData.deliveryAvailable));
        productData.append('categoryId', formData.categoryId);
        productData.append('subcategoryId', formData.subcategoryId);

        formData.images.forEach((image) => {
            productData.append('images', image);
        });

        try {
            await axios.post('/api/products', productData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Product added successfully');

            // Reset form
            setFormData({
                name: '',
                sku: '',
                modelNumber: '',
                price: '',
                oldPrice: '',
                quantity: '',
                warranty: '',
                deliveryAvailable: false,
                categoryId: '',
                subcategoryId: '',
                images: [],
            });
            setDescription('');
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Error adding product. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className=" m-4 p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Product</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Product Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name*</label>
                        <input
                            type="text"
                            name="name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* SKU */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">SKU*</label>
                        <input
                            type="text"
                            name="sku"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.sku}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Model Number */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Model Number</label>
                        <input
                            type="text"
                            name="modelNumber"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.modelNumber}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price*</label>
                        <input
                            type="number"
                            name="price"
                            min="0"
                            step="0.01"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.price}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Old Price */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Old Price</label>
                        <input
                            type="number"
                            name="oldPrice"
                            min="0"
                            step="0.01"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.oldPrice}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Quantity */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity*</label>
                        <input
                            type="number"
                            name="quantity"
                            min="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.quantity}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Warranty */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Warranty</label>
                        <input
                            type="text"
                            name="warranty"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.warranty}
                            onChange={handleChange}
                            placeholder="e.g., 1 year manufacturer warranty"
                        />
                    </div>

                    {/* Delivery Available */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="deliveryAvailable"
                            id="deliveryAvailable"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            checked={formData.deliveryAvailable}
                            onChange={handleCheckboxChange}
                        />
                        <label htmlFor="deliveryAvailable" className="ml-2 block text-sm text-gray-700">
                            Delivery Available
                        </label>
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
                    <ReactQuill
                        theme="snow"
                        value={description}
                        onChange={setDescription}
                        modules={modules}
                        className="bg-white rounded-md border border-gray-300 focus:border-blue-500"
                        placeholder="Enter product description..."
                    />
                </div>

                {/* Category and Subcategory */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
                        <select
                            name="categoryId"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.categoryId}
                            onChange={(e) => {
                                handleChange(e);
                                setSelectedCategory(e.target.value);
                            }}
                            required
                        >
                            <option value="">Select a category</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat._id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory*</label>
                        <select
                            name="subcategoryId"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.subcategoryId}
                            onChange={handleChange}
                            required
                            disabled={!formData.categoryId}
                        >
                            <option value="">Select a subcategory</option>
                            {filteredSubcategories.map((sub) => (
                                <option key={sub._id} value={sub._id}>
                                    {sub.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Product Images */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Images* (Max 4)</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        multiple
                        className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
                        required
                    />
                    {formData.images.length > 0 && (
                        <div className="mt-2 text-sm text-gray-500">
                            Selected {formData.images.length} file(s)
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-6 py-2 rounded-md text-white font-medium ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                    >
                        {isSubmitting ? 'Adding...' : 'Add Product'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;
