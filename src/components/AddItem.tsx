'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

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

    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        modelNumber: '',
        price: '',
        oldPrice: '',
        quantity: '',
        description: '',
        warranty: '',
        deliveryAvailable: false,
        categoryId: '',
        subcategoryId: '',
        images: [] as File[],
    });

    useEffect(() => {
        const fetchCategories = async () => {
            const res = await axios.get('/api/categories');
            setCategories(res.data);
        };

        const fetchSubcategories = async () => {
            const res = await axios.get('/api/subcategories');
            setSubcategories(res.data);
        };

        fetchCategories();
        fetchSubcategories();
    }, []);

    useEffect(() => {
        setFilteredSubcategories(
            subcategories.filter((sub) => sub.categoryId === selectedCategory)
        );
    }, [selectedCategory, subcategories]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
            const filesArray = Array.from(e.target.files).slice(0, 4); // Limit to 4 files
            setFormData((prev) => ({
                ...prev,
                images: filesArray,
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const productData = new FormData();

        // Append all text fields
        productData.append('name', formData.name);
        productData.append('sku', formData.sku);
        productData.append('modelNumber', formData.modelNumber);
        productData.append('price', formData.price);
        productData.append('oldPrice', formData.oldPrice);
        productData.append('quantity', formData.quantity);
        productData.append('description', formData.description);
        productData.append('warranty', formData.warranty);
        productData.append('deliveryAvailable', String(formData.deliveryAvailable));
        productData.append('categoryId', formData.categoryId);
        productData.append('subcategoryId', formData.subcategoryId);

        // Append all images
        formData.images.forEach((image, index) => {
            productData.append(`images`, image);
        });

        try {
            await axios.post('/api/products', productData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Product added successfully');
            // Reset form after successful submission
            setFormData({
                name: '',
                sku: '',
                modelNumber: '',
                price: '',
                oldPrice: '',
                quantity: '',
                description: '',
                warranty: '',
                deliveryAvailable: false,
                categoryId: '',
                subcategoryId: '',
                images: [],
            });
        } catch (error) {
            console.error(error);
            alert('Error adding product');
        }
    };

    return (
        <div className="max-w-3xl ml-3 p-6 mt-10">
            <h2 className="text-2xl font-semibold mb-6">Add Product</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 font-medium">Product Name*</label>
                        <input
                            type="text"
                            name="name"
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">SKU*</label>
                        <input
                            type="text"
                            name="sku"
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            value={formData.sku}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Model Number</label>
                        <input
                            type="text"
                            name="modelNumber"
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            value={formData.modelNumber}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Price*</label>
                        <input
                            type="number"
                            name="price"
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            value={formData.price}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Old Price</label>
                        <input
                            type="number"
                            name="oldPrice"
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            value={formData.oldPrice}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Quantity*</label>
                        <input
                            type="number"
                            name="quantity"
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            value={formData.quantity}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Warranty</label>
                        <input
                            type="text"
                            name="warranty"
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            value={formData.warranty}
                            onChange={handleChange}
                            placeholder="e.g., 1 year manufacturer warranty"
                        />
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="deliveryAvailable"
                            id="deliveryAvailable"
                            className="mr-2"
                            checked={formData.deliveryAvailable}
                            onChange={handleCheckboxChange}
                        />
                        <label htmlFor="deliveryAvailable" className="font-medium">
                            Delivery Available
                        </label>
                    </div>
                </div>

                <div>
                    <label className="block mb-1 font-medium">Description*</label>
                    <textarea
                        name="description"
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 font-medium">Category*</label>
                        <select
                            name="categoryId"
                            className="w-full border border-gray-300 rounded px-3 py-2"
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
                        <label className="block mb-1 font-medium">Subcategory*</label>
                        <select
                            name="subcategoryId"
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            value={formData.subcategoryId}
                            onChange={handleChange}
                            required
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

                <div>
                    <label className="block mb-1 font-medium">Product Images* (Max 4)</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        multiple
                        required
                    />
                    {formData.images.length > 0 && (
                        <div className="mt-2">
                            <p className="text-sm text-gray-600">
                                Selected {formData.images.length} file(s)
                            </p>
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
                >
                    Add Product
                </button>
            </form>
        </div>
    );
};

export default AddProduct;
