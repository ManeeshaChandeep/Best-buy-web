import Image, { StaticImageData } from "next/image";
import Link from "next/link";

interface ProductCardProps {
    id: number;
    imageSrc: StaticImageData;
    imageUrl?: string;
    title: string;
    oldPrice: number | string;
    newPrice: number | string;
    inStock: boolean;
}

const ProductCard = ({
                         id,
                         imageSrc,
                         imageUrl,
                         title,
                         oldPrice,
                         newPrice,
                         inStock,
                     }: ProductCardProps) => {
    return (
        <Link href={`/${id}`} className="no-underline text-inherit">
            <div className="w-[180px] h-[270px] bg-white rounded-sm transition-all duration-200 flex flex-col items-center justify-between p-2 mx-1
                hover:scale-[1.03] hover:shadow-md group">

                {/* Image */}
                <div className="relative w-full h-[160px] flex justify-center items-center transition-transform duration-300 group-hover:scale-105">
                    {inStock && (
                        <span className="absolute top-1 left-1 bg-green-600 text-white text-[10px] px-2 py-0.5 rounded-full z-10">
                            In Stock
                        </span>
                    )}
                    <Image
                        src={imageUrl || imageSrc}
                        alt={title}
                        width={160}
                        height={160}
                        className="object-contain"
                        unoptimized
                    />
                </div>

                {/* Title */}
                <div className="text-center mt-2 px-1">
                    <p className="text-[12px] font-medium text-gray-800 leading-tight line-clamp-2 h-[34px] group-hover:text-red-600 transition-colors duration-200">
                        {title}
                    </p>
                </div>

                {/* Price */}
                <div className="flex flex-col items-center mt-1">
                    <span className="text-[11px] text-gray-400 line-through">Rs. {oldPrice}</span>
                    <span className="text-[12px] text-red-600 font-bold">Rs. {newPrice}</span>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
