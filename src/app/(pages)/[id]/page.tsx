'use client'
import React, {useEffect, useState} from 'react';
import Image, {StaticImageData} from 'next/image';
import {ShieldCheckIcon} from '@heroicons/react/24/solid';
import itemTvThree from '@/../public/images/tvThree.png';
import itemTvOne from "@/../public/images/tvOne.png"
import itemTvTwo from "@/../public/images/tvTwo.png"
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {useParams} from "next/navigation";
import {apiClient} from "@/libs/network";

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
    const {id} = useParams();

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
                console.log('Product:', res);
                setDetails(res)
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
            <div className="max-w-6xl mx-auto p-6  rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Image Viewer */}
                    <div>
                        <div className="relative w-full h-[300px] rounded-xl overflow-hidden">
                            {/* Main image */}
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

                    {/* Product Info */}
                    <div className="space-y-3">
                        <h1 className="text-xl font-semibold">{details.name}</h1>

                        {/* Price Section */}
                        <div className="space-x-4">
                              <span className="text-2xl font-semibold text-green-600">
                                Rs. {Number(details.price).toLocaleString()}
                              </span>
                            {details.old_price && (
                                <span className="text-xl line-through text-gray-400">
                                  Rs. {Number(details.old_price).toLocaleString()}
                                </span>
                            )}
                        </div>

                        <p className="text-gray-600 text-lg ql-editor" dangerouslySetInnerHTML={{ __html: details.description || '' }} />


                        {/* Warranty Info */}
                        <div className="flex items-start gap-3 mt-6">
                            <ShieldCheckIcon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-lg font-medium">Warranty</h3>
                                <p className="text-gray-600">{details.warranty ? details.warranty + ' year(s)' : 'No warranty info'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemView;
