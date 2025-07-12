import Image, {StaticImageData} from 'next/image';
import { ReactNode } from 'react';
import {images} from "next/dist/build/webpack/config/blocks/images";

interface ProductCardProps {
    imageSrc: StaticImageData;
    imageUrl?: string;
    title: string;
    oldPrice: number | string;
    newPrice: number | string;
    inStock: boolean;
}

const ProductCard = ({imageUrl, imageSrc, title, oldPrice, newPrice, inStock }: ProductCardProps) => {
    return (
        <div className="flex flex-col items-center p-4 bg-white rounded-lg hover:shadow-lg transition-shadow">
            <div className="relative w-full">
               
                  {inStock && (
                    <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        IN STOCK
                    </span>
                )}
                
                <Image
                    src={imageUrl}
                    alt={title}
                    className="rounded w-40 object-cover"
                    width={128}
                    height={128}
                />

                <p className="text-xs sm:text-sm font-semibold text-gray-700 mt-1 card-description">
                    {title}
                </p>
                <div className="flex items-center mt-1">
                    <span className="text-gray-400 line-through text-xs mr-2">
                        Rs. {oldPrice}
                    </span>
                    <span className="text-red-500 font-bold text-xs sm:text-sm">
                        Rs. {newPrice}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;



