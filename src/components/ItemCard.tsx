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
            <div className="w-[160px] h-[220px] bg-white border border-gray-200 rounded-md flex flex-col overflow-hidden p-2 hover:border-red-500 transition-all">
                {/* Image Box */}
                <div className="relative w-full h-[110px] flex justify-center items-center bg-white">
                    {inStock && (
                        <span className="absolute top-1 left-1 bg-green-600 text-white text-[10px] px-2 py-0.5 rounded-full z-10">
              In Stock
            </span>
                    )}
                    <Image
                        src={imageUrl || imageSrc}
                        alt={title}
                        width={80}
                        height={80}
                        className="object-contain"
                        unoptimized
                    />
                </div>

                {/* Info */}
                <div className="flex flex-col justify-between flex-grow text-center mt-2 px-1">
                    <p className="text-[11px] text-gray-800 line-clamp-2 h-[30px]">{title}</p>
                    <div className="flex items-center justify-center gap-1 mt-1">
                        <span className="text-[10px] text-gray-400 line-through">Rs. {oldPrice}</span>
                        <span className="text-[11px] text-red-600 font-semibold">Rs. {newPrice}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
