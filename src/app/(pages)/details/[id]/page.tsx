'use client'

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { ShieldCheckIcon } from '@heroicons/react/24/solid';
import { useParams } from 'next/navigation';
import {
    FaFacebookF,
    FaInstagram,
    FaTwitter,
    FaWhatsapp,
    FaShippingFast,
    FaStore,
    FaHeart,
    FaBarcode,
    FaHashtag,
    FaShieldAlt,
} from "react-icons/fa";
import { apiClient } from "@/libs/network";

const BE_URL = "https://api.bestbuyelectronics.lk";

interface Product {
    id: number;
    name: string;
    sku: string;
    model_number?: string;
    price: string;
    old_price?: string;
    quantity: number;
    warranty?: string;
    delivery_available: boolean;
    category: string;
    subcategory?: string;
    image_url?: string;
    description?: string;
    images?: string[];
}

const loadProductById = (id: number | string) => {
    return apiClient.get<Product>(`products/${id}/`);
};

const ItemView: React.FC = () => {
    const { id } = useParams();
    const [selectedImage, setSelectedImage] = useState<string>('');
    const [details, setDetails] = useState<Product>({
        id: 0,
        name: '',
        sku: '',
        model_number: '',
        price: '0.00',
        old_price: '0.00',
        quantity: 0,
        warranty: '0',
        delivery_available: false,
        category: '',
        subcategory: '',
        image_url: '',
        description: '',
        images: [],
    });

    useEffect(() => {
        if (!id) return;
        const productID = Number(id);
        if (isNaN(productID)) return;

        loadProductById(productID)
            .then(res => {
                setDetails(res);
            })
            .catch(err => {
                console.error('Error loading product:', err);
            });
    }, [id]);

    useEffect(() => {
        if (details.images && details.images.length > 0) {
            setSelectedImage(details.images[0]);
        }
    }, [details.images]);

    return (
        <div>
            <div className="max-w-6xl mx-auto p-6 rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Left Column: Image Viewer + Product Description */}
                    <div>
                        {/* Main Image */}
                        <div className="relative w-full h-[300px] rounded-xl overflow-hidden">
                            {selectedImage && (
                                <Image
                                    src={`${BE_URL}${selectedImage}`}
                                    alt="Main Product Image"
                                    fill
                                    className="object-contain p-4"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    unoptimized
                                />
                            )}
                        </div>

                        {/* Thumbnails */}
                        <div className="flex gap-4 mt-4">
                            {details.images?.map((img, idx) => (
                                <div
                                    key={idx}
                                    className={`relative w-24 h-24 border-2 rounded-md cursor-pointer ${
                                        selectedImage === img ? 'border-blue-600' : 'border-transparent'
                                    }`}
                                    onClick={() => setSelectedImage(img)}
                                >
                                    <Image
                                        src={`${BE_URL}${img}`}
                                        alt={`Thumbnail ${idx + 1}`}
                                        fill
                                        className="object-cover rounded-md"
                                        sizes="100px"
                                        unoptimized
                                    />
                                </div>
                            ))}
                        </div>


                    </div>

                    {/* Right Column: Product Info + Sidebar */}
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Product Info */}
                        <div className="space-y-3 flex-1">
                            <h1 className="text-xl font-medium text-gray-800 opacity-80">
                                {details.name}
                            </h1>


                            {/* Price Section */}
                            <div className="space-x-4">
                                <span className="text-2xl font-semibold text-red-600">
                                    Rs. {Number(details.price).toLocaleString()}
                                </span>
                                {details.old_price && (
                                    <span className="text-xl line-through text-gray-400">
                                        Rs. {Number(details.old_price).toLocaleString()}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="hidden md:flex flex-col max-w-xs ml-auto space-y-6">
                            <div className="space-y-4 text-left">
                                {/* Model Number */}
                                <div className="flex items-center space-x-3 mb-5">
                                    <FaBarcode className="text-gray-600" size={20} />
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Model Number</p>
                                        <p className="text-sm font-medium text-gray-800">{details.model_number || 'N/A'}</p>
                                    </div>
                                </div>

                                {/* SKU */}
                                <div className="flex items-center space-x-3 mb-5">
                                    <FaHashtag className="text-gray-600" size={20} />
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">SKU</p>
                                        <p className="text-sm font-medium text-gray-800">{details.sku || 'N/A'}</p>
                                    </div>
                                </div>

                                {/* Warranty */}
                                <div className="flex items-center space-x-3 mb-5">
                                    <FaShieldAlt className="text-gray-600" size={20} />
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Warranty</p>
                                        <p className="text-sm font-medium text-gray-800">{details.warranty ? `${details.warranty} Month(s)` : 'N/A'}</p>
                                    </div>
                                </div>

                                {/* Delivery Info */}
                                <div className="flex items-center space-x-3 pt-2 border-t border-gray-200 mb-5">
                                    <FaShippingFast className="text-gray-600" size={20} />
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Standard Delivery</p>
                                        <p className="text-sm text-gray-700">3 - 5 Working Days Available</p>
                                    </div>
                                </div>

                                {/* Pickup In-Store */}
                                <div className="flex items-center space-x-3 mb-5">
                                    <FaStore className="text-gray-600" size={20} />
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Pickup In-Store</p>
                                        <p className="text-sm text-gray-700">Today Available</p>
                                    </div>
                                </div>

                                {/* Wishlist Button */}
                                <button className="w-full flex items-center justify-center gap-2 py-2 rounded-md border border-gray-300 text-gray-700 text-sm hover:bg-gray-100 transition">
                                    <FaHeart className="text-gray-600" size={18} />
                                    Add to Wishlist
                                </button>

                                {/* Social Links */}
                                <div className="flex justify-center space-x-6 pt-3 border-t border-gray-200">
                                    <a href="#" aria-label="Facebook" className="text-gray-600 hover:text-blue-600 transition">
                                        <FaFacebookF size={18} />
                                    </a>
                                    <a href="#" aria-label="Instagram" className="text-gray-600 hover:text-pink-600 transition">
                                        <FaInstagram size={18} />
                                    </a>
                                    <a href="#" aria-label="Twitter" className="text-gray-600 hover:text-blue-400 transition">
                                        <FaTwitter size={18} />
                                    </a>
                                    <a href="#" aria-label="WhatsApp" className="text-gray-600 hover:text-green-600 transition">
                                        <FaWhatsapp size={18} />
                                    </a>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Mobile Only - Additional Info */}
                <div className="flex md:hidden flex-col space-y-6 mt-8">
                    <div className="space-y-4">
                        <div className="flex md:hidden flex-col space-y-6 mt-8">
                            <div className="space-y-4">
                                {/* Model Number */}
                                <div className="flex items-center space-x-3 mb-5">
                                    <FaBarcode className="text-gray-600" size={20} />
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Model Number</p>
                                        <p className="text-sm font-medium text-gray-800">{details.model_number || 'N/A'}</p>
                                    </div>
                                </div>

                                {/* SKU */}
                                <div className="flex items-center space-x-3 mb-5">
                                    <FaHashtag className="text-gray-600" size={20} />
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">SKU</p>
                                        <p className="text-sm font-medium text-gray-800">{details.sku || 'N/A'}</p>
                                    </div>
                                </div>

                                {/* Warranty */}
                                <div className="flex items-center space-x-3 mb-5">
                                    <FaShieldAlt className="text-gray-600" size={20} />
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Warranty</p>
                                        <p className="text-sm font-medium text-gray-800">
                                            {details.warranty ? `${details.warranty} Month(s)` : 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                {/* Delivery Info */}
                                <div className="flex items-center space-x-3 pt-2 border-t border-gray-200 mb-5">
                                    <FaShippingFast className="text-gray-600" size={20} />
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Standard Delivery</p>
                                        <p className="text-sm text-gray-700">3 - 5 Working Days Available</p>
                                    </div>
                                </div>

                                {/* Pickup In-Store */}
                                <div className="flex items-center space-x-3 mb-5">
                                    <FaStore className="text-gray-600" size={20} />
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Pickup In-Store</p>
                                        <p className="text-sm text-gray-700">Today Available</p>
                                    </div>
                                </div>

                                {/* Wishlist Button */}
                                <button className="w-full flex items-center justify-center gap-2 py-2 rounded-md border border-gray-300 text-gray-700 text-sm hover:bg-gray-100 transition">
                                    <FaHeart className="text-gray-600" size={18} />
                                    Add to Wishlist
                                </button>

                                {/* Social Links */}
                                <div className="flex justify-center space-x-6 pt-3 border-t border-gray-200">
                                    <a href="#" aria-label="Facebook" className="text-gray-600 hover:text-blue-600 transition">
                                        <FaFacebookF size={18} />
                                    </a>
                                    <a href="#" aria-label="Instagram" className="text-gray-600 hover:text-pink-600 transition">
                                        <FaInstagram size={18} />
                                    </a>
                                    <a href="#" aria-label="Twitter" className="text-gray-600 hover:text-blue-400 transition">
                                        <FaTwitter size={18} />
                                    </a>
                                    <a href="#" aria-label="WhatsApp" className="text-gray-600 hover:text-green-600 transition">
                                        <FaWhatsapp size={18} />
                                    </a>
                                </div>
                            </div>
                        </div>


                        {/* Wishlist Button */}
                        <button className="w-full flex items-center justify-center gap-2 py-2 rounded-md border border-gray-300 text-gray-700 text-sm hover:bg-gray-100 transition">
                            <FaHeart className="text-gray-600" size={18} />
                            Add to Wishlist
                        </button>

                        {/* Social Links */}
                        <div className="flex justify-center space-x-6 pt-3 border-t border-gray-200">
                            <a href="#" aria-label="Facebook" className="text-gray-600 hover:text-blue-600 transition">
                                <FaFacebookF size={18} />
                            </a>
                            <a href="#" aria-label="Instagram" className="text-gray-600 hover:text-pink-600 transition">
                                <FaInstagram size={18} />
                            </a>
                            <a href="#" aria-label="Twitter" className="text-gray-600 hover:text-blue-400 transition">
                                <FaTwitter size={18} />
                            </a>
                            <a href="#" aria-label="WhatsApp" className="text-gray-600 hover:text-green-600 transition">
                                <FaWhatsapp size={18} />
                            </a>
                        </div>
                    </div>

                </div>


                {/* Product Description - aligned below image */}
                <div className="mt-6">
                    <h2 className="text-lg  text-gray-800 mb-2">
                        Product Description
                    </h2>
                    <div
                        className="text-gray-600 text-sm leading-relaxed ql-editor"
                        dangerouslySetInnerHTML={{ __html: details.description || '' }}
                    />
                </div>


            </div>
        </div>
    );
};

export default ItemView;
