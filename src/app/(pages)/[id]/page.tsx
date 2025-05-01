'use client'
import React, { useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import { ShieldCheckIcon } from '@heroicons/react/24/solid';
import itemTvThree from '@/../public/images/tvThree.png';
import itemTvOne from "@/../public/images/tvOne.png"
import itemTvTwo from "@/../public/images/tvTwo.png"
const ItemView: React.FC = () => {
    const title = "Smart LED TV 55\" 4K UHD";
    const description = "Experience stunning visuals with this 4K Smart TV featuring HDR support and immersive sound.";
    const oldPrice = 999.99;
    const price = 799.99;
    const warranty = "2-year official manufacturer warranty";

    const images: StaticImageData[] = [itemTvThree, itemTvOne, itemTvTwo, itemTvThree];
    const [selectedImage, setSelectedImage] = useState<StaticImageData>(images[0]);

    return (
        <div className="max-w-6xl mx-auto p-6  rounded-md mt-14">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Image Viewer */}
                <div>
                    <div className="relative w-full h-[300px] rounded-xl overflow-hidden">
                        <Image
                            src={selectedImage}
                            alt="Main TV Image"
                            fill
                            className="object-contain p-4"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </div>
                    <div className="flex gap-4 mt-4">
                        {images.map((img, idx) => (
                            <div
                                key={idx}
                                className={`relative w-24 h-24 border-2 rounded-md cursor-pointer ${
                                    selectedImage === img ? 'border-blue-600' : 'border-transparent'
                                }`}
                                onClick={() => setSelectedImage(img)}
                            >
                                <Image
                                    src={img}
                                    alt={`Thumbnail ${idx + 1}`}
                                    fill
                                    className="object-cover rounded-md"
                                    sizes="100px"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                    <h1 className="text-4xl font-bold">{title}</h1>
                    <p className="text-gray-600 text-lg">{description}</p>

                    {/* Price Section */}
                    <div className="space-x-4">
                        <span className="text-2xl font-semibold text-green-600">${price.toFixed(2)}</span>
                        <span className="text-xl line-through text-gray-400">${oldPrice.toFixed(2)}</span>
                    </div>

                    {/* Warranty Info */}
                    <div className="flex items-start gap-3 mt-6">
                        <ShieldCheckIcon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="text-lg font-medium">Warranty</h3>
                            <p className="text-gray-600">{warranty}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemView;
