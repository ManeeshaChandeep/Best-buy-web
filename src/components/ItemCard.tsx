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
            <div className="bg-white rounded-sm transition-all duration-200 flex flex-col items-center justify-between p-2 mx-1
                hover:scale-[1.03] hover:shadow-md group
                w-[140px] sm:w-[160px] md:w-[180px]
                h-[220px] sm:h-[250px] md:h-[270px]">

                {/* Image */}
                <div className="relative w-full flex justify-center items-center transition-transform duration-300 group-hover:scale-105
                    h-[120px] sm:h-[140px] md:h-[160px]">
                    {inStock && (
                        <span className="absolute top-1 left-1 bg-green-600 text-white text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full z-10">
                            In Stock
                        </span>
                    )}
                    <Image
                        src={imageUrl || imageSrc}
                        alt={title}
                        width={170}
                        height={170}
                        className="object-contain"
                        unoptimized
                    />
                </div>

                {/* Title */}
                <div className="text-center mt-1 px-1">
                    <p className="text-[12px] sm:text-[13px] md:text-[14px]  text-gray-800 leading-tight line-clamp-2 h-[34px] sm:h-[36px] md:h-[38px] group-hover:text-red-600 transition-colors duration-200">
                        {title}
                    </p>
                </div>

                {/* Price */}
                <div className="flex flex-col items-center mt-0.5 space-y-0.5">
                    <span className="text-[10px] sm:text-[11px] md:text-[12px] text-gray-400 line-through">Rs. {oldPrice}</span>
                    <span className="text-[12px] sm:text-[13px] md:text-[14px] text-red-600 font-bold">Rs. {newPrice}</span>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
